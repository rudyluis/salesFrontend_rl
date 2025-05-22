
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProfitBySegmentChartProps {
  data: SalesData[];
}

const ProfitBySegmentChart = ({ data }: ProfitBySegmentChartProps) => {
  const chartData = useMemo(() => {
    const segmentProfits = data.reduce((acc, item) => {
      const segment = item.Segment;
      if (!acc[segment]) {
        acc[segment] = { profit: 0, sales: 0 };
      }
      acc[segment].profit += item.Profit;
      acc[segment].sales += item.Sales;
      return acc;
    }, {} as Record<string, { profit: number; sales: number }>);

    return Object.entries(segmentProfits).map(([name, values]) => ({
      name,
      profit: parseFloat(values.profit.toFixed(2)),
      sales: parseFloat(values.sales.toFixed(2)),
      profitMargin: parseFloat(((values.profit / values.sales) * 100).toFixed(2)),
    }));
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Rentabilidad por Segmento de Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              profit: { color: "#10b981" },
              sales: { color: "#3b82f6" },
              profitMargin: { color: "#f59e0b" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" name="Ventas ($)" fill="#3b82f6" />
                <Bar yAxisId="left" dataKey="profit" name="Beneficio ($)" fill="#10b981" />
                <Bar yAxisId="right" dataKey="profitMargin" name="Margen (%)" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          {chartData.map((segment) => (
            <div key={segment.name} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-sm">{segment.name}</h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Ventas:</span>
                  <span className="font-medium">${segment.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Beneficio:</span>
                  <span className="font-medium">${segment.profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Margen:</span>
                  <span className="font-medium">{segment.profitMargin}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitBySegmentChart;
