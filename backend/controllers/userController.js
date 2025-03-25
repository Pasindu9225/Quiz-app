import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password, profilePic });

  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({ token, user });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = req.user;
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = req.user;
  const { name, profilePic } = req.body;

  if (name) user.name = name;
  if (profilePic) user.profilePic = profilePic;

  const updatedUser = await user.save();
  res.json({ message: "User updated successfully", user: updatedUser });
};

export const deleteUser = async (req, res) => {
  const user = req.user;
  await User.findByIdAndDelete(user._id);
  res.json({ message: "User deleted successfully" });
};
