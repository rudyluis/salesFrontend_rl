
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ShippingModeChartProps {
  data: SalesData[];
}

const ShippingModeChart = ({ data }: ShippingModeChartProps) => {
  const chartData = useMemo(() => {
    const shippingModes = data.reduce((acc, item) => {
      const mode = item.ShipMode;
      if (!acc[mode]) {
        acc[mode] = {
          name: mode,
          count: 0,
          sales: 0,
          profit: 0,
          avgDeliveryDays: 0,
          totalDeliveryDays: 0,
        };
      }
      
      // Calculate delivery days (difference between order date and ship date)
      const orderDate = new Date(item.OrderDate);
      const shipDate = new Date(item.ShipDate);
      const deliveryDays = Math.round((shipDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      acc[mode].count += 1;
      acc[mode].sales += item.Sales;
      acc[mode].profit += item.Profit;
      acc[mode].totalDeliveryDays += deliveryDays;
      
      return acc;
    }, {} as Record<string, { 
      name: string; 
      count: number; 
      sales: number; 
      profit: number; 
      avgDeliveryDays: number;
      totalDeliveryDays: number;
    }>);

    return Object.values(shippingModes).map(mode => ({
      name: mode.name,
      count: mode.count,
      sales: parseFloat(mode.sales.toFixed(2)),
      profit: parseFloat(mode.profit.toFixed(2)),
      avgDeliveryDays: parseFloat((mode.totalDeliveryDays / mode.count).toFixed(1)),
    }));
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Comparativa de Modos de Envío</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              count: { color: "#3b82f6" },
              avgDeliveryDays: { color: "#ef4444" },
              sales: { color: "#10b981" },
              profit: { color: "#f59e0b" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Cantidad de Envíos" fill="#3b82f6" />
                <Bar yAxisId="right" dataKey="avgDeliveryDays" name="Días Promedio" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Detalle por Modo de Envío</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Modo</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Envíos</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Días Prom.</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Ventas</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Beneficio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.map((mode, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{mode.name}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{mode.count.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{mode.avgDeliveryDays}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${mode.sales.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${mode.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingModeChart;
