import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Lightbulb, 
  Target, 
  Users, 
  Phone,
  BookOpen,
  Star,
  Zap
} from "lucide-react";
import { aiAPI } from "@/lib/api";
import { toast } from "sonner";

interface SafetyAdvice {
  recommendations: string[];
  immediateActions: string[];
  preventiveMeasures: string[];
  resources: Array<{
    name: string;
    contact: string;
    description: string;
  }>;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface RiskAssessment {
  riskLevel: string;
  riskScore: number;
  primaryConcerns: string[];
  mitigationStrategies: string[];
  recommendedActions: string[];
  emergencyContactSuggestion: boolean;
}

const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
  'Kisii', 'Naivasha', 'Bungoma', 'Embu', 'Voi', 'Webuye'
];

const SAFETY_CATEGORIES = [
  'dating', 'workplace', 'online', 'transportation', 'harassment', 
  'stalking', 'domestic', 'nightlife', 'travel', 'general'
];

const TIME_PERIODS = [
  'morning', 'afternoon', 'evening', 'night', 'late_night'
];

export const AISafetyAdvisor: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [newRiskFactor, setNewRiskFactor] = useState('');
  
  const [safetyAdvice, setSafetyAdvice] = useState<SafetyAdvice | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('advisor');

  // Auto-save form state
  useEffect(() => {
    const savedState = localStorage.getItem('safetyAdvisorState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setSituation(state.situation || '');
        setCategory(state.category || '');
        setLocation(state.location || '');
        setTimeOfDay(state.timeOfDay || '');
        setRiskFactors(state.riskFactors || []);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    const state = { situation, category, location, timeOfDay, riskFactors };
    localStorage.setItem('safetyAdvisorState', JSON.stringify(state));
  }, [situation, category, location, timeOfDay, riskFactors]);

  const addRiskFactor = () => {
    if (newRiskFactor.trim() && !riskFactors.includes(newRiskFactor.trim())) {
      setRiskFactors([...riskFactors, newRiskFactor.trim()]);
      setNewRiskFactor('');
    }
  };

  const removeRiskFactor = (factor: string) => {
    setRiskFactors(riskFactors.filter(f => f !== factor));
  };

  const getSafetyAdvice = async () => {
    if (!situation.trim()) {
      toast.error('Please describe your situation');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.getSafetyAdvice({
        situation: situation.trim(),
        category: category || 'general'
      });

      if (response.data.success) {
        setSafetyAdvice(response.data.data);
        toast.success('Safety advice generated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to get safety advice');
      }
    } catch (error) {
      console.error('Safety advice error:', error);
      toast.error('Failed to get safety advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performRiskAssessment = async () => {
    if (riskFactors.length === 0) {
      toast.error('Please add at least one risk factor');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.assessRisk({
        factors: riskFactors,
        location: location || undefined,
        timeOfDay: timeOfDay || undefined
      });

      if (response.data.success) {
        setRiskAssessment(response.data.data);
        toast.success('Risk assessment completed');
      } else {
        throw new Error(response.data.message || 'Failed to assess risk');
      }
    } catch (error) {
      console.error('Risk assessment error:', error);
      toast.error('Failed to assess risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">AI Safety Advisor</h2>
        <p className="text-muted-foreground">
          Get personalized safety advice and risk assessments powered by AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="advisor" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Safety Advisor
          </TabsTrigger>
          <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advisor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Describe Your Situation
              </CardTitle>
              <CardDescription>
                Tell us about your current situation to get personalized safety advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAFETY_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location (Optional)
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYAN_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Situation Description</label>
                <Textarea
                  placeholder="Describe your situation in detail. For example: 'I'm meeting someone from a dating app for the first time' or 'I've been receiving threatening messages from a coworker'..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={getSafetyAdvice}
                disabled={loading || !situation.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Getting Advice...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Get Safety Advice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {safetyAdvice && (
            <div className="grid gap-6">
              <Alert className={`${getRiskColor(safetyAdvice.urgencyLevel)} border-l-4`}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  Urgency Level: 
                  <Badge variant={getUrgencyColor(safetyAdvice.urgencyLevel)}>
                    {safetyAdvice.urgencyLevel.toUpperCase()}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  Based on your situation, this advice has been prioritized as {safetyAdvice.urgencyLevel} urgency.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Immediate Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safetyAdvice.immediateActions.length > 0 ? (
                      <ul className="space-y-2">
                        {safetyAdvice.immediateActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No immediate actions required.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      General Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {safetyAdvice.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-purple-500" />
                      Prevention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {safetyAdvice.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {safetyAdvice.resources.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Emergency Resources & Contacts
                    </CardTitle>
                    <CardDescription>
                      Important contacts and resources for your situation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {safetyAdvice.resources.map((resource, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-1">
                          <h4 className="font-medium">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="font-mono text-sm">{resource.contact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
              <CardDescription>
                Analyze potential risks based on various factors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYAN_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time of Day
                  </label>
                  <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_PERIODS.map(time => (
                        <SelectItem key={time} value={time}>
                          {time.charAt(0).toUpperCase() + time.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Factors</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a risk factor (e.g., 'meeting stranger', 'walking alone', etc.)"
                    value={newRiskFactor}
                    onChange={(e) => setNewRiskFactor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRiskFactor()}
                  />
                  <Button onClick={addRiskFactor} disabled={!newRiskFactor.trim()}>
                    Add
                  </Button>
                </div>
                
                {riskFactors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {riskFactors.map((factor, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeRiskFactor(factor)}>
                        {factor} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={performRiskAssessment}
                disabled={loading || riskFactors.length === 0}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Assessing Risk...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Assess Risk
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {riskAssessment && (
            <div className="space-y-6">
              <Card className={`${getRiskColor(riskAssessment.riskLevel)} border-l-4`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Risk Assessment Results</span>
                    <Badge className={getRiskColor(riskAssessment.riskLevel)}>
                      {riskAssessment.riskLevel.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Risk Score: {riskAssessment.riskScore}/20
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(riskAssessment.riskScore / 20) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Concerns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {riskAssessment.primaryConcerns.length > 0 ? (
                      <ul className="space-y-2">
                        {riskAssessment.primaryConcerns.map((concern, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific concerns identified.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mitigation Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {riskAssessment.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                  {riskAssessment.emergencyContactSuggestion && (
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertTitle>Emergency Contact Recommended</AlertTitle>
                      <AlertDescription>
                        Consider sharing your location and plans with trusted contacts.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {riskAssessment.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
