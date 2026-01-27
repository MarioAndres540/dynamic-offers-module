import Separata, { ISeparata } from '../models/Separata';

export class SeparataService {
    async createSeparata(data: Partial<ISeparata>): Promise<ISeparata> {
        const items = data.items || [];
        const startTime = new Date(data.startTime!);
        const endTime = new Date(data.endTime!);

        if (items.length === 0) {
            throw new Error("Separata debe tener al menos un producto.");
        }

        const productIds = items.map(i => i.product);

        // Validate overlapping
        const overlap = await Separata.findOne({
            'items.product': { $in: productIds },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        }).populate('items.product');

        if (overlap) {
            const conflictingProducts = (overlap.items || [])
                .filter(i => productIds.some(id => id.toString() === (i.product as any)._id.toString()))
                .map(i => (i.product as any).name);

            const productNames = conflictingProducts.join(', ');
            throw new Error(`Conflicto con la separata existente: ${overlap.name}. Los siguientes productos ya tienen promociones en esas fechas: ${productNames}`);
        }

        const separata = new Separata(data);
        return await separata.save();
    }

    async getAllSeparatas(): Promise<ISeparata[]> {
        return await Separata.find().populate('items.product');
    }

    async updateSeparata(id: string, data: Partial<ISeparata>): Promise<ISeparata | null> {
        const items = data.items;
        const startTime = data.startTime ? new Date(data.startTime) : undefined;
        const endTime = data.endTime ? new Date(data.endTime) : undefined;

        if (items && items.length > 0 && startTime && endTime) {
            const productIds = items.map(i => i.product);
            // Validate overlapping (excluding current one)
            const overlap = await Separata.findOne({
                _id: { $ne: id },
                'items.product': { $in: productIds },
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
                ]
            }).populate('items.product');

            if (overlap) {
                const conflictingProducts = (overlap.items || [])
                    .filter(i => productIds.some(pid => pid.toString() === (i.product as any)._id.toString()))
                    .map(i => (i.product as any).name);

                const productNames = conflictingProducts.join(', ');
                throw new Error(`Conflicto con la separata existente: ${overlap.name}. Los siguientes productos ya tienen promociones en esas fechas: ${productNames}`);
            }
        }

        return await Separata.findByIdAndUpdate(id, data, { new: true }).populate('items.product');
    }

    // Method to check overlap for a new potential range (useful for UI validation before submit if needed)
    async checkOverlap(productIds: string[], start: Date, end: Date): Promise<boolean> {
        const overlap = await Separata.findOne({
            'items.product': { $in: productIds },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });
        return !!overlap;
    }
}

export const separataService = new SeparataService();
