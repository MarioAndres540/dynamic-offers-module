import mongoose from 'mongoose';
import Product from './models/Product';
import dotenv from 'dotenv';

dotenv.config();

const products = [
    { name: 'Arroz 1kg', basePrice: 1500 },
    { name: 'Leche 1L', basePrice: 2200 },
    { name: 'Pan Tajado', basePrice: 3500 },
    { name: 'Huevos x12', basePrice: 5000 },
    { name: 'Café 500g', basePrice: 8000 },
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/kodigo_fuente_offers';
        await mongoose.connect(mongoURI);

        await Product.deleteMany({});
        await Product.insertMany(products);

        console.log('Database Seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
