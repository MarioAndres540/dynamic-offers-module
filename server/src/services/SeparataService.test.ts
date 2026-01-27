import { SeparataService } from '../services/SeparataService';
import Separata from '../models/Separata';

jest.mock('../models/Separata');

describe('SeparataService - Overlap Validation', () => {
    let service: SeparataService;

    beforeEach(() => {
        service = new SeparataService();
        jest.clearAllMocks();
    });

    it('should throw error if there is an overlap', async () => {
        (Separata.findOne as jest.Mock).mockResolvedValue({ name: 'Existing Separata' });

        const newSeparata = {
            products: ['id1'] as any,
            startTime: new Date('2024-01-05'),
            endTime: new Date('2024-01-15'),
        };

        await expect(service.createSeparata(newSeparata)).rejects.toThrow('Overlap detected');
    });

    it('should create separata if no overlap', async () => {
        (Separata.findOne as jest.Mock).mockResolvedValue(null);
        (Separata.prototype.save as jest.Mock).mockResolvedValue({ name: 'New' });

        const newSeparata = {
            name: 'New',
            products: ['id1'] as any,
            startTime: new Date('2024-01-20'),
            endTime: new Date('2024-01-30'),
            promotionType: 'fixed',
            promotionValue: 10
        };

        const result = await service.createSeparata(newSeparata as any);
        expect(result).toBeDefined();
        expect(Separata.prototype.save).toHaveBeenCalled();
    });
});
