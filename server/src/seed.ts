import mongoose from 'mongoose';
import Product from './models/Product';
import Separata from './models/Separata';
import dotenv from 'dotenv';

dotenv.config();

const products = [
    {
        name: 'Laptop Dell Inspiron 15',
        basePrice: 899.99,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
        category: 'Computadoras'
    },
    {
        name: 'Monitor LG 27" 4K',
        basePrice: 449.99,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
        category: 'Monitores'
    },
    {
        name: 'Tablet iPad Air',
        basePrice: 599.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
        category: 'Tablets'
    },
    {
        name: 'Mouse Logitech MX Master 3',
        basePrice: 99.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
        category: 'Accesorios'
    },
    {
        name: 'Teclado Mecánico Corsair K70',
        basePrice: 159.99,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80',
        category: 'Accesorios'
    },
    {
        name: 'Webcam Logitech C920',
        basePrice: 79.99,
        image: 'https://images.unsplash.com/photo-1612444315754-ef850bad2210?w=400&q=80',
        category: 'Accesorios'
    }
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kodigo_fuente_offers';
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
                items: [
                    { product: createdProducts[0]._id, promotionType: 'percentage', promotionValue: 15 },
                    { product: createdProducts[1]._id, promotionType: 'percentage', promotionValue: 20 },
                    { product: createdProducts[2]._id, promotionType: 'fixed', promotionValue: 100 }
                ],
                startTime: now,
                endTime: future
            },
            {
                name: 'Ofertas de Verano',
                description: 'Promociones exclusivas de temporada',
                items: [
                    { product: createdProducts[3]._id, promotionType: 'fixed', promotionValue: 50 }
                ],
                startTime: past,
                endTime: pastEnd
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
