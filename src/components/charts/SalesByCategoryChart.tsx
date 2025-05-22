
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface SalesByCategoryChartProps {
  data: SalesData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SalesByCategoryChart = ({ data }: SalesByCategoryChartProps) => {
  const chartData = useMemo(() => {
    const categorySales = data.reduce((acc, item) => {
      const category = item.Category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.Sales;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categorySales).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [data]);

  const subcategoryData = useMemo(() => {
    const subcategorySales = data.reduce((acc, item) => {
      const subcategory = item.SubCategory;
      if (!acc[subcategory]) {
        acc[subcategory] = 0;
      }
      acc[subcategory] += item.Sales;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subcategorySales)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  const totalSales = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ventas por Categoría y Subcategoría</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Categorías</h3>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: { color: "#3b82f6" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Top 10 Subcategorías</h3>
            <div className="space-y-2">
              {subcategoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full mr-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">${item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / totalSales) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesByCategoryChart;
