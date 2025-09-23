  import jwt from "jsonwebtoken";

  export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không tìm thấy token." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token payload:", decoded); 
      req.user = {
        idUser: decoded.idUser, // map id token thành idUser nếu muốn
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ." });
    }
  };

  // Export authorize luôn
  export const authorize = (roles = []) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Không có quyền truy cập." });
      }
      next();
    };
  }