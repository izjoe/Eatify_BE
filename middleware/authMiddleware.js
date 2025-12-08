import jwt from "jsonwebtoken";

// Middleware xác thực token
export const requireAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //  Lưu userId vào req.userId (ưu tiên dùng cái này)
    req.userId = decoded.id;
    
    //  Cũng lưu vào req.body.userId cho backward compatibility
    req.body.userId = decoded.id;
    
    req.user = decoded; // decoded chứa {id, role}

    next();
  } catch (error) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

// Middleware yêu cầu quyền seller
export const requireSeller = (req, res, next) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({ msg: "Seller access required" });
  }
  next();
};

// Middleware yêu cầu quyền buyer
export const requireBuyer = (req, res, next) => {
  if (req.user?.role !== "buyer" && req.user?.role !== "user") {
    return res.status(403).json({ msg: "Buyer access required" });
  }
  next();
};

// Middleware yêu cầu quyền admin
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

// Export default auth middleware
export default requireAuth;
