import jsonwebtoken from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Make available for controllers
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
}
