
import { useState } from "react";
import { SalesData } from "@/types/salesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import SalesByCategoryChart from "./charts/SalesByCategoryChart";
import ProfitBySegmentChart from "./charts/ProfitBySegmentChart";
import RegionalPerformanceChart from "./charts/RegionalPerformanceChart";
import DiscountProfitChart from "./charts/DiscountProfitChart";
import CustomerSalesChart from "./charts/CustomerSalesChart";
import ShippingModeChart from "./charts/ShippingModeChart";
import SalesOverTimeChart from "./charts/SalesOverTimeChart";
import TopProductsChart from "./charts/TopProductsChart";
import TopCustomersChart from "./charts/TopCustomersChart";
import DiscountAnalysisChart from "./charts/DiscountAnalysisChart";
import DonationForm from "./DonationForm";

interface DashboardProps {
  data: SalesData[];
}

const Dashboard = ({ data }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <CardDescription>Valor total de todas las ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.reduce((sum, item) => sum + item.Sales, 0).toLocaleString('es-ES', { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Total</CardTitle>
            <CardDescription>Ganancias netas del negocio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.reduce((sum, item) => sum + item.Profit, 0).toLocaleString('es-ES', { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary">Donar para los Cafesaurios</CardTitle>
                <CardDescription>Esta caro el cafe, haste querer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold flex items-center">
                  <Button size="sm" variant="outline" className="text-primary border-primary">
                    Hacer una donación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Donar para los Cafesaurios</DialogTitle>
              <DialogDescription>
                Ayúdanos a seguir creando contenido educativo y herramientas útiles.
              </DialogDescription>
            </DialogHeader>
            <DonationForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalesByCategoryChart data={data} />
            <ProfitBySegmentChart data={data} />
            <RegionalPerformanceChart data={data} />
            <ShippingModeChart data={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalesOverTimeChart data={data} />
            <DiscountProfitChart data={data} />
            <DiscountAnalysisChart data={data} />
            <TopProductsChart data={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopCustomersChart data={data} />
            <CustomerSalesChart data={data} />
            <ProfitBySegmentChart data={data} />
            <SalesByCategoryChart data={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopProductsChart data={data} />
            <SalesByCategoryChart data={data} />
            <DiscountAnalysisChart data={data} />
            <SalesOverTimeChart data={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RegionalPerformanceChart data={data} />
            <SalesOverTimeChart data={data} />
            <ShippingModeChart data={data} />
            <DiscountProfitChart data={data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
