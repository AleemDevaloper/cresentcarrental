import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faCashRegister,
  faCartShopping,
  faBoxesStacked,
  faTruck,
  faUsers,
  faChartColumn,
  faGear,
  faStore,
  faTags,
  faCreditCard,
  faGift,
  faUserTie,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

const item = (id, label, icon) => ({ id, label, icon: <FontAwesomeIcon icon={icon} /> });

export const getPosModuleTabs = () => [
  item('pos_overview', 'POS Dashboard', faChartLine),
  item('pos_billing', 'Billing & Checkout', faCashRegister),
  {
    id: 'pos_sales_group',
    label: 'Sales',
    icon: <FontAwesomeIcon icon={faCartShopping} />,
    subTabs: [
      item('pos_sales', 'Sales Transactions', faCartShopping),
      item('pos_sale_returns', 'Sale Returns', faWandMagicSparkles),
      item('pos_invoices', 'Invoices & Receipts', faCreditCard),
    ],
  },
  {
    id: 'pos_catalog_group',
    label: 'Catalog',
    icon: <FontAwesomeIcon icon={faBoxesStacked} />,
    subTabs: [
      item('pos_products', 'Products', faBoxesStacked),
      item('pos_categories', 'Categories', faTags),
      item('pos_price_lists', 'Price Lists', faTags),
      item('pos_discount_rules', 'Discount Rules', faWandMagicSparkles),
      item('pos_coupons', 'Coupons', faGift),
      item('pos_label_templates', 'Label Templates', faTags),
    ],
  },
  {
    id: 'pos_inventory_group',
    label: 'Inventory Operations',
    icon: <FontAwesomeIcon icon={faTruck} />,
    subTabs: [
      item('pos_stock_on_hand', 'Stock On Hand', faBoxesStacked),
      item('pos_stock_movements', 'Stock Movements', faTruck),
      item('pos_stock_adjustments', 'Adjustments', faWandMagicSparkles),
      item('pos_stock_transfers', 'Transfers', faTruck),
      item('pos_stock_counts', 'Stock Counts', faChartColumn),
      item('pos_inventory_valuation', 'Inventory Valuation', faChartLine),
      item('pos_low_stock', 'Low Stock Alerts', faChartColumn),
    ],
  },
  {
    id: 'pos_purchasing_group',
    label: 'Purchasing',
    icon: <FontAwesomeIcon icon={faTruck} />,
    subTabs: [
      item('pos_vendors', 'Vendors', faUsers),
      item('pos_purchase_orders', 'Purchase Orders', faCartShopping),
      item('pos_purchase_receipts', 'Purchase Receipts', faCreditCard),
      item('pos_purchase_returns', 'Purchase Returns', faWandMagicSparkles),
    ],
  },
  {
    id: 'pos_customers_group',
    label: 'Customers & Loyalty',
    icon: <FontAwesomeIcon icon={faUsers} />,
    subTabs: [
      item('pos_customers', 'Customers', faUsers),
      item('pos_customer_groups', 'Customer Groups', faUsers),
      item('pos_loyalty', 'Loyalty Program', faGift),
      item('pos_gift_cards', 'Gift Cards', faGift),
      item('pos_custom_fields', 'Custom Fields', faTags),
    ],
  },
  {
    id: 'pos_operations_group',
    label: 'Operations',
    icon: <FontAwesomeIcon icon={faStore} />,
    subTabs: [
      item('pos_register_sessions', 'Register Sessions', faCashRegister),
      item('pos_registers', 'Registers', faCashRegister),
      item('pos_counters', 'Counters', faStore),
      item('pos_branches', 'Branches', faStore),
      item('pos_staff', 'Staff', faUserTie),
      item('pos_hardware', 'Hardware', faCreditCard),
      item('pos_payment_methods', 'Payment Methods', faCreditCard),
    ],
  },
  {
    id: 'pos_reports_group',
    label: 'Reports',
    icon: <FontAwesomeIcon icon={faChartColumn} />,
    subTabs: [
      item('pos_sales_summary', 'Sales Summary', faChartColumn),
      item('pos_product_sales', 'Product Sales', faBoxesStacked),
      item('pos_payment_summary', 'Payment Summary', faCreditCard),
      item('pos_customer_sales', 'Customer Sales', faUsers),
      item('pos_cashier_sales', 'Cashier Sales', faUserTie),
      item('pos_tax_compliance', 'Tax Compliance', faChartLine),
      item('pos_accounting_reconciliation', 'Accounting Reconciliation', faChartLine),
    ],
  },
  {
    id: 'pos_settings_group',
    label: 'POS Administration',
    icon: <FontAwesomeIcon icon={faGear} />,
    subTabs: [
      item('pos_settings', 'POS Settings', faGear),
      item('pos_integrations', 'Integrations', faWandMagicSparkles),
      item('pos_compliance', 'Compliance Documents', faCreditCard),
      item('pos_roles', 'Roles & Permissions', faUsers),
      item('pos_offline', 'Offline Operations', faStore),
    ],
  },
];

export default getPosModuleTabs;