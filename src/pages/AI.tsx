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
import AIMoodAnalyzer from "@/components/ai/AIMoodAnalyzer";
import AIChatAssistant from "@/components/ai/AIChatAssistant";
import AILearningCompanion from "@/components/ai/AILearningCompanion";
import Navigation from "@/components/Navigation";
import FeminineBackground from "@/components/ui/FeminineBackground";
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
    bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    stats: 'Analyzes 50+ threat types'
  },
  {
    id: 'safety-advisor',
    title: 'Safety Advisor',
    description: 'Personalized safety advice and risk assessments based on your situation',
    icon: Lightbulb,
    color: 'text-green-500',
    bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    stats: '1000+ safety scenarios'
  },
  {
    id: 'emergency-center',
    title: 'Emergency Center',
    description: 'Real-time emergency response coordination and assistance',
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
    borderColor: 'border-red-200',
    stats: '24/7 Emergency Support'
  },
  {
    id: 'mood-analyzer',
    title: 'Mood Analyzer',
    description: 'Emotional wellness AI that analyzes your feelings and provides support',
    icon: Heart,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    stats: 'Emotional intelligence AI'
  },
  {
    id: 'ai-chat',
    title: 'AI Companion',
    description: 'Your personal AI assistant for safety, support, and empowerment',
    icon: Users,
    color: 'text-pink-500',
    bgColor: 'bg-gradient-to-r from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    stats: '3 AI personalities available'
  },
  {
    id: 'privacy-scanner',
    title: 'Privacy Scanner',
    description: 'Scan your digital footprint and get privacy recommendations',
    icon: Shield,
    color: 'text-indigo-500',
    bgColor: 'bg-gradient-to-r from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    stats: 'Protects your digital identity'
  },
  {
    id: 'learning',
    title: 'Learning Companion',
    description: 'Interactive AI tutor for digital safety education and skills',
    icon: BookOpen,
    color: 'text-teal-500',
    bgColor: 'bg-gradient-to-r from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    stats: 'Personalized learning paths'
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
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-hero relative">
      <FeminineBackground variant="particles" className="opacity-20" />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-4 bg-gradient-feminine rounded-full shadow-glow pulse-glow">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-navy-pink bg-clip-text text-transparent float">AI Safety Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the most advanced AI-powered safety platform designed specifically for women. 
            From threat detection to emotional support, our AI companions are here to protect and empower you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge className="bg-gradient-feminine text-white px-4 py-2 text-sm">
              ✨ 7 AI-Powered Tools
            </Badge>
            <Badge className="bg-gradient-navy-pink text-white px-4 py-2 text-sm">
              🛡️ Advanced Protection
            </Badge>
            <Badge className="bg-gradient-pink-yellow text-foreground px-4 py-2 text-sm">
              💖 Emotional Support
            </Badge>
          </div>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap lg:grid lg:grid-cols-7 bg-gradient-to-r from-background to-secondary/10 border-secondary/30">
          <TabsTrigger value="overview" className="flex items-center gap-2 hover-lift">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="message-analyzer" className="flex items-center gap-2 hover-lift">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="safety-advisor" className="flex items-center gap-2 hover-lift">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Advisor</span>
          </TabsTrigger>
          <TabsTrigger value="emergency-center" className="flex items-center gap-2 hover-lift">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </TabsTrigger>
          <TabsTrigger value="mood-analyzer" className="flex items-center gap-2 hover-lift">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center gap-2 hover-lift">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2 hover-lift">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Hero Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift shadow-feminine bg-gradient-to-br from-card to-secondary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium bg-gradient-navy-pink bg-clip-text text-transparent">Total Analyses</CardTitle>
                <div className="p-2 bg-gradient-feminine rounded-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{aiStats.totalAnalyses.toLocaleString()}</div>
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
                      className={`p-4 rounded-lg border ${feature.bgColor} ${feature.borderColor} cursor-pointer hover:shadow-feminine transition-feminine hover-lift`}
                      onClick={() => setActiveTab(feature.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-feminine shadow-glow`}>
                          <Icon className={`h-5 w-5 text-white`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium bg-gradient-navy-pink bg-clip-text text-transparent">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {feature.stats}
                          </Badge>
                          <br />
                          <Button
                            variant="feminine"
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
        
        <TabsContent value="mood-analyzer">
          <AIMoodAnalyzer onAnalysisComplete={(analysis) => {
            console.log('Mood analysis completed:', analysis);
            if (analysis.overall < 40) {
              toast.error('Low mood detected - consider reaching out for support', {
                description: 'Your emotional wellbeing is important. Consider speaking with someone you trust.'
              });
            }
          }} />
        </TabsContent>
        
        <TabsContent value="ai-chat">
          <div className="space-y-6">
            <Card className="hover-lift shadow-feminine">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
                  <Users className="h-5 w-5 text-secondary" />
                  AI Companion Chat
                </CardTitle>
                <CardDescription>
                  Meet your AI companions - Amara, Safira, and Wendo. Each has a unique personality to support you!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-gradient-feminine hover-lift shadow-glow"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open AI Chat
                  </Button>
                </div>
                
                <div className="grid gap-4 mt-6 md:grid-cols-3">
                  {[
                    { name: 'Amara', emoji: '✨', desc: 'Your empowering AI sister', color: 'from-pink-500 to-purple-500' },
                    { name: 'Safira', emoji: '🛡️', desc: 'Your protective AI guardian', color: 'from-blue-500 to-indigo-500' },
                    { name: 'Wendo', emoji: '🌸', desc: 'Your caring AI friend', color: 'from-green-400 to-teal-500' }
                  ].map((ai, index) => (
                    <Card key={index} className={`text-center p-4 bg-gradient-to-r ${ai.color} text-white hover-lift`}>
                      <div className="text-3xl mb-2">{ai.emoji}</div>
                      <h3 className="font-bold">{ai.name}</h3>
                      <p className="text-sm opacity-90">{ai.desc}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <AIChatAssistant 
              isMinimized={!isChatOpen}
              onToggle={() => setIsChatOpen(!isChatOpen)}
              position="center"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="privacy-scanner">
          <Card className="hover-lift shadow-feminine">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
                <Shield className="h-5 w-5 text-secondary" />
                Privacy Scanner (Coming Soon)
              </CardTitle>
              <CardDescription>
                Advanced privacy analysis and recommendations for your digital safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg border border-secondary/20">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-lg font-semibold mb-2">Amazing Privacy Features Coming Soon!</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI will soon scan your digital footprint, analyze privacy settings across platforms, 
                  and provide personalized recommendations to keep you safe online.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Badge className="bg-gradient-feminine text-white">Social Media Scan</Badge>
                  <Badge className="bg-gradient-navy-pink text-white">Privacy Score</Badge>
                  <Badge className="bg-gradient-pink-yellow text-foreground">Smart Recommendations</Badge>
                  <Badge className="bg-gradient-safe text-white">Real-time Monitoring</Badge>
                </div>
              </div>
            </Card>
          </Card>
        </TabsContent>
        
        <TabsContent value="learning">
          <AILearningCompanion onLessonComplete={(lessonId, score) => {
            console.log(`Lesson ${lessonId} completed with score:`, score);
            toast.success(`Lesson completed! Score: ${score}%`, {
              description: 'Great job on your learning journey! Keep up the amazing work.'
            });
            
            // Update AI stats
            updateAiStats({
              safetyAdvicesGenerated: aiStats.safetyAdvicesGenerated + 1
            });
          }} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
