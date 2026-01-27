import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    basePrice: number;
    image?: string;
    category?: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
