import { randomUUID } from 'node:crypto';
import db from '../db/db.js';

export function getFarms(req, res) {
  try {
    const farms = db.prepare('SELECT * FROM farms WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC').all(req.user.id);
    return res.json({ success: true, farms });
  } catch (error) {
    console.error('Error fetching farms:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve farms.' });
  }
}

export function createFarm(req, res) {
  try {
    const { farmName, location, district, state, soilType, areaAcres, isPrimary } = req.validatedBody;
    const farmId = randomUUID();

    if (isPrimary) {
      // Clear previous primary
      db.prepare('UPDATE farms SET is_primary = 0 WHERE user_id = ?').run(req.user.id);
    }

    db.prepare(`
      INSERT INTO farms (id, user_id, farm_name, location, district, state, soil_type, area_acres, is_primary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      farmId,
      req.user.id,
      farmName,
      location,
      district || 'Hassan',
      state || 'Karnataka',
      soilType,
      areaAcres,
      isPrimary ? 1 : 0
    );

    const farm = db.prepare('SELECT * FROM farms WHERE id = ?').get(farmId);
    return res.status(201).json({ success: true, message: 'Farm plot registered successfully', farm });
  } catch (error) {
    console.error('Error creating farm:', error);
    return res.status(500).json({ success: false, error: 'Failed to register farm plot.' });
  }
}

export function updateFarm(req, res) {
  try {
    const farmId = req.params.id;
    const farm = db.prepare('SELECT * FROM farms WHERE id = ? AND user_id = ?').get(farmId, req.user.id);
    if (!farm) {
      return res.status(404).json({ success: false, error: 'Farm plot not found or permission denied.' });
    }

    const { farmName, location, district, state, soilType, areaAcres, isPrimary } = req.body;

    if (isPrimary) {
      db.prepare('UPDATE farms SET is_primary = 0 WHERE user_id = ?').run(req.user.id);
    }

    db.prepare(`
      UPDATE farms
      SET farm_name = ?, location = ?, district = ?, state = ?, soil_type = ?, area_acres = ?, is_primary = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      farmName || farm.farm_name,
      location || farm.location,
      district || farm.district,
      state || farm.state,
      soilType || farm.soil_type,
      areaAcres != null ? areaAcres : farm.area_acres,
      isPrimary != null ? (isPrimary ? 1 : 0) : farm.is_primary,
      farmId,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM farms WHERE id = ?').get(farmId);
    return res.json({ success: true, message: 'Farm updated', farm: updated });
  } catch (error) {
    console.error('Error updating farm:', error);
    return res.status(500).json({ success: false, error: 'Failed to update farm.' });
  }
}

export function deleteFarm(req, res) {
  try {
    const farmId = req.params.id;
    const farm = db.prepare('SELECT * FROM farms WHERE id = ? AND user_id = ?').get(farmId, req.user.id);
    if (!farm) {
      return res.status(404).json({ success: false, error: 'Farm not found or permission denied.' });
    }

    db.prepare('DELETE FROM farms WHERE id = ? AND user_id = ?').run(farmId, req.user.id);
    return res.json({ success: true, message: 'Farm plot removed successfully' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete farm plot.' });
  }
}
