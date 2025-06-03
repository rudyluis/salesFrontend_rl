// src/dataService.ts

import { SalesData, SalesSummary, CategorySales, RegionalPerformance, TopCustomer, TopProduct } from "@/types/salesData";

// Define la URL base de tu API de Flask
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sales-dashboard-backendd-rl.onrender.com';

// --- Funciones para cargar y obtener todos los datos ---

export const loadDataInBackend = async (): Promise<{ success: boolean; message: string; recordCount?: number }> => {
  const response = await fetch(`${API_BASE_URL}/api/data/load`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al cargar datos en el backend: ${response.status} ${response.statusText}`);
  }

  // La respuesta de loadDataInBackend tiene { status: "success", message: "..." }
  // OJO: Aquí tu backend usa "status" y "message" en lugar de "success" y "message"
  // Si tu backend para loadDataInBackend *realmente* devuelve 'success: boolean',
  // entonces esta lógica (if (!result.success)) debería seguir siendo la misma.
  // Sin embargo, si devuelve 'status: "success"', necesitamos ajustarlo.
  // Basándome en la última conversación, tu loadDataInBackend ya funciona,
  // así que mantendré su lógica original asumiendo que su respuesta es diferente.
  // Si loadDataInBackend también devuelve { "status": "success", "message": "..." },
  // entonces necesitaría el mismo ajuste que fetchSalesSummary.
  return response.json(); // Esta línea es la que necesita ser revisada si el backend de loadDataInBackend es {"status": "success", ...}
};


export const fetchAllSalesData = async (): Promise<SalesData[]> => {
  const response = await fetch(`${API_BASE_URL}/api/data/all`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener todos los datos desde el backend: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // Asumiendo que /api/data/all devuelve { "status": "success", "data": [...] }
  if (result.status !== 'success') { // CAMBIO: Usar 'status' en lugar de 'success'
    throw new Error(result.message || result.status || `Backend reportó un error al obtener todos los datos.`);
  }
  return result.data as SalesData[]; // Retorna 'data'
};

// --- Funciones para obtener los datos analíticos ---

export const fetchSalesSummary = async (): Promise<SalesSummary> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener el resumen de ventas: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // CAMBIO CLAVE: Usa 'status' en lugar de 'success'
  if (result.status !== 'success') {
    throw new Error(result.message || result.status || 'Backend reportó un error al obtener el resumen.');
  }
  // CAMBIO CLAVE: Retorna 'result.summary' en lugar de 'result.data'
  return result.summary as SalesSummary;
};

export const fetchSalesByCategory = async (): Promise<CategorySales[]> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/categories`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener ventas por categoría: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // Asumiendo que el backend devolverá { "status": "success", "categories": [...] }
  if (result.status !== 'success') { // CAMBIO: Usar 'status'
    throw new Error(result.message || result.status || `Backend reportó un error al obtener ventas por categoría.`);
  }
  return result.categories as CategorySales[]; // CAMBIO: Retorna 'categories'
};

export const fetchRegionalPerformance = async (): Promise<RegionalPerformance[]> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/regions`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener rendimiento regional: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // Asumiendo que el backend devolverá { "status": "success", "regions": [...] }
  if (result.status !== 'success') { // CAMBIO: Usar 'status'
    throw new Error(result.message || result.status || `Backend reportó un error al obtener rendimiento regional.`);
  }
  return result.regions as RegionalPerformance[]; // CAMBIO: Retorna 'regions'
};

export const fetchTopCustomers = async (limit: number = 10): Promise<TopCustomer[]> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/customers?limit=${limit}`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener top clientes: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // Asumiendo que el backend devolverá { "status": "success", "customers": [...] }
  if (result.status !== 'success') { // CAMBIO: Usar 'status'
    throw new Error(result.message || result.status || `Backend reportó un error al obtener top clientes.`);
  }
  return result.customers as TopCustomer[]; // CAMBIO: Retorna 'customers'
};

export const fetchTopProducts = async (limit: number = 10): Promise<TopProduct[]> => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/products?limit=${limit}`);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `Error desconocido (no JSON) - ${response.status} ${response.statusText}` };
    }
    throw new Error(errorData.message || `Error al obtener top productos: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  // Asumiendo que el backend devolverá { "status": "success", "products": [...] }
  if (result.status !== 'success') { // CAMBIO: Usar 'status'
    throw new Error(result.message || result.status || `Backend reportó un error al obtener top productos.`);
  }
  return result.products as TopProduct[]; // CAMBIO: Retorna 'products'
};

// Eliminar o no usar las funciones parseCSV y parseCSVLine si ya no se procesa el CSV en el frontend
// const parseCSV = ...
// const parseCSVLine = ...