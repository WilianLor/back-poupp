import User from "../models/User";
import jwt from "jsonwebtoken";
import "../services/env";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Forbidden: No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length === !2) {
    return res.status(401).json({ error: "Forbidden: Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Forbidden: Token Malformatted" });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Forbidden: Token Invalid" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(406).json({ error: "This user id is invalid." });
    }

    if (!user.admin) {
      return res.status(401).json({ error: "Permission required." });
    }

    req.userId = decoded.id;
    return next();
  });
};
