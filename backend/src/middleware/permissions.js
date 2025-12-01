// Permission middleware for role-based access control

export const requireAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ message: 'يتطلب صلاحيات المدير' });
  }
  next();
};

export const requireGymManager = (req, res, next) => {
  if (req.userType !== 'gym_manager') {
    return res.status(403).json({ message: 'يتطلب صلاحيات مدير الجيم' });
  }
  next();
};

