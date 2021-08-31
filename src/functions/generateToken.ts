import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
};

export default generateToken;
