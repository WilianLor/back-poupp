import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: ".env"
})

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("No token provided");
    return res.status(401).send({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length === !2) {
    console.log("Token error");
    return res.status(401).send({ error: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log("Token Malformatted");
    return res.status(401).send({ error: "Token Malformatted" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Token Invalid");
      return res.status(401).send({ error: "Token Invalid" });
    }

    req.userId = decoded.id;
    return next();
  });
};
