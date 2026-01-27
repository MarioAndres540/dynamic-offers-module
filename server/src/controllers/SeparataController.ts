import { Request, Response } from 'express';
import { separataService } from '../services/SeparataService';
import Product from '../models/Product';

export class SeparataController {
    async create(req: Request, res: Response) {
        try {
            console.log('Creating Separata with data:', JSON.stringify(req.body, null, 2));
            const separata = await separataService.createSeparata(req.body);
            res.status(201).json(separata);
        } catch (error: any) {
            console.error('Error in createSeparata:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const separatads = await separataService.getAllSeparatas();
            res.json(separatads);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            console.log(`Updating Separata ${req.params.id} with data:`, JSON.stringify(req.body, null, 2));
            const separata = await separataService.updateSeparata(req.params.id, req.body);
            if (!separata) return res.status(404).json({ message: 'Separata not found' });
            res.json(separata);
        } catch (error: any) {
            console.error('Error in updateSeparata:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async getProducts(req: Request, res: Response) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const separataController = new SeparataController();
