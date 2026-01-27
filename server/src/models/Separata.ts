import mongoose, { Schema, Document } from 'mongoose';

export interface ISeparata extends Document {
    products: mongoose.Types.ObjectId[];
    name: string;
    startTime: Date;
    endTime: Date;
    promotionType: 'fixed' | 'percentage';
    promotionValue: number; // For fixed, it's the discount amount? or the final price? Requirement says "Precio de oferta". 
    // "Descuento Directo (monto fijo) o Porcentaje". 
    // If Fixed: Discount amount off the price? Or fixed override price?
    // User says "Descuento Directo (monto fijo)". E.g. $10 off.  
    // Let's assume Discount Amount for now, as it's cleaner.
}

const SeparataSchema: Schema = new Schema({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    promotionType: { type: String, enum: ['fixed', 'percentage'], required: true },
    promotionValue: { type: Number, required: true },
});

// Index to help with overlap queries, though complex range overlaps usually need explicit logic
SeparataSchema.index({ products: 1, startTime: 1, endTime: 1 });

export default mongoose.model<ISeparata>('Separata', SeparataSchema);
