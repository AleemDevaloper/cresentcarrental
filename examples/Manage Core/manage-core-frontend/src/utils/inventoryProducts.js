import { listProducts } from '../api/fms';

// Maps an Inventory product (products table, managed in the Products tab)
// into the shape expected by sales module product pickers.
export const mapInventoryProduct = (p = {}) => {
  const stock = Number(p.current_stock ?? p.initial_stock ?? 0) || 0;
  return {
    id: p.id,
    code: p.product_code || p.code || p.sku || '',
    sku: p.sku || p.product_code || '',
    name: p.name || 'Unnamed Product',
    category: p.category?.name || p.category_name || p.category || 'Uncategorized',
    uom: p.uom || 'Units',
    qty: stock,
    rate: Number(p.sales_price ?? p.price ?? p.purchase_cost ?? 0) || 0,
    price: Number(p.sales_price ?? p.price ?? p.purchase_cost ?? 0) || 0,
    tax: Number(p.tax ?? 16) || 16,
    discount: Number(p.discount ?? 0) || 0,
    stock,
    status: String(p.status || 'active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active',
  };
};

// Fetches ONLY the products managed in the Inventory service Products tab.
export const fetchSalesProducts = async () => {
  try {
    const res = await listProducts({ per_page: 1000 });
    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];
    return list.map(mapInventoryProduct);
  } catch {
    return [];
  }
};
