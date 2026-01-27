import { Router } from 'express';
import { separataController } from './controllers/SeparataController';

const router = Router();

router.post('/separatas', separataController.create);
router.get('/separatas', separataController.getAll);
router.get('/products', separataController.getProducts);

export default router;
