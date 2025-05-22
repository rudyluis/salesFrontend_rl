
import { useMemo } from "react";
import { SalesData } from "@/types/salesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TopCustomersChartProps {
  data: SalesData[];
}

const TopCustomersChart = ({ data }: TopCustomersChartProps) => {
  const chartData = useMemo(() => {
    const customerProfits = data.reduce((acc, item) => {
      const customerID = item.CustomerID;
      if (!acc[customerID]) {
        acc[customerID] = {
          id: customerID,
          name: item.CustomerName,
          segment: item.Segment,
          profit: 0,
          sales: 0,
          orders: new Set(),
        };
      }
      acc[customerID].profit += item.Profit;
      acc[customerID].sales += item.Sales;
      acc[customerID].orders.add(item.OrderID);
      return acc;
    }, {} as Record<string, { 
      id: string; 
      name: string; 
      segment: string; 
      profit: number; 
      sales: number; 
      orders: Set<string>; 
    }>);

    return Object.values(customerProfits)
      .map(customer => ({
        id: customer.id,
        name: customer.name,
        segment: customer.segment,
        profit: parseFloat(customer.profit.toFixed(2)),
        sales: parseFloat(customer.sales.toFixed(2)),
        orderCount: customer.orders.size,
        profitPerOrder: parseFloat((customer.profit / customer.orders.size).toFixed(2)),
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Clientes Más Rentables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              profit: { color: "#10b981" },
              sales: { color: "#3b82f6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="profit" name="Beneficio ($)" fill="#10b981" />
                <Bar dataKey="sales" name="Ventas ($)" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Detalle de Clientes Top</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Segmento</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Pedidos</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Beneficio/Pedido</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Beneficio Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.slice(0, 5).map((customer, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{customer.name}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{customer.segment}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{customer.orderCount}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${customer.profitPerOrder.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">${customer.profit.toLocaleString()}</td>
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

export default TopCustomersChart;
