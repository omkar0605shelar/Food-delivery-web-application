import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal: Number,
    shopOrderItems: [shopOrderItemSchema],
  },
  {
    timestamps: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },
    deliveryAddress: {
      text: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    totalAmount: {
      type: Number,
    },
    shopOrders: [shopOrderSchema],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
