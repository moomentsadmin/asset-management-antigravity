import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AssetType from '../models/AssetType.js';

dotenv.config();

const defaultTypes = [
    { name: 'hardware', description: 'Physical hardware assets' },
    { name: 'software', description: 'Software licenses and subscriptions' },
    { name: 'accessory', description: 'Peripherals and accessories' },
    { name: 'office_equipment', description: 'Furniture and office equipment' },
    { name: 'vehicle', description: 'Company vehicles' }
];

const seedAssetTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const type of defaultTypes) {
            const existing = await AssetType.findOne({ name: type.name });
            if (!existing) {
                await AssetType.create(type);
                console.log(`Created asset type: ${type.name}`);
            } else {
                console.log(`Asset type already exists: ${type.name}`);
            }
        }

        console.log('Asset Type seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedAssetTypes();
