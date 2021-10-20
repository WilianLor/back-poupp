import jwt from "jsonwebtoken";
import User from "../models/User";
import "../services/env";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Forbidden: No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length === !2) {
    return res.status(401).send({ error: "Forbidden: Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Forbidden: Token Malformatted" });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Forbidden: Token Invalid" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(406).json({ error: "This user id is invalid." });
    }

    req.userId = decoded.id;
    return next();
  });
};
