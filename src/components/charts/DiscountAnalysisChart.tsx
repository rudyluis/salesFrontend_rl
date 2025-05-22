
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DiscountAnalysisChartProps {
  data: SalesData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DiscountAnalysisChart = ({ data }: DiscountAnalysisChartProps) => {
  const chartData = useMemo(() => {
    // Group by discount ranges
    const ranges = {
      "0%": { min: 0, max: 0 },
      "1-10%": { min: 0.01, max: 0.1 },
      "11-20%": { min: 0.11, max: 0.2 },
      "21-30%": { min: 0.21, max: 0.3 },
      "31-40%": { min: 0.31, max: 0.4 },
      "41-50%": { min: 0.41, max: 0.5 },
      ">50%": { min: 0.51, max: 1 },
    };

    const discountRanges = Object.keys(ranges).reduce((acc, range) => {
      acc[range] = { sales: 0, profit: 0, lostProfit: 0, count: 0 };
      return acc;
    }, {} as Record<string, { sales: number; profit: number; lostProfit: number; count: number }>);

    // Calculate total sales and profit by discount range
    data.forEach(item => {
      const discount = item.Discount;
      let rangeName = "";
      
      for (const [name, range] of Object.entries(ranges)) {
        if (discount >= range.min && discount <= range.max) {
          rangeName = name;
          break;
        }
      }
      
      if (rangeName) {
        discountRanges[rangeName].sales += item.Sales;
        discountRanges[rangeName].profit += item.Profit;
        discountRanges[rangeName].count += 1;
        
        // Estimate lost profit due to discount
        if (discount > 0) {
          const originalPrice = item.Sales / (1 - discount);
          const lostAmount = originalPrice - item.Sales;
          discountRanges[rangeName].lostProfit += lostAmount;
        }
      }
    });

    return Object.entries(discountRanges)
      .filter(([_, values]) => values.count > 0)
      .map(([name, values]) => ({
        name,
        sales: parseFloat(values.sales.toFixed(2)),
        profit: parseFloat(values.profit.toFixed(2)),
        lostProfit: parseFloat(values.lostProfit.toFixed(2)),
        count: values.count,
      }));
  }, [data]);

  const totalLostProfit = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.lostProfit, 0);
  }, [chartData]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Análisis de Pérdidas por Descuentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4 text-center">Distribución de Ventas por Descuento</h3>
            <div className="h-[200px]">
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
                      outerRadius={80}
                      dataKey="sales"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4 text-center">Pérdida Estimada por Descuentos</h3>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  lostProfit: { color: "#ef4444" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.filter(item => item.lostProfit > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="lostProfit"
                      nameKey="name"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2 text-red-700 dark:text-red-400">Impacto de Descuentos</h3>
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-xs text-red-600 dark:text-red-400">Pérdida Total Estimada:</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                ${totalLostProfit.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-xs text-red-600 dark:text-red-400">Porcentaje de Ventas con Descuento:</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {((chartData.filter(d => d.name !== "0%").reduce((sum, item) => sum + item.count, 0) / 
                  chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-xs text-red-600 dark:text-red-400">Descuento más Utilizado:</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {chartData.sort((a, b) => b.count - a.count)[0]?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountAnalysisChart;
