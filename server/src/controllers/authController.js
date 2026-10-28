import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import db from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishimitra-mce-cse-mini-project-secret-key-2026';

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password, phone, location, state } = req.validatedBody;

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = randomUUID();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, location, state)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, passwordHash, phone || '', location, state || 'Karnataka');

    // Create a default primary farm plot for the newly registered farmer
    const farmId = randomUUID();
    db.prepare(`
      INSERT INTO farms (id, user_id, farm_name, location, district, state, soil_type, area_acres, is_primary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(farmId, userId, `${name}'s Primary Plot`, location, 'Hassan', state || 'Karnataka', 'red_loamy', 3.0, 1);

    const token = generateToken(userId);

    return res.status(201).json({
      success: true,
      message: 'Farmer account created successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        phone,
        location,
        state
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete registration. Please try again.'
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed due to a server error.'
    });
  }
}

export async function demoLogin(req, res) {
  try {
    let demoUser = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@krishimitra.agr');
    
    // If not seeded yet, seed or create
    if (!demoUser) {
      const demoId = 'demo-farmer-mce-001';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Demo@123', salt);
      
      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, phone, location, state)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(demoId, 'Ramesh Patil', 'demo@krishimitra.agr', passwordHash, '+91 98450 12345', 'Hassan, Karnataka', 'Karnataka');

      demoUser = db.prepare('SELECT * FROM users WHERE id = ?').get(demoId);
    }

    const token = generateToken(demoUser.id);

    return res.json({
      success: true,
      message: 'Logged in as Demo Farmer (Ramesh Patil, Hassan)',
      isDemoAccount: true,
      token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        location: demoUser.location,
        state: demoUser.state
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to initialize demo account session.'
    });
  }
}

export function getCurrentUser(req, res) {
  try {
    const user = req.user;
    const farms = db.prepare('SELECT * FROM farms WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC').all(user.id);
    const recCount = db.prepare('SELECT COUNT(*) as count FROM recommendations WHERE user_id = ?').get(user.id);

    return res.json({
      success: true,
      user: {
        ...user,
        farms,
        totalRecommendations: recCount ? recCount.count : 0
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile.'
    });
  }
}
