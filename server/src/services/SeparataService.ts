import Separata, { ISeparata } from '../models/Separata';

export class SeparataService {
    async createSeparata(data: Partial<ISeparata>): Promise<ISeparata> {
        const { products, startTime, endTime } = data;

        if (!products || products.length === 0) {
            throw new Error("Separata must have at least one product.");
        }

        // Validate overlapping
        const overlap = await Separata.findOne({
            products: { $in: products },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (overlap) {
            throw new Error(`Overlap detected with existing Separata: ${overlap.name}`);
        }

        const separata = new Separata(data);
        return await separata.save();
    }

    async getAllSeparatas(): Promise<ISeparata[]> {
        return await Separata.find().populate('products');
    }

    // Method to check overlap for a new potential range (useful for UI validation before submit if needed)
    async checkOverlap(productIds: string[], start: Date, end: Date): Promise<boolean> {
        const overlap = await Separata.findOne({
            products: { $in: productIds },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });
        return !!overlap;
    }
}

export const separataService = new SeparataService();
