
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RegionalPerformanceChartProps {
  data: SalesData[];
}

const RegionalPerformanceChart = ({ data }: RegionalPerformanceChartProps) => {
  const regionData = useMemo(() => {
    const regionPerformance = data.reduce((acc, item) => {
      const region = item.Region;
      if (!acc[region]) {
        acc[region] = { sales: 0, profit: 0 };
      }
      acc[region].sales += item.Sales;
      acc[region].profit += item.Profit;
      return acc;
    }, {} as Record<string, { sales: number; profit: number }>);

    return Object.entries(regionPerformance).map(([name, values]) => ({
      name,
      sales: parseFloat(values.sales.toFixed(2)),
      profit: parseFloat(values.profit.toFixed(2)),
    }));
  }, [data]);

  const stateData = useMemo(() => {
    const statePerformance = data.reduce((acc, item) => {
      const state = item.State;
      if (!acc[state]) {
        acc[state] = { sales: 0, profit: 0 };
      }
      acc[state].sales += item.Sales;
      acc[state].profit += item.Profit;
      return acc;
    }, {} as Record<string, { sales: number; profit: number }>);

    return Object.entries(statePerformance)
      .map(([name, values]) => ({
        name,
        sales: parseFloat(values.sales.toFixed(2)),
        profit: parseFloat(values.profit.toFixed(2)),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Desempeño por Región y Estado</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Por Región</h3>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: { color: "#3b82f6" },
                  profit: { color: "#10b981" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="sales" name="Ventas" fill="#3b82f6" />
                    <Bar dataKey="profit" name="Beneficio" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Top 10 Estados</h3>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: { color: "#8b5cf6" },
                  profit: { color: "#ec4899" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stateData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="sales" name="Ventas" fill="#8b5cf6" />
                    <Bar dataKey="profit" name="Beneficio" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalPerformanceChart;
