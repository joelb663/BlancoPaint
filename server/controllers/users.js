import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID and select only the email field
    const user = await User.findById(id).select('email');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const {
      name,
      phone,
      email,
    } = req.body;

    // Update user fields with the new data
    user.name = name;
    user.phone = phone;
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};