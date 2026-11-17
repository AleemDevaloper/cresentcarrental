import { listPosCatalog } from '../api/pos';

export const mapPosProduct = (p = {}) => ({
  id: p.id,
  code: p.product_code || p.sku || '',
  sku: p.sku || p.product_code || '',
  name: p.name || 'Unnamed Product',
  category: p.category || 'Uncategorized',
  uom: p.unit || 'Units',
  qty: Number(p.stock ?? 0) || 0,
  rate: Number(p.price ?? 0) || 0,
  price: Number(p.price ?? 0) || 0,
  tax: Number(p.tax_rate ?? 0) || 0,
  discount: 0,
  stock: Number(p.stock ?? 0) || 0,
  status: String(p.status || 'active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active',
  barcode: p.barcode || '',
});

export const fetchPosProducts = async () => {
  const response = await listPosCatalog({ per_page: 1000 });
  const list = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];
  return list.map(mapPosProduct);
};
