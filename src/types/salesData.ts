// src/types/salesData.ts

export interface SalesData {
  No: number;
  RowID: number;
  OrderID: string;
  OrderDate: string;
  ShipDate: string;
  ShipMode: string;
  CustomerID: string;
  CustomerName: string;
  Segment: string;
  Country: string;
  City: string;
  State: string;
  PostalCode: string; // Ojo: tu backend lo convierte a number si es posible, pero el CSV original lo trata como string.
                      // Si en el frontend lo usas como number, deberías convertirlo.
  Region: string;
  ProductID: string;
  Category: string;
  SubCategory: string; // Importante: el backend renombra "Sub-Category" a "SubCategory"
  ProductName: string;
  Sales: number;
  Quantity: number;
  Discount: number;
  Profit: number;
}

// --- Nuevas interfaces para los datos agregados y resúmenes del backend ---

// Interfaz para el resumen de ventas (endpoint: /api/analytics/summary)
export interface SalesSummary {
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  profitMargin: number;
}

// Interfaz para ventas por categoría (endpoint: /api/analytics/categories)
export interface CategorySales {
  Category: string;
  Sales: number;
  Profit: number;
  Quantity: number;
}

// Interfaz para rendimiento regional (endpoint: /api/analytics/regions)
export interface RegionalPerformance {
  Region: string;
  Sales: number;
  Profit: number;
  orders: number; // El backend renombra OrderID a 'orders'
  profitMargin: number;
}

// Interfaz para top clientes (endpoint: /api/analytics/customers)
export interface TopCustomer {
  CustomerID: string;
  CustomerName: string;
  Segment: string;
  Profit: number;
  Sales: number;
  orderCount: number; // El backend renombra OrderID a 'orderCount'
}

// Interfaz para top productos (endpoint: /api/analytics/products)
export interface TopProduct {
  ProductID: string;
  ProductName: string;
  Category: string;
  SubCategory: string;
  Sales: number;
  Quantity: number;
  Profit: number;
  profitMargin: number;
}