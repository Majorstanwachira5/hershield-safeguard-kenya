import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Brain, MessageSquare, Eye, TrendingUp } from "lucide-react";
import { aiAPI } from "@/lib/api";
import { toast } from "sonner";

interface AnalysisResult {
  threatLevel: number;
  detectedThreats: string[];
  confidence: number;
  recommendations: string[];
  sentiment: string;
  riskLevel?: string;
  isHarassment?: boolean;
  harassmentType?: string;
  isAppropriate?: boolean;
  flags?: string[];
}

interface AIMessageAnalyzerProps {
  onThreatDetected?: (result: AnalysisResult) => void;
  autoAnalyze?: boolean;
  showAdvanced?: boolean;
}

export const AIMessageAnalyzer: React.FC<AIMessageAnalyzerProps> = ({
  onThreatDetected,
  autoAnalyze = false,
  showAdvanced = true
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    message: string;
    result: AnalysisResult;
    timestamp: Date;
  }>>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Real-time analysis with debouncing
  useEffect(() => {
    if (!realTimeMode || !message.trim() || message.length < 10) return;

    const debounceTimer = setTimeout(() => {
      performAnalysis(message, true);
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [message, realTimeMode]);

  const performAnalysis = useCallback(async (text: string, isRealTime = false) => {
    if (!text.trim()) {
      toast.error('Please enter a message to analyze');
      return;
    }

    setLoading(true);
    try {
      // Perform multiple AI analyses simultaneously
      const [
        messageAnalysis,
        threatDetection,
        contentModeration,
        harassmentCheck,
        sentimentAnalysis
      ] = await Promise.allSettled([
        aiAPI.analyzeMessage({ message: text, context: 'general' }),
        aiAPI.detectThreat(text),
        aiAPI.moderateContent(text),
        aiAPI.checkHarassment(text),
        aiAPI.analyzeSentiment(text)
      ]);

      // Combine results
      const combinedResult: AnalysisResult = {
        threatLevel: 0,
        detectedThreats: [],
        confidence: 0,
        recommendations: [],
        sentiment: 'neutral'
      };

      // Process message analysis
      if (messageAnalysis.status === 'fulfilled') {
        const data = messageAnalysis.value.data.data;
        combinedResult.threatLevel = Math.max(combinedResult.threatLevel, data.threatLevel || 0);
        combinedResult.detectedThreats.push(...(data.detectedThreats || []));
        combinedResult.confidence = Math.max(combinedResult.confidence, data.confidence || 0);
        combinedResult.recommendations.push(...(data.recommendations || []));
        combinedResult.sentiment = data.sentiment || combinedResult.sentiment;
      }

      // Process threat detection
      if (threatDetection.status === 'fulfilled') {
        const data = threatDetection.value.data.data;
        combinedResult.riskLevel = data.riskLevel;
        combinedResult.detectedThreats.push(...(data.threats || []));
        combinedResult.recommendations.push(...(data.suggestedActions || []));
      }

      // Process content moderation
      if (contentModeration.status === 'fulfilled') {
        const data = contentModeration.value.data.data;
        combinedResult.isAppropriate = data.isAppropriate;
        combinedResult.flags = data.flags;
      }

      // Process harassment check
      if (harassmentCheck.status === 'fulfilled') {
        const data = harassmentCheck.value.data.data;
        combinedResult.isHarassment = data.isHarassment;
        combinedResult.harassmentType = data.type;
        if (data.patterns) {
          combinedResult.recommendations.push(...data.recommendations);
        }
      }

      // Process sentiment analysis
      if (sentimentAnalysis.status === 'fulfilled') {
        const data = sentimentAnalysis.value.data.data;
        combinedResult.sentiment = data.sentiment;
        combinedResult.confidence = Math.max(combinedResult.confidence, data.confidence || 0);
      }

      // Remove duplicates and clean up
      combinedResult.detectedThreats = [...new Set(combinedResult.detectedThreats)];
      combinedResult.recommendations = [...new Set(combinedResult.recommendations)];

      setResults(combinedResult);

      // Add to history if not real-time
      if (!isRealTime) {
        setAnalysisHistory(prev => [{
          message: text,
          result: combinedResult,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]); // Keep last 10 analyses
      }

      // Trigger callback if threat detected
      if (combinedResult.threatLevel >= 6 && onThreatDetected) {
        onThreatDetected(combinedResult);
      }

      // Show toast for high-risk threats
      if (combinedResult.threatLevel >= 8) {
        toast.error('High-risk threat detected!', {
          description: 'Please review the safety recommendations immediately.'
        });
      } else if (combinedResult.threatLevel >= 6) {
        toast.warning('Potential threat detected', {
          description: 'Consider reviewing the analysis results.'
        });
      }

    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast.error('Failed to analyze message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onThreatDetected]);

  const getThreatLevelColor = (level: number) => {
    if (level >= 8) return 'destructive';
    if (level >= 6) return 'default';
    if (level >= 4) return 'secondary';
    return 'outline';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'hostile': return 'bg-red-200 text-red-900';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Message Analyzer
          </CardTitle>
          <CardDescription>
            Advanced AI-powered threat detection and content analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input" className="text-sm font-medium">
                Message to Analyze
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRealTimeMode(!realTimeMode)}
                  className={realTimeMode ? 'bg-primary/10' : ''}
                >
                  {realTimeMode ? 'Real-time ON' : 'Real-time OFF'}
                </Button>
              </div>
            </div>
            <Textarea
              id="message-input"
              placeholder="Enter a message, email, or any text content to analyze for potential threats..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => performAnalysis(message)}
              disabled={loading || !message.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMessage('');
                setResults(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="analysis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Threat Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Threat Level</span>
                      <Badge variant={getThreatLevelColor(results.threatLevel)}>
                        {results.threatLevel}/10
                      </Badge>
                    </div>
                    <Progress value={results.threatLevel * 10} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(results.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={results.confidence * 100} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium">Sentiment</span>
                    <div>
                      <Badge className={getSentimentColor(results.sentiment)}>
                        {results.sentiment.charAt(0).toUpperCase() + results.sentiment.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {results.riskLevel && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Risk Level</span>
                      <div>
                        <Badge variant={results.riskLevel === 'critical' || results.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                          {results.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.isHarassment !== undefined && (
                    <Alert variant={results.isHarassment ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Harassment Detection</AlertTitle>
                      <AlertDescription>
                        {results.isHarassment 
                          ? `Potential ${results.harassmentType || 'harassment'} detected`
                          : 'No harassment patterns detected'
                        }
                      </AlertDescription>
                    </Alert>
                  )}

                  {results.isAppropriate !== undefined && (
                    <Alert variant={results.isAppropriate ? "default" : "destructive"}>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Content Moderation</AlertTitle>
                      <AlertDescription>
                        Content is {results.isAppropriate ? 'appropriate' : 'inappropriate'} for the platform
                      </AlertDescription>
                    </Alert>
                  )}

                  {results.flags && results.flags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Content Flags</span>
                      <div className="flex flex-wrap gap-1">
                        {results.flags.map((flag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats">
            <Card>
              <CardHeader>
                <CardTitle>Detected Threats</CardTitle>
                <CardDescription>
                  Specific threat types identified in the content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.detectedThreats.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {results.detectedThreats.map((threat, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="font-medium">
                          {threat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specific threats detected.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Safety Recommendations</CardTitle>
                <CardDescription>
                  Suggested actions based on the analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No specific recommendations at this time.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>
                  Previous analyses performed in this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-3">
                    {analysisHistory.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {item.message.slice(0, 60)}...
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getThreatLevelColor(item.result.threatLevel)} className="text-xs">
                            Level: {item.result.threatLevel}
                          </Badge>
                          <Badge className={getSentimentColor(item.result.sentiment) + " text-xs"}>
                            {item.result.sentiment}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No analysis history available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
