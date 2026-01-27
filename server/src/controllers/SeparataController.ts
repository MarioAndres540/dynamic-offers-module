import { Request, Response } from 'express';
import { separataService } from '../services/SeparataService';
import Product from '../models/Product';

export class SeparataController {
    async create(req: Request, res: Response) {
        try {
            const separata = await separataService.createSeparata(req.body);
            res.status(201).json(separata);
        } catch (error: any) {
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
