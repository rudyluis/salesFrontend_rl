import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { BarChart2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SalesData } from "@/types/salesData";
// Importamos solo fetchAllSalesData y las funciones analíticas que el Dashboard realmente necesita
import { fetchAllSalesData, fetchSalesSummary, fetchSalesByCategory, fetchRegionalPerformance, fetchTopCustomers, fetchTopProducts } from "@/services/dataService"; 

const Index = () => {
  const [data, setData] = useState<SalesData[]>([]); // Para los datos crudos si Dashboard los usa
  const [summaryData, setSummaryData] = useState<any>(null); // Para el resumen de ventas (ej: total_sales, total_profit)
  const [categoryData, setCategoryData] = useState<any>(null); // Para ventas por categoría
  const [regionData, setRegionData] = useState<any>(null); // Para rendimiento regional
  const [topCustomersData, setTopCustomersData] = useState<any>(null); // Para top clientes
  const [topProductsData, setTopProductsData] = useState<any>(null); // Para top productos


  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDashboardData = async () => { // Renombramos la función para mayor claridad
    setLoading(true);
    setError(null);
    try {
      // **IMPORTANTE: ELIMINAMOS LA LLAMADA A loadDataInBackend AQUÍ**
      // Los datos ya están en la DB. loadDataInBackend se usa para cargar el CSV a la DB.
      // Si quieres un botón para RECARGAR el CSV, esa función debería estar atada a ese botón.

      // Paso 1: Obtener el resumen de ventas
      const summary = await fetchSalesSummary();
      setSummaryData(summary);
      console.log("Resumen de ventas cargado:", summary);
      
      // Paso 2: Obtener todos los datos crudos (si el Dashboard los necesita, si no, puedes comentarlo)
      const salesData = await fetchAllSalesData();
      setData(salesData);
      console.log(`Se cargaron ${salesData.length} registros de ventas crudos.`);

      // Paso 3: Cargar los datos analíticos adicionales
      // Estas llamadas fallarán (404) hasta que implementes los endpoints en el backend.
      // Puedes comentarlas temporalmente si no quieres ver los errores 404 en la consola
      // hasta que las implementes.
      const categories = await fetchSalesByCategory();
      setCategoryData(categories);
      console.log("Ventas por categoría cargadas:", categories);

      const regions = await fetchRegionalPerformance();
      setRegionData(regions);
      console.log("Rendimiento regional cargado:", regions);

      const topCustomers = await fetchTopCustomers();
      setTopCustomersData(topCustomers);
      console.log("Top Clientes cargados:", topCustomers);

      const topProducts = await fetchTopProducts();
      setTopProductsData(topProducts);
      console.log("Top Productos cargados:", topProducts);


      toast({
        title: "Dashboard Actualizado",
        description: `Datos cargados exitosamente desde el backend.`,
        variant: "default",
      });

    } catch (err: any) {
      // Este catch ahora manejará errores reales (ej. 404 por endpoints no implementados, o 500)
      console.error("Error en Index.tsx al cargar datos del dashboard:", err); // Para depuración
      setError(`Error al cargar datos del dashboard: ${err.message || "Error desconocido"}.`);
      toast({
        title: "Error de carga",
        description: `No se pudieron cargar todos los datos: ${err.message || "Error desconocido"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(); // Se ejecuta solo una vez al montar el componente
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard de Ventas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Análisis detallado del desempeño del almacén
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={loadDashboardData} // Ahora este botón recarga los datos del dashboard
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Cargando..." : "Actualizar Dashboard"}
              </Button>
               {/* Si necesitas un botón para recargar el CSV en la DB, sería otro botón
               <Button 
                   onClick={async () => {
                       try {
                           const result = await loadDataInBackend();
                           toast({ title: "Carga DB", description: result.message });
                           loadDashboardData(); // Recargar el dashboard después de cargar la DB
                       } catch (e: any) {
                           toast({ title: "Error Carga DB", description: e.message, variant: "destructive" });
                       }
                   }}
               >
                   Recargar CSV en DB
               </Button>
               */}
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-8 text-red-700 dark:text-red-400">
            <p>{error}</p>
            <Button 
              variant="outline" 
              onClick={loadDashboardData} 
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        )}

        {!error && (
          loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart2 className="h-12 w-12 text-primary animate-pulse mb-4" />
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                Cargando datos...
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Estamos preparando tu dashboard
              </p>
            </div>
          ) : (
            // Pasa todos los datos relevantes al Dashboard
            <Dashboard 
              data={data} // Esto es SalesData[]
              summaryData={summaryData}
              categoryData={categoryData}
              regionData={regionData}
              topCustomersData={topCustomersData}
              topProductsData={topProductsData}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Index;