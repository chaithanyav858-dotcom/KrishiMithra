import db from '../db/db.js';

export function getProfile(req, res) {
  try {
    const user = db.prepare('SELECT id, name, email, phone, location, state, created_at FROM users WHERE id = ?').get(req.user.id);
    const farms = db.prepare('SELECT * FROM farms WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC').all(req.user.id);
    const stats = db.prepare('SELECT COUNT(*) as count FROM recommendations WHERE user_id = ?').get(req.user.id);

    return res.json({
      success: true,
      profile: {
        ...user,
        farms,
        consultationCount: stats ? stats.count : 0
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile data.' });
  }
}

export function updateProfile(req, res) {
  try {
    const { name, phone, location, state } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters.' });
    }

    db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, location = ?, state = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(name.trim(), phone || '', location || 'Hassan, Karnataka', state || 'Karnataka', req.user.id);

    const updatedUser = db.prepare('SELECT id, name, email, phone, location, state, created_at FROM users WHERE id = ?').get(req.user.id);

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
}
