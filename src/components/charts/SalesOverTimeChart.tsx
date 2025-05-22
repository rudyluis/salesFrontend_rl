
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SalesOverTimeChartProps {
  data: SalesData[];
}

const SalesOverTimeChart = ({ data }: SalesOverTimeChartProps) => {
  const chartData = useMemo(() => {
    // Group by month and year
    const timeData = data.reduce((acc, item) => {
      const date = new Date(item.OrderDate);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          date: yearMonth,
          sales: 0,
          profit: 0,
        };
      }
      
      acc[yearMonth].sales += item.Sales;
      acc[yearMonth].profit += item.Profit;
      
      return acc;
    }, {} as Record<string, { date: string; sales: number; profit: number }>);

    // Convert to array and sort by date
    return Object.values(timeData)
      .map(entry => ({
        date: entry.date,
        sales: parseFloat(entry.sales.toFixed(2)),
        profit: parseFloat(entry.profit.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  // Calculate growth rates
  const salesGrowth = useMemo(() => {
    if (chartData.length < 2) return 0;
    
    const lastMonth = chartData[chartData.length - 1].sales;
    const previousMonth = chartData[chartData.length - 2].sales;
    
    return previousMonth === 0 
      ? 100 
      : parseFloat((((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2));
  }, [chartData]);

  const profitGrowth = useMemo(() => {
    if (chartData.length < 2) return 0;
    
    const lastMonth = chartData[chartData.length - 1].profit;
    const previousMonth = chartData[chartData.length - 2].profit;
    
    return previousMonth === 0 
      ? 100 
      : parseFloat((((lastMonth - previousMonth) / previousMonth) * 100).toFixed(2));
  }, [chartData]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Evolución Temporal de Ventas y Ganancias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500">Crecimiento en Ventas</h4>
            <div className="mt-2 flex items-end">
              <span className={`text-lg font-bold ${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {salesGrowth >= 0 ? '+' : ''}{salesGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500">Crecimiento en Beneficios</h4>
            <div className="mt-2 flex items-end">
              <span className={`text-lg font-bold ${profitGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitGrowth >= 0 ? '+' : ''}{profitGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ChartContainer
            config={{
              sales: { color: "#3b82f6" },
              profit: { color: "#10b981" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year.substring(2)}`;
                  }}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year}`;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Ventas ($)" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Beneficio ($)" 
                  stroke="#10b981" 
                  activeDot={{ r: 6 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverTimeChart;
