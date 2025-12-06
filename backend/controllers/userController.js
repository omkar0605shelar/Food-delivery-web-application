import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get current user error ${error.message}` });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude required" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [lon, lat],
          },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "USer not found" });
    }

    return res.status(200).json({ message: "Location updated", user });
  } catch (e) {
    return res.status(500).json(`update location error ${e.message}`);
  }
};
