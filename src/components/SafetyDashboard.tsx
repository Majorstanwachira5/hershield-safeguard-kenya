import { Shield, AlertTriangle, Users, Settings, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SafetyDashboard = () => {
  const safetyMetrics = [
    { label: "Threats Blocked", value: 24, trend: "+12%" },
    { label: "Safe Sessions", value: 98, trend: "+5%" },
    { label: "Community Reports", value: 3, trend: "-40%" },
    { label: "Safety Score", value: 95, trend: "+8%" }
  ];

  const activeThreats = [
    { type: "Harassment Detection", status: "monitoring", severity: "medium" },
    { type: "Privacy Breach Alert", status: "resolved", severity: "low" },
    { type: "Suspicious Contact", status: "investigating", severity: "high" }
  ];

  return (
    <div className="space-y-6">
      {/* Safety Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyMetrics.map((metric, index) => (
          <Card key={index} className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}{metric.label === "Safety Score" ? "/100" : ""}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
              {metric.label === "Safety Score" && (
                <Progress value={metric.value} className="mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Threat Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Active Monitoring
            </CardTitle>
            <CardDescription>
              Real-time threat detection and prevention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeThreats.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{threat.type}</p>
                  <p className="text-xs text-muted-foreground capitalize">{threat.status}</p>
                </div>
                <Badge 
                  variant={threat.severity === "high" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {threat.severity}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Community Safety Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community Safety
            </CardTitle>
            <CardDescription>
              Collaborative protection and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Trusted Contacts</span>
                <Badge variant="outline">5 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Safety Circle</span>
                <Badge variant="outline">12 Members</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Local Support Network</span>
                <Badge variant="outline">Connected</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
                Manage Circle
              </Button>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4" />
                Local Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety by Design Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Safety by Design Features
          </CardTitle>
          <CardDescription>
            Proactive protection built into every interaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground">AI-powered threat prediction</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Privacy Controls</h4>
              <p className="text-sm text-muted-foreground">Granular safety settings</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Kenyan Context</h4>
              <p className="text-sm text-muted-foreground">Local support integration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyDashboard;