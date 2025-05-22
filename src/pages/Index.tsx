
import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { ChartBarIcon, ArrowPathIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SalesData } from "@/types/salesData";
import { fetchSalesData } from "@/services/dataService";

const Index = () => {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const salesData = await fetchSalesData();
      setData(salesData);
      toast({
        title: "Datos cargados",
        description: `Se han cargado ${salesData.length} registros de ventas`,
        variant: "default",
      });
    } catch (err) {
      setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de ventas",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
                onClick={loadData} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Cargando..." : "Actualizar datos"}
              </Button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-8 text-red-700 dark:text-red-400">
            <p>{error}</p>
            <Button 
              variant="outline" 
              onClick={loadData} 
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        )}

        {!error && (
          loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ChartBarIcon className="h-12 w-12 text-primary animate-pulse mb-4" />
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                Cargando datos...
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Estamos preparando tu dashboard
              </p>
            </div>
          ) : (
            <Dashboard data={data} />
          )
        )}
      </div>
    </div>
  );
};

export default Index;
