import User from "../models/User.js";
import { genSalt, hash as _hash, compare } from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const salt = await genSalt(10);
  const hash = await _hash(password, salt);

  const user = new User({ name, email, passwordHash: hash });
  await user.save();

  res.status(201).json({ msg: "Registered" });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jsonwebtoken.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Token Payload:", ticket.getPayload());

    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    const jwtToken = jsonwebtoken.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token: jwtToken });
    console.log("User logged in with Google:", user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid Google token" });
  }
};

export async function getProfile(req, res) {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
}

export async function getUserById(req, res) {
  const { userId } = req.params;

  console.log("Fetching user by ID:", userId);

  const user = await User.findById(userId).select("-passwordHash");
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json(user);
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// make member to admin
export async function makeAdmin(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = "Admin";
    await user.save();

    res.json({ msg: "User role updated to Admin", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user role" });
  }
}
