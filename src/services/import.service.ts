import * as XLSX from 'xlsx';
import supabase from '../config/supabase';

interface ImportResult {
  items: { imported: number; errors: string[] };
  positions: { imported: number; errors: string[] };
  damageTypes: { imported: number; errors: string[] };
  severities: { imported: number; errors: string[] };
}

/**
 * Importa datos del catálogo desde un archivo Excel.
 * El Excel debe tener las siguientes hojas:
 * - Items: name, code, category, description
 * - Positions: name, code, description
 * - DamageTypes: name, code, description
 * - Severities: name, code, level, color, description
 */
export const importFromExcel = async (buffer: Buffer): Promise<ImportResult> => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  
  const result: ImportResult = {
    items: { imported: 0, errors: [] },
    positions: { imported: 0, errors: [] },
    damageTypes: { imported: 0, errors: [] },
    severities: { imported: 0, errors: [] }
  };

  // Importar Items
  if (workbook.SheetNames.includes('Items')) {
    const itemsSheet = workbook.Sheets['Items'];
    const itemsData = XLSX.utils.sheet_to_json(itemsSheet);
    result.items = await importItems(itemsData);
  }

  // Importar Positions
  if (workbook.SheetNames.includes('Positions') || workbook.SheetNames.includes('Posiciones')) {
    const sheetName = workbook.SheetNames.includes('Positions') ? 'Positions' : 'Posiciones';
    const positionsSheet = workbook.Sheets[sheetName];
    const positionsData = XLSX.utils.sheet_to_json(positionsSheet);
    result.positions = await importPositions(positionsData);
  }

  // Importar DamageTypes
  if (workbook.SheetNames.includes('DamageTypes') || workbook.SheetNames.includes('TiposDaño')) {
    const sheetName = workbook.SheetNames.includes('DamageTypes') ? 'DamageTypes' : 'TiposDaño';
    const damageTypesSheet = workbook.Sheets[sheetName];
    const damageTypesData = XLSX.utils.sheet_to_json(damageTypesSheet);
    result.damageTypes = await importDamageTypes(damageTypesData);
  }

  // Importar Severities
  if (workbook.SheetNames.includes('Severities') || workbook.SheetNames.includes('Severidades')) {
    const sheetName = workbook.SheetNames.includes('Severities') ? 'Severities' : 'Severidades';
    const severitiesSheet = workbook.Sheets[sheetName];
    const severitiesData = XLSX.utils.sheet_to_json(severitiesSheet);
    result.severities = await importSeverities(severitiesData);
  }

  return result;
};

async function importItems(data: any[]): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const row of data) {
    try {
      const item = {
        name: row.name || row.nombre,
        code: row.code || row.codigo || generateCode(row.name || row.nombre),
        category: mapCategory(row.category || row.categoria),
        description: row.description || row.descripcion || null
      };

      if (!item.name) {
        errors.push(`Fila sin nombre: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase
        .from('catalog_items')
        .upsert(item, { onConflict: 'code' });

      if (error) {
        errors.push(`Error importando "${item.name}": ${error.message}`);
      } else {
        imported++;
      }
    } catch (e: any) {
      errors.push(`Error procesando fila: ${e.message}`);
    }
  }

  return { imported, errors };
}

async function importPositions(data: any[]): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const row of data) {
    try {
      const position = {
        name: row.name || row.nombre,
        code: row.code || row.codigo || generateCode(row.name || row.nombre),
        description: row.description || row.descripcion || null
      };

      if (!position.name) {
        errors.push(`Fila sin nombre: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase
        .from('catalog_positions')
        .upsert(position, { onConflict: 'code' });

      if (error) {
        errors.push(`Error importando "${position.name}": ${error.message}`);
      } else {
        imported++;
      }
    } catch (e: any) {
      errors.push(`Error procesando fila: ${e.message}`);
    }
  }

  return { imported, errors };
}

async function importDamageTypes(data: any[]): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const row of data) {
    try {
      const damageType = {
        name: row.name || row.nombre,
        code: row.code || row.codigo || generateCode(row.name || row.nombre),
        description: row.description || row.descripcion || null
      };

      if (!damageType.name) {
        errors.push(`Fila sin nombre: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase
        .from('catalog_damage_types')
        .upsert(damageType, { onConflict: 'code' });

      if (error) {
        errors.push(`Error importando "${damageType.name}": ${error.message}`);
      } else {
        imported++;
      }
    } catch (e: any) {
      errors.push(`Error procesando fila: ${e.message}`);
    }
  }

  return { imported, errors };
}

async function importSeverities(data: any[]): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const row of data) {
    try {
      const severity = {
        name: row.name || row.nombre,
        code: row.code || row.codigo || generateCode(row.name || row.nombre),
        level: parseInt(row.level || row.nivel) || 1,
        color: row.color || null,
        description: row.description || row.descripcion || null
      };

      if (!severity.name) {
        errors.push(`Fila sin nombre: ${JSON.stringify(row)}`);
        continue;
      }

      const { error } = await supabase
        .from('catalog_severities')
        .upsert(severity, { onConflict: 'code' });

      if (error) {
        errors.push(`Error importando "${severity.name}": ${error.message}`);
      } else {
        imported++;
      }
    } catch (e: any) {
      errors.push(`Error procesando fila: ${e.message}`);
    }
  }

  return { imported, errors };
}

// Helpers

function generateCode(name: string): string {
  if (!name) return '';
  return name
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '_')
    .substring(0, 20);
}

function mapCategory(category: string): 'exterior' | 'mecanica' | 'interior' {
  if (!category) return 'exterior';
  
  const normalized = category.toLowerCase().trim();
  
  if (normalized.includes('mec') || normalized.includes('motor')) {
    return 'mecanica';
  }
  if (normalized.includes('int')) {
    return 'interior';
  }
  return 'exterior';
}

