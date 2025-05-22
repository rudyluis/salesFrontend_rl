
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DiscountProfitChartProps {
  data: SalesData[];
}

const DiscountProfitChart = ({ data }: DiscountProfitChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      discount: parseFloat((item.Discount * 100).toFixed(0)),
      profit: parseFloat(item.Profit.toFixed(2)),
      sales: parseFloat(item.Sales.toFixed(2)),
      category: item.Category,
    }));
  }, [data]);

  const aggregatedData = useMemo(() => {
    const discountGroups = chartData.reduce((acc, item) => {
      const discount = item.discount;
      if (!acc[discount]) {
        acc[discount] = { discount, avgProfit: 0, totalSales: 0, count: 0 };
      }
      acc[discount].avgProfit += item.profit;
      acc[discount].totalSales += item.sales;
      acc[discount].count += 1;
      return acc;
    }, {} as Record<number, { discount: number; avgProfit: number; totalSales: number; count: number }>);

    return Object.values(discountGroups).map(group => ({
      discount: group.discount,
      avgProfit: parseFloat((group.avgProfit / group.count).toFixed(2)),
      totalSales: group.totalSales,
      count: group.count,
    }));
  }, [chartData]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Descuentos Aplicados vs. Beneficio Obtenido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              discount: { color: "#ef4444" },
              profit: { color: "#10b981" },
              avgProfit: { color: "#3b82f6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="discount"
                  name="Descuento (%)"
                  label={{ value: "Descuento (%)", position: "insideBottomRight", offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey="avgProfit"
                  name="Beneficio Promedio ($)"
                  label={{ value: "Beneficio Promedio ($)", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="count" range={[50, 400]} name="Cantidad de Ventas" />
                <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
                <Legend />
                <Scatter name="Relación Descuento-Beneficio" data={aggregatedData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Análisis de Descuentos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500">Descuento Más Rentable</h4>
              <div className="mt-2">
                {(() => {
                  const mostProfitable = [...aggregatedData]
                    .filter(item => item.discount > 0)
                    .sort((a, b) => b.avgProfit - a.avgProfit)[0];
                  
                  return mostProfitable ? (
                    <>
                      <div className="text-lg font-bold">{mostProfitable.discount}%</div>
                      <div className="text-xs text-gray-500">
                        Beneficio promedio: ${mostProfitable.avgProfit.toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm">No hay datos suficientes</div>
                  );
                })()}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500">Descuento Más Común</h4>
              <div className="mt-2">
                {(() => {
                  const mostCommon = [...aggregatedData]
                    .filter(item => item.discount > 0)
                    .sort((a, b) => b.count - a.count)[0];
                  
                  return mostCommon ? (
                    <>
                      <div className="text-lg font-bold">{mostCommon.discount}%</div>
                      <div className="text-xs text-gray-500">
                        Aplicado en {mostCommon.count} ventas
                      </div>
                    </>
                  ) : (
                    <div className="text-sm">No hay datos suficientes</div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountProfitChart;
