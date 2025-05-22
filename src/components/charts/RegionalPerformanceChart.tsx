
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Legend, Tooltip, ScatterChart, Scatter, ZAxis, Cell, ComposedChart, Line
} from "recharts";

interface RegionalPerformanceChartProps {
  data: SalesData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const RegionalPerformanceChart = ({ data }: RegionalPerformanceChartProps) => {
  const regionData = useMemo(() => {
    const regionPerformance = data.reduce((acc, item) => {
      const region = item.Region;
      if (!acc[region]) {
        acc[region] = { 
          sales: 0, 
          profit: 0,
          orders: 0,
          avgSale: 0,
          orderCount: new Set()
        };
      }
      acc[region].sales += item.Sales;
      acc[region].profit += item.Profit;
      acc[region].orderCount.add(item.OrderID);
      return acc;
    }, {} as Record<string, { 
      sales: number; 
      profit: number; 
      orders: number;
      avgSale: number;
      orderCount: Set<string>;
    }>);

    return Object.entries(regionPerformance).map(([name, values]) => ({
      name,
      sales: parseFloat(values.sales.toFixed(2)),
      profit: parseFloat(values.profit.toFixed(2)),
      profitMargin: parseFloat(((values.profit / values.sales) * 100).toFixed(2)),
      orders: values.orderCount.size,
      avgSale: parseFloat((values.sales / values.orderCount.size).toFixed(2)),
    }));
  }, [data]);

  const stateData = useMemo(() => {
    const statePerformance = data.reduce((acc, item) => {
      const state = item.State;
      if (!acc[state]) {
        acc[state] = { 
          sales: 0, 
          profit: 0,
          region: item.Region,
          orderCount: new Set()
        };
      }
      acc[state].sales += item.Sales;
      acc[state].profit += item.Profit;
      acc[state].orderCount.add(item.OrderID);
      return acc;
    }, {} as Record<string, { 
      sales: number; 
      profit: number; 
      region: string;
      orderCount: Set<string>;
    }>);

    return Object.entries(statePerformance)
      .map(([name, values]) => ({
        name,
        sales: parseFloat(values.sales.toFixed(2)),
        profit: parseFloat(values.profit.toFixed(2)),
        profitMargin: parseFloat(((values.profit / values.sales) * 100).toFixed(2)),
        region: values.region,
        orders: values.orderCount.size,
        avgOrderValue: parseFloat((values.sales / values.orderCount.size).toFixed(2)),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, [data]);

  const bubbleData = useMemo(() => {
    return stateData.map(item => ({
      x: item.sales,
      y: item.profit,
      z: item.orders,
      name: item.name,
      region: item.region,
    }));
  }, [stateData]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Desempeño por Región y Estado</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Rendimiento Regional</h3>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  sales: { color: "#3b82f6" },
                  profit: { color: "#10b981" },
                  profitMargin: { color: "#f59e0b" }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Ventas" fill="#3b82f6" />
                    <Bar yAxisId="left" dataKey="profit" name="Beneficio" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="profitMargin" name="% Margen" stroke="#f59e0b" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-medium mb-4 text-center">Top Estados: Ventas vs Beneficios</h3>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  bubble: { color: "#8b5cf6" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Ventas" 
                      unit="$"
                      domain={['auto', 'auto']} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Beneficio" 
                      unit="$"
                      domain={['auto', 'auto']} 
                    />
                    <ZAxis 
                      type="number" 
                      dataKey="z" 
                      range={[50, 400]} 
                      name="Órdenes" 
                    />
                    <ChartTooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={
                        (props) => {
                          if (props.active && props.payload && props.payload.length) {
                            const data = props.payload[0].payload;
                            return (
                              <div className="custom-tooltip bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
                                <p className="font-medium">{data.name} ({data.region})</p>
                                <p>Ventas: ${data.x.toLocaleString()}</p>
                                <p>Beneficio: ${data.y.toLocaleString()}</p>
                                <p>Órdenes: {data.z}</p>
                              </div>
                            );
                          }
                          return null;
                        }
                      } 
                    />
                    <Legend />
                    <Scatter 
                      name="Estados" 
                      data={bubbleData} 
                      fill="#8884d8"
                    >
                      {bubbleData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[regionData.findIndex(r => r.name === entry.region) % COLORS.length]} 
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
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
