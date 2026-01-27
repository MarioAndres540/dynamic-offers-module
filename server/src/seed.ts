import mongoose from 'mongoose';
import Product from './models/Product';
import Separata from './models/Separata';
import dotenv from 'dotenv';

dotenv.config();

const products = [
    {
        name: 'Laptop Dell Inspiron 15',
        basePrice: 749.99,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80'
    },
    {
        name: 'Monitor LG 27" 4K',
        basePrice: 399.99,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80'
    },
    {
        name: 'Tablet iPad Air',
        basePrice: 599.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80'
    },
    {
        name: 'Auriculares Sony WH-1000XM5',
        basePrice: 349.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
    }
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/kodigo_fuente_offers';
        await mongoose.connect(mongoURI);

        await Product.deleteMany({});
        await Separata.deleteMany({});

        const createdProducts = await Product.insertMany(products);

        // Create initial Separatas
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + 7);

        const past = new Date();
        past.setDate(now.getDate() - 10);
        const pastEnd = new Date();
        pastEnd.setDate(now.getDate() - 3);

        await Separata.create([
            {
                name: 'Black Friday 2026',
                description: 'Descuentos especiales para Black Friday',
                products: [createdProducts[0]._id, createdProducts[1]._id, createdProducts[2]._id],
                startTime: now,
                endTime: future,
                promotionType: 'percentage',
                promotionValue: 15
            },
            {
                name: 'Ofertas de Verano',
                description: 'Promociones exclusivas de temporada',
                products: [createdProducts[3]._id],
                startTime: past,
                endTime: pastEnd,
                promotionType: 'fixed',
                promotionValue: 50
            }
        ]);

        console.log('Database Seeded with rich data!');
        process.exit();
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
