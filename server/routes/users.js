import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create user
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if exists
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const user = new User({ username, email, password, role });
        await user.save();

        await AuditLog.create({
            user: req.user.userId,
            action: 'user_created',
            entityType: 'user',
            entityId: user._id,
            entityName: user.username
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Import users from CSV
router.post('/import/csv', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data)) {
            return res.status(400).json({ message: 'Data must be an array' });
        }

        const results = { success: 0, failed: 0, errors: [] };

        for (const item of data) {
            try {
                if (!item.username || !item.email || !item.password || !item.role) {
                    results.failed++;
                    continue; // Skip invalid
                }

                // Check existence
                const existing = await User.findOne({ $or: [{ username: item.username }, { email: item.email }] });
                if (existing) {
                    results.failed++;
                    continue;
                }

                const user = new User({
                    username: item.username,
                    email: item.email,
                    password: item.password, // Model pre-save hook handles hashing
                    role: item.role,
                    isActive: true
                });
                await user.save();
                results.success++;
            } catch (err) {
                results.failed++;
                results.errors.push(`Row ${item.username}: ${err.message}`);
            }
        }

        await AuditLog.create({
            user: req.user.userId,
            action: 'csv_imported',
            entityType: 'user',
            entityName: `Bulk import: ${results.success} users`
        });

        res.json({ count: results.success, ...results });
    } catch (error) {
        console.error('Import users error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update user
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { username, email, role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        if (req.body.password) {
            user.password = req.body.password; // pre-save hook will hash
        }

        await user.save();

        await AuditLog.create({
            user: req.user.userId,
            action: 'user_updated',
            entityType: 'user',
            entityId: user._id,
            entityName: user.username
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await AuditLog.create({
            user: req.user.userId,
            action: 'user_deleted',
            entityType: 'user',
            entityId: user._id,
            entityName: user.username
        });

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
