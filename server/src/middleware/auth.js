import jwt from 'jsonwebtoken';
import db from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishimitra-mce-cse-mini-project-secret-key-2026';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in or use Demo Farmer Access.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.prepare('SELECT id, name, email, phone, location, state FROM users WHERE id = ?').get(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Farmer account not found or session has expired.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.'
    });
  }
}
