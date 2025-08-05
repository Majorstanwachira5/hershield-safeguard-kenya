import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SafetyDashboard from "@/components/SafetyDashboard";
import PrivacyControlCenter from "@/components/PrivacyControlCenter";
import ThreatDetectionSystem from "@/components/ThreatDetectionSystem";
import EmergencyButton from "@/components/EmergencyButton";
import QuickReportButton from "@/components/QuickReportButton";

const Safety = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Safety Center</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive protection designed for Kenyan women's digital safety
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Safety Dashboard</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
            <TabsTrigger value="ai">AI Protection</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SafetyDashboard />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyControlCenter />
          </TabsContent>

          <TabsContent value="ai">
            <ThreatDetectionSystem />
          </TabsContent>
        </Tabs>
      </div>

      <EmergencyButton />
      <QuickReportButton />
    </div>
  );
};

export default Safety;