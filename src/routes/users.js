const express = require('express');
const auth    = require('../middleware/auth');
const db      = require('../models/db');

const router = express.Router();

// GET /api/users/me — protected
router.get('/me', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id=$1',
      [req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users — protected
router.get('/', auth, async (req, res) => {
  const result = await db.query(
    'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(result.rows);
});

module.exports = router;
