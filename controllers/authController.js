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

  const isMatch = await compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jsonwebtoken.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
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
        expiresIn: "7d",
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
