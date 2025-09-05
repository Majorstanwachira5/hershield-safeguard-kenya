import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  Zap, 
  MessageSquare, 
  Target, 
  Users,
  Sparkles,
  Activity,
  TrendingUp,
  Clock
} from "lucide-react";
import { AIMessageAnalyzer } from "@/components/ai/AIMessageAnalyzer";
import { AISafetyAdvisor } from "@/components/ai/AISafetyAdvisor";
import { AIEmergencyCenter } from "@/components/ai/AIEmergencyCenter";
import { toast } from "sonner";

interface AIStats {
  totalAnalyses: number;
  threatsDetected: number;
  safetyAdvicesGenerated: number;
  emergencyResponsesProvided: number;
  averageThreatLevel: number;
  lastActive: Date;
}

interface QuickAnalysisResult {
  threatLevel: number;
  sentiment: string;
  confidence: number;
}

const AI_FEATURES = [
  {
    id: 'message-analyzer',
    title: 'Message Analyzer',
    description: 'Advanced AI analysis of messages, emails, and content for threat detection',
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'safety-advisor',
    title: 'Safety Advisor',
    description: 'Personalized safety advice and risk assessments based on your situation',
    icon: Lightbulb,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'emergency-center',
    title: 'Emergency Center',
    description: 'Real-time emergency response coordination and assistance',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
];

const SAMPLE_QUICK_TESTS = [
  "I'm meeting someone from a dating app tonight",
  "Someone has been following me home from work",
  "I received threatening messages on social media",
  "My ex-partner won't stop contacting me",
  "I feel unsafe walking alone at night"
];

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiStats, setAiStats] = useState<AIStats>({
    totalAnalyses: 0,
    threatsDetected: 0,
    safetyAdvicesGenerated: 0,
    emergencyResponsesProvided: 0,
    averageThreatLevel: 0,
    lastActive: new Date()
  });
  const [quickAnalysisResults, setQuickAnalysisResults] = useState<Map<string, QuickAnalysisResult>>(new Map());
  const [loadingQuickTest, setLoadingQuickTest] = useState<string | null>(null);

  // Load AI statistics from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('aiStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setAiStats({
          ...stats,
          lastActive: new Date(stats.lastActive)
        });
      } catch (error) {
        console.error('Error loading AI stats:', error);
      }
    }
  }, []);

  // Save AI statistics
  const updateAiStats = (updates: Partial<AIStats>) => {
    const newStats = { ...aiStats, ...updates, lastActive: new Date() };
    setAiStats(newStats);
    localStorage.setItem('aiStats', JSON.stringify(newStats));
  };

  const handleThreatDetected = (result: any) => {
    updateAiStats({
      totalAnalyses: aiStats.totalAnalyses + 1,
      threatsDetected: aiStats.threatsDetected + (result.threatLevel >= 6 ? 1 : 0),
      averageThreatLevel: ((aiStats.averageThreatLevel * aiStats.totalAnalyses) + result.threatLevel) / (aiStats.totalAnalyses + 1)
    });

    if (result.threatLevel >= 8) {
      toast.error('High-risk threat detected!', {
        description: 'Consider using the Emergency Center for immediate assistance.',
        action: {
          label: 'Go to Emergency Center',
          onClick: () => setActiveTab('emergency-center')
        }
      });
    }
  };

  const runQuickAnalysis = async (testText: string) => {
    setLoadingQuickTest(testText);
    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult: QuickAnalysisResult = {
        threatLevel: Math.floor(Math.random() * 10) + 1,
        sentiment: ['positive', 'neutral', 'negative', 'hostile'][Math.floor(Math.random() * 4)],
        confidence: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
      };
      
      setQuickAnalysisResults(prev => new Map(prev.set(testText, mockResult)));
      toast.success('Quick analysis completed');
    } catch (error) {
      toast.error('Quick analysis failed');
    } finally {
      setLoadingQuickTest(null);
    }
  };

  const getThreatLevelColor = (level: number) => {
    if (level >= 8) return 'text-red-600 bg-red-100';
    if (level >= 6) return 'text-orange-600 bg-orange-100';
    if (level >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'hostile': return 'text-red-700 bg-red-200';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold">AI Safety Hub</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Harness the power of artificial intelligence for advanced threat detection, 
          personalized safety advice, and emergency response coordination.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="message-analyzer" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="safety-advisor" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Advisor</span>
          </TabsTrigger>
          <TabsTrigger value="emergency-center" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.totalAnalyses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  AI-powered content scans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{aiStats.threatsDetected.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Potential safety risks identified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Safety Advice</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{aiStats.safetyAdvicesGenerated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Personalized recommendations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Threat Level</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.averageThreatLevel.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">
                  Across all analyses
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Features
                </CardTitle>
                <CardDescription>
                  Explore our comprehensive AI-powered safety tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {AI_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      className={`p-4 rounded-lg border ${feature.bgColor} ${feature.borderColor} cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => setActiveTab(feature.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-white ${feature.borderColor} border`}>
                          <Icon className={`h-5 w-5 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab(feature.id);
                            }}
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Safety Tests
                </CardTitle>
                <CardDescription>
                  Test our AI with common safety scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAMPLE_QUICK_TESTS.map((testText, index) => {
                  const result = quickAnalysisResults.get(testText);
                  const isLoading = loadingQuickTest === testText;
                  
                  return (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm flex-1">{testText}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runQuickAnalysis(testText)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Zap className="h-3 w-3 animate-pulse" />
                          ) : (
                            'Analyze'
                          )}
                        </Button>
                      </div>
                      
                      {result && (
                        <div className="flex gap-2">
                          <Badge className={`text-xs ${getThreatLevelColor(result.threatLevel)}`}>
                            Threat: {result.threatLevel}/10
                          </Badge>
                          <Badge className={`text-xs ${getSentimentColor(result.sentiment)}`}>
                            {result.sentiment}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(result.confidence * 100)}% confident
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertTitle>AI-Powered Protection</AlertTitle>
            <AlertDescription>
              Our AI systems are designed specifically for women's safety in Kenya, 
              understanding local context, cultural nuances, and providing relevant resources and support.
              All analyses are performed with privacy and security as top priorities.
            </AlertDescription>
          </Alert>

          {aiStats.totalAnalyses > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Last AI analysis performed: {aiStats.lastActive.toLocaleString()}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{aiStats.totalAnalyses}</div>
                    <div className="text-xs text-blue-600">Total Scans</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{aiStats.threatsDetected}</div>
                    <div className="text-xs text-red-600">Threats Found</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round((1 - aiStats.threatsDetected / Math.max(aiStats.totalAnalyses, 1)) * 100)}%
                    </div>
                    <div className="text-xs text-green-600">Safety Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="message-analyzer">
          <AIMessageAnalyzer 
            onThreatDetected={handleThreatDetected}
            showAdvanced={true}
          />
        </TabsContent>

        <TabsContent value="safety-advisor">
          <AISafetyAdvisor />
        </TabsContent>

        <TabsContent value="emergency-center">
          <AIEmergencyCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
