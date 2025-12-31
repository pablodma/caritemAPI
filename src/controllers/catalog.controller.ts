import { Request, Response } from 'express';
import * as catalogService from '../services/catalog.service';
import * as matchService from '../services/match.service';
import * as importService from '../services/import.service';

// ==========================================
// ITEMS
// ==========================================

export const getItems = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const items = await catalogService.getItems(category as string);
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await catalogService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item no encontrado' });
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const item = await catalogService.createItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await catalogService.updateItem(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    await catalogService.deleteItem(req.params.id);
    res.json({ success: true, message: 'Item eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// POSITIONS
// ==========================================

export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await catalogService.getPositions();
    res.json({ success: true, data: positions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPositionById = async (req: Request, res: Response) => {
  try {
    const position = await catalogService.getPositionById(req.params.id);
    if (!position) {
      return res.status(404).json({ success: false, error: 'Posición no encontrada' });
    }
    res.json({ success: true, data: position });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPosition = async (req: Request, res: Response) => {
  try {
    const position = await catalogService.createPosition(req.body);
    res.status(201).json({ success: true, data: position });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePosition = async (req: Request, res: Response) => {
  try {
    const position = await catalogService.updatePosition(req.params.id, req.body);
    res.json({ success: true, data: position });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePosition = async (req: Request, res: Response) => {
  try {
    await catalogService.deletePosition(req.params.id);
    res.json({ success: true, message: 'Posición eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// DAMAGE TYPES
// ==========================================

export const getDamageTypes = async (req: Request, res: Response) => {
  try {
    const damageTypes = await catalogService.getDamageTypes();
    res.json({ success: true, data: damageTypes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDamageTypeById = async (req: Request, res: Response) => {
  try {
    const damageType = await catalogService.getDamageTypeById(req.params.id);
    if (!damageType) {
      return res.status(404).json({ success: false, error: 'Tipo de daño no encontrado' });
    }
    res.json({ success: true, data: damageType });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDamageType = async (req: Request, res: Response) => {
  try {
    const damageType = await catalogService.createDamageType(req.body);
    res.status(201).json({ success: true, data: damageType });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDamageType = async (req: Request, res: Response) => {
  try {
    const damageType = await catalogService.updateDamageType(req.params.id, req.body);
    res.json({ success: true, data: damageType });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDamageType = async (req: Request, res: Response) => {
  try {
    await catalogService.deleteDamageType(req.params.id);
    res.json({ success: true, message: 'Tipo de daño eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// SEVERITIES
// ==========================================

export const getSeverities = async (req: Request, res: Response) => {
  try {
    const severities = await catalogService.getSeverities();
    res.json({ success: true, data: severities });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSeverityById = async (req: Request, res: Response) => {
  try {
    const severity = await catalogService.getSeverityById(req.params.id);
    if (!severity) {
      return res.status(404).json({ success: false, error: 'Severidad no encontrada' });
    }
    res.json({ success: true, data: severity });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSeverity = async (req: Request, res: Response) => {
  try {
    const severity = await catalogService.createSeverity(req.body);
    res.status(201).json({ success: true, data: severity });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSeverity = async (req: Request, res: Response) => {
  try {
    const severity = await catalogService.updateSeverity(req.params.id, req.body);
    res.json({ success: true, data: severity });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSeverity = async (req: Request, res: Response) => {
  try {
    await catalogService.deleteSeverity(req.params.id);
    res.json({ success: true, message: 'Severidad eliminada' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// MATCHING
// ==========================================

export const matchText = async (req: Request, res: Response) => {
  try {
    const { text, stage, entities } = req.body;
    
    // Si se envían entidades ya extraídas (desde N8N), usar matchExtractedEntities
    if (entities && typeof entities === 'object') {
      console.log('[Catalog] 🔍 Procesando entidades extraídas:', {
        hasItem: !!entities.item_text,
        hasPosition: !!entities.position_text,
        hasDamage: !!entities.damage_text,
        hasSeverity: !!entities.severity_text
      });
      const result = await matchService.matchExtractedEntities(entities, stage);
      console.log('[Catalog] ✅ Resultado del matching:', {
        hasItem: !!result.item,
        hasPosition: !!result.position,
        hasDamage: !!result.damage_type,
        hasSeverity: !!result.severity,
        itemId: result.item?.id,
        severityId: result.severity?.id,
        confidence: result.confidence
      });
      return res.json({ success: true, data: result });
    }
    
    // Si solo se envía texto, usar matchTextToCatalog
    if (!text) {
      return res.status(400).json({ success: false, error: 'Se requiere el texto a procesar o entidades extraídas' });
    }
    const result = await matchService.matchTextToCatalog(text, stage);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[Catalog] ❌ Error en matchText:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// IMPORT
// ==========================================

export const importFromExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó archivo' });
    }
    const result = await importService.importFromExcel(req.file.buffer);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// GET ALL
// ==========================================

export const getAllCatalog = async (req: Request, res: Response) => {
  try {
    const [items, positions, damageTypes, severities] = await Promise.all([
      catalogService.getItems(),
      catalogService.getPositions(),
      catalogService.getDamageTypes(),
      catalogService.getSeverities()
    ]);
    
    res.json({
      success: true,
      data: {
        items,
        positions,
        damageTypes,
        severities
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

