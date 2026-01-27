import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kodigo_fuente_offers';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
