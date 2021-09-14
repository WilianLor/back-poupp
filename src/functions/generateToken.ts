import jwt from "jsonwebtoken";
import "../services/env"

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
};

export default generateToken;
