import { Router } from 'express';
import * as catalogController from '../controllers/catalog.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Items
router.get('/items', catalogController.getItems);
router.get('/items/:id', catalogController.getItemById);
router.post('/items', catalogController.createItem);
router.put('/items/:id', catalogController.updateItem);
router.delete('/items/:id', catalogController.deleteItem);

// Positions
router.get('/positions', catalogController.getPositions);
router.get('/positions/:id', catalogController.getPositionById);
router.post('/positions', catalogController.createPosition);
router.put('/positions/:id', catalogController.updatePosition);
router.delete('/positions/:id', catalogController.deletePosition);

// Damage Types
router.get('/damage-types', catalogController.getDamageTypes);
router.get('/damage-types/:id', catalogController.getDamageTypeById);
router.post('/damage-types', catalogController.createDamageType);
router.put('/damage-types/:id', catalogController.updateDamageType);
router.delete('/damage-types/:id', catalogController.deleteDamageType);

// Severities
router.get('/severities', catalogController.getSeverities);
router.get('/severities/:id', catalogController.getSeverityById);
router.post('/severities', catalogController.createSeverity);
router.put('/severities/:id', catalogController.updateSeverity);
router.delete('/severities/:id', catalogController.deleteSeverity);

// Matching (para N8N)
router.post('/match', catalogController.matchText);

// Import Excel
router.post('/import', upload.single('file'), catalogController.importFromExcel);

// Get all catalog data (for frontend caching)
router.get('/all', catalogController.getAllCatalog);

export default router;

