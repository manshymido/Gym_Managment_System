// Multi-tenancy middleware to ensure data isolation
// This middleware ensures that gym managers can only access their own data

export const tenantIsolation = (req, res, next) => {
  if (req.userType === 'gym_manager' && req.gymManager) {
    // Add gymManager filter to request for all queries
    req.tenantId = req.gymManager._id;
  }
  next();
};

// Middleware to verify that the resource belongs to the tenant
export const verifyTenantAccess = (Model) => {
  return async (req, res, next) => {
    try {
      if (req.userType !== 'gym_manager') {
        return next();
      }

      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ message: 'المورد غير موجود' });
      }

      // Check if resource belongs to the gym manager
      if (resource.gymManager && resource.gymManager.toString() !== req.gymManager._id.toString()) {
        return res.status(403).json({ message: 'غير مصرح بالوصول إلى هذا المورد' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: 'خطأ في التحقق من الصلاحيات' });
    }
  };
};

