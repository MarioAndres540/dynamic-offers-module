import mongoose, { Schema, Document } from 'mongoose';

export interface ISeparataProduct {
    product: mongoose.Types.ObjectId;
    promotionType: 'fixed' | 'percentage';
    promotionValue: number;
}

export interface ISeparata extends Document {
    items: ISeparataProduct[];
    name: string;
    description?: string;
    startTime: Date;
    endTime: Date;
}

const SeparataSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        promotionType: { type: String, enum: ['fixed', 'percentage'], required: true },
        promotionValue: { type: Number, required: true },
    }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});

// Index to help with overlap queries, though complex range overlaps usually need explicit logic
SeparataSchema.index({ 'items.product': 1, startTime: 1, endTime: 1 });

export default mongoose.model<ISeparata>('Separata', SeparataSchema);
