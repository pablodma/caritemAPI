import * as catalogService from './catalog.service';
import { CatalogMatchResponse, InspectionStage } from '../types';

/**
 * Servicio de matching de texto con el catálogo.
 * Este servicio es llamado principalmente desde N8N después del procesamiento IA.
 * N8N extrae las entidades del texto y este servicio las valida contra el catálogo.
 */

interface ExtractedEntities {
  item_text?: string;
  position_text?: string;
  damage_text?: string;
  severity_text?: string;
}

/**
 * Busca coincidencias en el catálogo basándose en texto procesado por IA
 */
export const matchTextToCatalog = async (
  text: string, 
  stage?: InspectionStage
): Promise<CatalogMatchResponse> => {
  // Obtener todo el catálogo
  const [items, positions, damageTypes, severities] = await Promise.all([
    catalogService.getItems(stage),
    catalogService.getPositions(),
    catalogService.getDamageTypes(),
    catalogService.getSeverities()
  ]);

  // Normalizar texto para búsqueda
  const normalizedText = normalizeText(text);

  // Buscar coincidencias
  const matchedItem = findBestMatch(normalizedText, items, 'name');
  const matchedPosition = findBestMatch(normalizedText, positions, 'name');
  const matchedDamageType = findBestMatch(normalizedText, damageTypes, 'name');
  const matchedSeverity = findSeverityMatch(normalizedText, severities);

  // Calcular confianza general
  const matches = [matchedItem, matchedPosition, matchedDamageType, matchedSeverity];
  const validMatches = matches.filter(m => m !== null).length;
  const confidence = validMatches / 4;

  return {
    item: matchedItem,
    position: matchedPosition,
    damage_type: matchedDamageType,
    severity: matchedSeverity,
    confidence,
    raw_extraction: extractEntitiesFromText(text)
  };
};

/**
 * Procesa entidades ya extraídas por la IA de N8N
 */
export const matchExtractedEntities = async (
  entities: ExtractedEntities,
  stage?: InspectionStage
): Promise<CatalogMatchResponse> => {
  const [items, positions, damageTypes, severities] = await Promise.all([
    catalogService.getItems(stage),
    catalogService.getPositions(),
    catalogService.getDamageTypes(),
    catalogService.getSeverities()
  ]);

  let matchedItem = null;
  let matchedPosition = null;
  let matchedDamageType = null;
  let matchedSeverity = null;

  if (entities.item_text) {
    matchedItem = findBestMatch(normalizeText(entities.item_text), items, 'name');
  }
  if (entities.position_text) {
    matchedPosition = findBestMatch(normalizeText(entities.position_text), positions, 'name');
  }
  if (entities.damage_text) {
    matchedDamageType = findBestMatch(normalizeText(entities.damage_text), damageTypes, 'name');
  }
  if (entities.severity_text) {
    matchedSeverity = findSeverityMatch(normalizeText(entities.severity_text), severities);
  }

  const matches = [matchedItem, matchedPosition, matchedDamageType, matchedSeverity];
  const validMatches = matches.filter(m => m !== null).length;
  const confidence = validMatches / 4;

  return {
    item: matchedItem,
    position: matchedPosition,
    damage_type: matchedDamageType,
    severity: matchedSeverity,
    confidence,
    raw_extraction: entities
  };
};

// ==========================================
// HELPERS
// ==========================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBestMatch<T extends { name: string }>(
  normalizedText: string, 
  items: T[], 
  field: keyof T
): T | null {
  let bestMatch: T | null = null;
  let bestScore = 0;

  for (const item of items) {
    const itemText = normalizeText(String(item[field]));
    const score = calculateMatchScore(normalizedText, itemText);
    
    if (score > bestScore && score > 0.3) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}

function findSeverityMatch(normalizedText: string, severities: any[]): any | null {
  // Mapeo de palabras clave a niveles de severidad
  const severityKeywords: Record<string, number> = {
    'leve': 1,
    'menor': 1,
    'pequeño': 1,
    'pequeña': 1,
    'minimo': 1,
    'moderado': 2,
    'moderada': 2,
    'medio': 2,
    'media': 2,
    'grave': 3,
    'severo': 3,
    'severa': 3,
    'importante': 3,
    'critico': 4,
    'critica': 4,
    'total': 4,
    'urgente': 4
  };

  // Buscar palabra clave en el texto
  for (const [keyword, level] of Object.entries(severityKeywords)) {
    if (normalizedText.includes(keyword)) {
      return severities.find(s => s.level === level) || null;
    }
  }

  // Si no encuentra, buscar coincidencia directa por nombre
  return findBestMatch(normalizedText, severities, 'name');
}

function calculateMatchScore(text: string, target: string): number {
  // Si el target está contenido en el texto, es una buena coincidencia
  if (text.includes(target)) {
    return 0.9;
  }

  // Verificar si alguna palabra del target está en el texto
  const targetWords = target.split(' ');
  const textWords = text.split(' ');
  
  let matchedWords = 0;
  for (const word of targetWords) {
    if (word.length > 2 && textWords.some(tw => tw.includes(word) || word.includes(tw))) {
      matchedWords++;
    }
  }

  if (targetWords.length > 0) {
    return matchedWords / targetWords.length;
  }

  return 0;
}

function extractEntitiesFromText(text: string): ExtractedEntities {
  // Extracción básica de entidades del texto original
  // N8N/IA se encargará de esto de forma más sofisticada
  return {
    item_text: undefined,
    position_text: undefined,
    damage_text: undefined,
    severity_text: undefined
  };
}

