
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface CustomerSalesChartProps {
  data: SalesData[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
  '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6'
];

const CustomerSalesChart = ({ data }: CustomerSalesChartProps) => {
  const chartData = useMemo(() => {
    const customerSales = data.reduce((acc, item) => {
      const customerID = item.CustomerID;
      if (!acc[customerID]) {
        acc[customerID] = {
          name: item.CustomerName,
          value: 0,
          segment: item.Segment,
        };
      }
      acc[customerID].value += item.Sales;
      return acc;
    }, {} as Record<string, { name: string; value: number; segment: string }>);

    // Group by segment
    const segmentData = Object.entries(
      Object.values(customerSales).reduce((acc, customer) => {
        const segment = customer.segment;
        if (!acc[segment]) {
          acc[segment] = {
            name: segment,
            children: [],
          };
        }
        acc[segment].children.push({
          name: customer.name,
          value: parseFloat(customer.value.toFixed(2)),
          segment: customer.segment,
        });
        return acc;
      }, {} as Record<string, { name: string; children: { name: string; value: number; segment: string }[] }>)
    ).map(([_, value]) => value);

    // Sort and limit children
    segmentData.forEach(segment => {
      segment.children.sort((a, b) => b.value - a.value);
      segment.children = segment.children.slice(0, 10);
    });

    return segmentData;
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Volumen de Ventas por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              sales: { color: "#3b82f6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={chartData}
                dataKey="value"
                nameKey="name"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                  return (
                    <g>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                          fill: depth < 2 ? COLORS[index % COLORS.length] : COLORS[(index + 4) % COLORS.length],
                          stroke: '#fff',
                          strokeWidth: 2 / (depth + 1e-10),
                          strokeOpacity: 1 / (depth + 1e-10),
                        }}
                      />
                      {depth === 1 && width > 20 && height > 20 && (
                        <text
                          x={x + width / 2}
                          y={y + height / 2 + 7}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize={12}
                        >
                          {name}
                        </text>
                      )}
                    </g>
                  );
                }}
              >
                <ChartTooltip content={<ChartTooltipContent />} />
              </Treemap>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Segmentos de Clientes</h3>
          <div className="grid grid-cols-3 gap-2">
            {chartData.map((segment, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs">{segment.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSalesChart;
