import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Extract token from Bearer <token>
      token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Not authorized, token missing',
        });
      }

      // Verify token
      const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_change_in_production';
      const decoded = jwt.verify(token, secret);

      // Find user from decoded payload ID (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          error: 'Not authorized, user not found',
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({
        error: error.name === 'TokenExpiredError' 
          ? 'Not authorized, token has expired' 
          : 'Not authorized, invalid token',
      });
    }
  } else {
    return res.status(401).json({
      error: 'Not authorized, no Bearer token provided',
    });
  }
};

/**
 * Middleware to restrict access to specified roles
 * @param  {...string} roles - e.g. 'host', 'admin'
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles: [${roles.join(', ')}]. Your role is '${req.user?.role || 'unauthenticated'}'.`,
      });
    }
    next();
  };
};
