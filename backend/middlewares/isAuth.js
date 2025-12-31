import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    // No token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token invalid
    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Token expired or invalid",
    });
  }
};

export default isAuth;
