import jwt from "jsonwebtoken";

/**
 * requireAuth 
 * - Express header: Authorization: Bearer <token>
 * - Verifies JWT with JWT_SECRET
 * - Attaches { id, role } to req.user
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Add this line
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/**
 * requireRole(...roles)
 * - Allows only users whose role is in the provided list
 * - Use after requireAuth
 */
export function requireRole(role) {
  return (req, res, next) => {
    console.log("User role:", req.user.role, "Required role:", role); // Add this line
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
