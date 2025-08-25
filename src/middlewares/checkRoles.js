// src/middlewares/checkRoles.js
export const checkRoles = (allowedRoles = []) => (req, res, next) => {
  const user = req.user; // припускаємо, що у req.user зберігається авторизований користувач
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const hasRole = allowedRoles.includes(user.role);
  if (!hasRole) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
