// ==========================================
// TIPOS COMPARTIDOS PARA carItemsAPI
// Copiados de shared/src/index.ts
// ==========================================

export type InspectionStage = 'exterior' | 'mecanica' | 'interior';

export interface CatalogItem {
  id: string;
  name: string;
  code: string;
  category: 'exterior' | 'mecanica' | 'interior';
  description?: string;
  created_at?: string;
}

export interface CatalogPosition {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface CatalogDamageType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface CatalogSeverity {
  id: string;
  name: string;
  code: string;
  level: number; // 1-4 (leve, moderado, grave, crítico)
  color?: string;
  description?: string;
}

export interface CatalogMatchResponse {
  item: CatalogItem | null;
  position: CatalogPosition | null;
  damage_type: CatalogDamageType | null;
  severity: CatalogSeverity | null;
  confidence: number;
  raw_extraction: {
    item_text?: string;
    position_text?: string;
    damage_text?: string;
    severity_text?: string;
  };
}

