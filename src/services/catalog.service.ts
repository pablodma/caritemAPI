import supabase from '../config/supabase';
import { CatalogItem, CatalogPosition, CatalogDamageType, CatalogSeverity } from '../types';

// ==========================================
// ITEMS
// ==========================================

export const getItems = async (category?: string): Promise<CatalogItem[]> => {
  // Supabase tiene un límite máximo de 1000 por consulta, necesitamos paginación
  const allItems: CatalogItem[] = [];
  const pageSize = 1000;
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    let query = supabase
      .from('catalog_items')
      .select('*')
      .order('name')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    if (data && data.length > 0) {
      allItems.push(...data);
      hasMore = data.length === pageSize; // Si devolvió menos que pageSize, no hay más páginas
      page++;
    } else {
      hasMore = false;
    }
  }
  
  return allItems;
};

export const getItemById = async (id: string): Promise<CatalogItem | null> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createItem = async (item: Partial<CatalogItem>): Promise<CatalogItem> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateItem = async (id: string, item: Partial<CatalogItem>): Promise<CatalogItem> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .update(item)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('catalog_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ==========================================
// POSITIONS
// ==========================================

export const getPositions = async (): Promise<CatalogPosition[]> => {
  const { data, error } = await supabase
    .from('catalog_positions')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getPositionById = async (id: string): Promise<CatalogPosition | null> => {
  const { data, error } = await supabase
    .from('catalog_positions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createPosition = async (position: Partial<CatalogPosition>): Promise<CatalogPosition> => {
  const { data, error } = await supabase
    .from('catalog_positions')
    .insert(position)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePosition = async (id: string, position: Partial<CatalogPosition>): Promise<CatalogPosition> => {
  const { data, error } = await supabase
    .from('catalog_positions')
    .update(position)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePosition = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('catalog_positions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ==========================================
// DAMAGE TYPES
// ==========================================

export const getDamageTypes = async (): Promise<CatalogDamageType[]> => {
  const { data, error } = await supabase
    .from('catalog_damage_types')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getDamageTypeById = async (id: string): Promise<CatalogDamageType | null> => {
  const { data, error } = await supabase
    .from('catalog_damage_types')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createDamageType = async (damageType: Partial<CatalogDamageType>): Promise<CatalogDamageType> => {
  const { data, error } = await supabase
    .from('catalog_damage_types')
    .insert(damageType)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDamageType = async (id: string, damageType: Partial<CatalogDamageType>): Promise<CatalogDamageType> => {
  const { data, error } = await supabase
    .from('catalog_damage_types')
    .update(damageType)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteDamageType = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('catalog_damage_types')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ==========================================
// SEVERITIES
// ==========================================

export const getSeverities = async (): Promise<CatalogSeverity[]> => {
  const { data, error } = await supabase
    .from('catalog_severities')
    .select('*')
    .order('level');
  
  if (error) throw error;
  return data || [];
};

export const getSeverityById = async (id: string): Promise<CatalogSeverity | null> => {
  const { data, error } = await supabase
    .from('catalog_severities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createSeverity = async (severity: Partial<CatalogSeverity>): Promise<CatalogSeverity> => {
  const { data, error } = await supabase
    .from('catalog_severities')
    .insert(severity)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSeverity = async (id: string, severity: Partial<CatalogSeverity>): Promise<CatalogSeverity> => {
  const { data, error } = await supabase
    .from('catalog_severities')
    .update(severity)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSeverity = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('catalog_severities')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ==========================================
// CATEGORIES (distinct from items)
// ==========================================

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('category')
    .not('category', 'is', null)
    .order('category');
  
  if (error) throw error;
  
  // Get unique categories
  const uniqueCategories = [...new Set(data?.map(item => item.category).filter(Boolean) || [])];
  return uniqueCategories as string[];
};

