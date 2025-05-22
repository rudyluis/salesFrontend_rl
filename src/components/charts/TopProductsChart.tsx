
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TopProductsChartProps {
  data: SalesData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const TopProductsChart = ({ data }: TopProductsChartProps) => {
  const chartData = useMemo(() => {
    const productSales = data.reduce((acc, item) => {
      const productID = item.ProductID;
      if (!acc[productID]) {
        acc[productID] = {
          id: productID,
          name: item.ProductName,
          category: item.Category,
          subCategory: item.SubCategory,
          sales: 0,
          quantity: 0,
          profit: 0,
        };
      }
      acc[productID].sales += item.Sales;
      acc[productID].quantity += item.Quantity;
      acc[productID].profit += item.Profit;
      return acc;
    }, {} as Record<string, { 
      id: string; 
      name: string; 
      category: string; 
      subCategory: string; 
      sales: number; 
      quantity: number; 
      profit: number; 
    }>);

    return Object.values(productSales)
      .map(product => ({
        id: product.id,
        name: product.name.length > 30 ? product.name.substring(0, 27) + '...' : product.name,
        fullName: product.name,
        category: product.category,
        subCategory: product.subCategory,
        sales: parseFloat(product.sales.toFixed(2)),
        quantity: product.quantity,
        profit: parseFloat(product.profit.toFixed(2)),
        profitMargin: parseFloat(((product.profit / product.sales) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              sales: { color: "#3b82f6" },
              quantity: { color: "#f59e0b" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const product = chartData.find(p => p.name === value);
                    return product?.fullName || value;
                  }}
                />
                <Legend />
                <Bar dataKey="sales" name="Ventas ($)" fill="#3b82f6" />
                <Bar dataKey="quantity" name="Cantidad" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Detalles de Productos Top</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Producto</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Categoría</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Ventas</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Beneficio</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.slice(0, 5).map((product, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-xs whitespace-nowrap truncate max-w-[150px]" title={product.fullName}>
                      {product.name}
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{product.subCategory}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${product.sales.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${product.profit.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      <span className={product.profitMargin >= 0 ? "text-green-500" : "text-red-500"}>
                        {product.profitMargin}%
                      </span>
                    </td>
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

export default TopProductsChart;
