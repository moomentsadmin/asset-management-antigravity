import express from 'express';
import AssetType from '../models/AssetType.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// Get all asset types
router.get('/', authenticateToken, async (req, res) => {
  try {
    const assetTypes = await AssetType.find({ isActive: true }).sort({ name: 1 });
    res.json(assetTypes);
  } catch (error) {
    console.error('Get asset types error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get asset type by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const assetType = await AssetType.findById(req.params.id);
    if (!assetType) {
      return res.status(404).json({ message: 'Asset Type not found' });
    }
    res.json(assetType);
  } catch (error) {
    console.error('Get asset type error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create asset type
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description, depreciationRate, warrantyMonths, customFields } = req.body;

    const existingType = await AssetType.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingType) {
      return res.status(400).json({ message: 'Asset Type already exists' });
    }

    const assetType = new AssetType({
      name,
      description,
      depreciationRate,
      warrantyMonths,
      customFields
    });

    await assetType.save();

    await AuditLog.create({
      user: req.user.userId,
      action: 'create',
      entityType: 'asset_type',
      entityId: assetType._id,
      entityName: assetType.name,
      details: `Created asset type: ${assetType.name}`
    });

    res.status(201).json(assetType);
  } catch (error) {
    console.error('Create asset type error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update asset type
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const assetType = await AssetType.findById(req.params.id);
    if (!assetType) {
      return res.status(404).json({ message: 'Asset Type not found' });
    }

    const oldData = assetType.toObject();
    
    // Prevent updating name to an existing one
    if (req.body.name && req.body.name.toLowerCase() !== assetType.name.toLowerCase()) {
        const existingType = await AssetType.findOne({ 
            name: new RegExp(`^${req.body.name}$`, 'i'),
            _id: { $ne: assetType._id }
        });
        if (existingType) {
            return res.status(400).json({ message: 'Asset Type with this name already exists' });
        }
    }

    Object.assign(assetType, req.body);
    assetType.updatedAt = new Date();
    await assetType.save();

    await AuditLog.create({
      user: req.user.userId,
      action: 'update',
      entityType: 'asset_type',
      entityId: assetType._id,
      entityName: assetType.name,
      changes: { before: oldData, after: assetType.toObject() }
    });

    res.json(assetType);
  } catch (error) {
    console.error('Update asset type error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete asset type (Soft delete)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const assetType = await AssetType.findById(req.params.id);
    if (!assetType) {
      return res.status(404).json({ message: 'Asset Type not found' });
    }

    // Instead of permanant delete, just set isActive to false or handle logic
    // But since we want to be able to remove it from lists, we might want real delete 
    // if no assets are using it. For now, let's do safe delete check.
    
    // Check if any assets use this type (by name matching for now as per mixed architecture)
    // In a strict relational model we'd check ID. Here we check the string name.
    const Asset = (await import('../models/Asset.js')).default;
    const assetsUsingType = await Asset.countDocuments({ type: assetType.name }); // imprecise if casing differs, but name is unique

    if (assetsUsingType > 0) {
        return res.status(400).json({ 
            message: `Cannot delete asset type. It is currently assigned to ${assetsUsingType} assets.` 
        });
    }

    await AssetType.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      user: req.user.userId,
      action: 'delete',
      entityType: 'asset_type',
      entityId: assetType._id,
      entityName: assetType.name
    });

    res.json({ message: 'Asset Type deleted successfully' });
  } catch (error) {
    console.error('Delete asset type error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
