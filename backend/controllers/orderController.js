// controllers/orderController.js
import Shop from "../models/shopModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import DeliveryAssignment from "../models/deliveryAssignmentModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod, totalAmount } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ message: "Incomplete delivery address" });
    }

    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) throw new Error("Shop not found for id " + shopId);

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i._id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json(newOrder);
  } catch (e) {
    return res.status(500).json({ message: `place order error ${e}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // USER
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    }

    // OWNER — IMPORTANT: populate BEFORE filtering so fields remain available
    if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("user", "fullName email mobile")
        .select(
          "deliveryAddress paymentMethod totalAmount shopOrders createdAt"
        );

      const filteredOrders = orders.map((order) => {
        const ownerShopOrders = order.shopOrders.filter(
          (s) => s.owner && s.owner._id.toString() === req.userId.toString()
        );

        return {
          _id: order._id,
          paymentMethod: order.paymentMethod,
          user: order.user,
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress,
          shopOrders: ownerShopOrders,
        };
      });

      return res.status(200).json(filteredOrders);
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (e) {
    return res.status(500).json({ message: `get user Order error ${e}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId)
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.assignedDeliveryBoy", "fullName mobile email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop._id.toString() === shopId
    );

    if (!shopOrder) {
      console.log("ShopOrder not found for:", shopId);
      return res.status(404).json({
        message: "shop Order not found",
        shopOrders: order.shopOrders,
      });
    }

    shopOrder.status = status;

    let deliveryBoysPayload = [];

    if (status === "out for delivery" || !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000,
          },
        },
      });

      // Welcome, pimparideliveryboy
      // Latitude: 18.626076, Longitude: 73.812157

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busySet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busySet.has(String(b._id))
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message: "Order updated but no delivery boys available",
          shopOrder,
          availableBoys: [],
        });
      }

      const assignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop._id,
        shopOrderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignment = assignment._id;
      shopOrder.assignedDeliveryBoy = assignment.assignedTo;

      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        mobile: b.mobile,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
      }));
    }

    await order.save();

    const updatedShopOrder = order.shopOrders.find(
      (o) => o.shop._id.toString() === shopId
    );

    return res.status(200).json({
      message: "Status updated",
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment,
    });
  } catch (e) {
    console.error("Update status error:", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};
