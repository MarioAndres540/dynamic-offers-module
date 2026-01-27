import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    basePrice: number;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    basePrice: { type: Number, required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
