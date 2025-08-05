import { Brain, AlertTriangle, Shield, TrendingUp, Activity, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThreatDetectionSystem = () => {
  const aiInsights = [
    {
      type: "Harassment Pattern",
      confidence: 94,
      description: "Suspicious messaging pattern detected",
      action: "Blocked automatically",
      timestamp: "2 minutes ago"
    },
    {
      type: "Privacy Breach Risk",
      confidence: 78,
      description: "Unusual data access pattern",
      action: "User notified",
      timestamp: "15 minutes ago"
    },
    {
      type: "Social Engineering",
      confidence: 89,
      description: "Potential impersonation attempt",
      action: "Under review",
      timestamp: "1 hour ago"
    }
  ];

  const riskAssessment = {
    overall: 85,
    categories: [
      { name: "Identity Verification", score: 92, status: "high" },
      { name: "Communication Safety", score: 78, status: "medium" },
      { name: "Data Protection", score: 95, status: "high" },
      { name: "Social Vulnerability", score: 71, status: "medium" },
      { name: "Digital Literacy", score: 88, status: "high" }
    ]
  };

  const preventionStrategies = [
    {
      title: "Proactive Monitoring",
      description: "AI continuously scans for harassment patterns",
      effectiveness: 94,
      status: "active"
    },
    {
      title: "Context Awareness",
      description: "Understanding Kenyan digital harassment trends",
      effectiveness: 87,
      status: "active"
    },
    {
      title: "Community Intelligence",
      description: "Crowdsourced threat identification",
      effectiveness: 91,
      status: "active"
    },
    {
      title: "Behavioral Analysis",
      description: "Detecting unusual user interaction patterns",
      effectiveness: 83,
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">AI Threat Detection System</h2>
          <p className="text-muted-foreground">Advanced protection using machine learning</p>
        </div>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Recent AI Detections
              </CardTitle>
              <CardDescription>
                Machine learning insights from the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{insight.type}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">{insight.action}</span>
                      <span className="text-muted-foreground">{insight.timestamp}</span>
                    </div>
                    <Progress value={insight.confidence} className="mt-2" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">Kenyan Context Integration</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI models are specifically trained on Kenyan digital harassment patterns, 
                  local language nuances, and cultural context to provide more accurate threat detection.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Risk Categories
                </CardTitle>
                <CardDescription>
                  Comprehensive safety assessment across key areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge 
                          variant={category.status === "high" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {category.score}/100
                        </Badge>
                      </div>
                      <Progress 
                        value={category.score} 
                        className={`h-2 ${
                          category.status === "high" ? "bg-primary/20" : "bg-muted"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Overall Safety Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - riskAssessment.overall / 100)}`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{riskAssessment.overall}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your safety profile is well-protected with room for improvement in communication monitoring.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Improve Score
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prevention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preventionStrategies.map((strategy, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      {strategy.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {strategy.effectiveness}% effective
                    </Badge>
                  </CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Effectiveness</span>
                      <span className="font-medium">{strategy.effectiveness}%</span>
                    </div>
                    <Progress value={strategy.effectiveness} />
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={strategy.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {strategy.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Continuous Learning
              </CardTitle>
              <CardDescription>
                How our AI improves threat detection over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">2,847</div>
                  <p className="text-sm font-medium">Threats Analyzed</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">94.3%</div>
                  <p className="text-sm font-medium">Detection Accuracy</p>
                  <p className="text-xs text-muted-foreground">Improving daily</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">12ms</div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-xs text-muted-foreground">Average detection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThreatDetectionSystem;