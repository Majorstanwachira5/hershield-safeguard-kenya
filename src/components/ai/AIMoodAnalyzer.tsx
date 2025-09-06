import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Sun, 
  Cloud, 
  CloudRain, 
  Zap, 
  Sparkles, 
  Brain, 
  Activity,
  TrendingUp,
  AlertTriangle,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodAnalysis {
  overall: number; // 0-100
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    anxiety: number;
    confidence: number;
  };
  dominant_emotion: string;
  energy_level: number;
  stress_indicators: string[];
  recommendations: string[];
  support_message: string;
}

interface AIMoodAnalyzerProps {
  onAnalysisComplete?: (analysis: MoodAnalysis) => void;
}

const MOOD_PROMPTS = [
  "How are you feeling right now? Tell me about your day...",
  "What's been on your mind lately?",
  "How has this week been treating you?",
  "Share what's making you happy or worried today...",
  "How are you taking care of yourself emotionally?"
];

const EMOTION_COLORS = {
  joy: 'from-yellow-400 to-orange-400',
  sadness: 'from-blue-400 to-blue-600',
  anger: 'from-red-400 to-red-600',
  fear: 'from-purple-400 to-purple-600',
  anxiety: 'from-orange-400 to-red-400',
  confidence: 'from-green-400 to-emerald-500'
};

const EMOTION_ICONS = {
  joy: Sun,
  sadness: CloudRain,
  anger: Zap,
  fear: AlertTriangle,
  anxiety: Cloud,
  confidence: Sparkles
};

export const AIMoodAnalyzer: React.FC<AIMoodAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(MOOD_PROMPTS[0]);
  const [moodHistory, setMoodHistory] = useState<MoodAnalysis[]>([]);

  useEffect(() => {
    // Rotate prompts every 10 seconds
    const interval = setInterval(() => {
      setCurrentPrompt(MOOD_PROMPTS[Math.floor(Math.random() * MOOD_PROMPTS.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const analyzeMood = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI mood analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: MoodAnalysis = generateMockAnalysis(input);
      
      setAnalysis(mockAnalysis);
      setMoodHistory(prev => [...prev.slice(-4), mockAnalysis]); // Keep last 5
      onAnalysisComplete?.(mockAnalysis);
      
    } catch (error) {
      console.error('Mood analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (text: string): MoodAnalysis => {
    const lowerText = text.toLowerCase();
    
    // Analyze text for emotional indicators
    let joy = Math.random() * 30 + 20;
    let sadness = Math.random() * 20 + 10;
    let anger = Math.random() * 15 + 5;
    let fear = Math.random() * 20 + 5;
    let anxiety = Math.random() * 25 + 10;
    let confidence = Math.random() * 30 + 20;

    // Adjust based on text content
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited') || lowerText.includes('great')) {
      joy += 30;
      confidence += 20;
    }
    if (lowerText.includes('sad') || lowerText.includes('cry') || lowerText.includes('upset') || lowerText.includes('down')) {
      sadness += 40;
      joy -= 20;
    }
    if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('furious') || lowerText.includes('hate')) {
      anger += 35;
    }
    if (lowerText.includes('scared') || lowerText.includes('afraid') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      fear += 30;
      anxiety += 25;
    }
    if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('panic') || lowerText.includes('anxious')) {
      anxiety += 35;
      confidence -= 20;
    }
    if (lowerText.includes('strong') || lowerText.includes('capable') || lowerText.includes('proud') || lowerText.includes('confident')) {
      confidence += 35;
      joy += 20;
    }

    // Normalize values
    const emotions = {
      joy: Math.max(0, Math.min(100, joy)),
      sadness: Math.max(0, Math.min(100, sadness)),
      anger: Math.max(0, Math.min(100, anger)),
      fear: Math.max(0, Math.min(100, fear)),
      anxiety: Math.max(0, Math.min(100, anxiety)),
      confidence: Math.max(0, Math.min(100, confidence))
    };

    const dominant_emotion = Object.entries(emotions).reduce((a, b) => emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b)[0];
    const overall = Math.round((emotions.joy + emotions.confidence - emotions.sadness - emotions.fear - emotions.anxiety + 200) / 4);
    const energy_level = Math.round((emotions.joy + emotions.anger + emotions.confidence) / 3);

    const stress_indicators = [];
    if (emotions.anxiety > 60) stress_indicators.push('High anxiety levels detected');
    if (emotions.sadness > 50) stress_indicators.push('Possible depressive thoughts');
    if (emotions.anger > 50) stress_indicators.push('Elevated anger levels');
    if (emotions.fear > 50) stress_indicators.push('Fear-based responses identified');

    const recommendations = generateRecommendations(emotions, dominant_emotion);
    const support_message = generateSupportMessage(emotions, dominant_emotion);

    return {
      overall: Math.max(0, Math.min(100, overall)),
      emotions,
      dominant_emotion,
      energy_level: Math.max(0, Math.min(100, energy_level)),
      stress_indicators,
      recommendations,
      support_message
    };
  };

  const generateRecommendations = (emotions: any, dominant: string): string[] => {
    const recs = [];
    
    if (emotions.anxiety > 50) {
      recs.push('Try deep breathing exercises (4-7-8 technique)');
      recs.push('Consider a short meditation or mindfulness session');
    }
    if (emotions.sadness > 50) {
      recs.push('Reach out to a trusted friend or family member');
      recs.push('Engage in a creative activity that brings you joy');
    }
    if (emotions.anger > 50) {
      recs.push('Take a break and do some physical exercise');
      recs.push('Write down your feelings to process them');
    }
    if (emotions.confidence < 30) {
      recs.push('Practice positive self-affirmations');
      recs.push('Celebrate a small accomplishment from today');
    }
    if (emotions.joy < 30) {
      recs.push('Listen to your favorite music or watch something funny');
      recs.push('Do something kind for yourself today');
    }
    
    // Always include general wellness tips
    recs.push('Stay hydrated and get some fresh air');
    recs.push('Remember: You are stronger than you think! 💪');
    
    return recs.slice(0, 4); // Return top 4 recommendations
  };

  const generateSupportMessage = (emotions: any, dominant: string): string => {
    if (emotions.overall < 40) {
      return "I can sense you're going through a tough time right now. Remember that difficult feelings are temporary, and you have the strength to get through this. You're not alone. 🤗💖";
    } else if (emotions.overall > 70) {
      return "You're radiating positive energy today! It's wonderful to see you feeling good. Keep nurturing this positive mindset - you deserve all the happiness! ✨🌟";
    } else {
      return "You're navigating your emotions with grace. It's perfectly normal to have mixed feelings. Trust yourself and take things one step at a time. 🌸💚";
    }
  };

  const getMoodIcon = (score: number) => {
    if (score >= 70) return Smile;
    if (score >= 40) return Meh;
    return Frown;
  };

  const getMoodColor = (score: number) => {
    if (score >= 70) return 'from-green-400 to-emerald-500';
    if (score >= 40) return 'from-yellow-400 to-orange-400';
    return 'from-blue-400 to-purple-500';
  };

  return (
    <div className="space-y-6">
      <Card className="hover-lift shadow-feminine">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
            <Heart className="h-5 w-5 text-secondary" />
            AI Mood Analyzer
          </CardTitle>
          <CardDescription>
            Share your thoughts and feelings for personalized emotional wellness insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary">{currentPrompt}</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your thoughts here... The more you share, the better I can help you!"
              className="min-h-[100px] border-secondary/30 focus:border-secondary"
            />
          </div>
          
          <Button 
            onClick={analyzeMood}
            disabled={!input.trim() || isAnalyzing}
            className="w-full bg-gradient-feminine hover-lift shadow-glow"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing your emotions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze My Mood
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overall Mood */}
            <Card className="hover-lift shadow-feminine">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${getMoodColor(analysis.overall)} flex items-center justify-center`}>
                    {React.createElement(getMoodIcon(analysis.overall), { className: "h-10 w-10 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{analysis.overall}/100</h3>
                    <p className="text-muted-foreground">Overall Mood Score</p>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <p className="text-sm italic">{analysis.support_message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotion Breakdown */}
            <Card className="hover-lift shadow-feminine">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Emotional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysis.emotions).map(([emotion, value]) => {
                    const Icon = EMOTION_ICONS[emotion as keyof typeof EMOTION_ICONS];
                    const color = EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS];
                    
                    return (
                      <div key={emotion} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-secondary" />
                            <span className="capitalize text-sm font-medium">{emotion}</span>
                          </div>
                          <span className="text-sm font-bold">{Math.round(value)}%</span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dominant Emotion:</span>
                    <Badge className="bg-gradient-feminine text-white capitalize">
                      {analysis.dominant_emotion}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="hover-lift shadow-feminine">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/20"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-feminine flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stress Indicators */}
            {analysis.stress_indicators.length > 0 && (
              <Card className="hover-lift shadow-feminine border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-5 w-5" />
                    Stress Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.stress_indicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-sm text-orange-700">{indicator}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-orange-700">
                      💡 Consider speaking with a counselor or trusted friend if these feelings persist.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMoodAnalyzer;
