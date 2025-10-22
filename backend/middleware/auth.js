import jwt from "jsonwebtoken";

/**
 * requireAuth 
 * - Express header: Authorization: Bearer <token>
 * - Verifies JWT with JWT_SECRET
 * - Attaches { id, role } to req.user
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // Make sure this matches your JWT payload
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * requireRole(...roles)
 * - Allows only users whose role is in the provided list
 * - Use after requireAuth
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
