import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Award, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  Play, 
  Star,
  Brain,
  Shield,
  Users,
  Heart,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  category: string;
  completed: boolean;
  content: string[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

interface AILearningCompanionProps {
  onLessonComplete?: (lessonId: string, score?: number) => void;
}

const LEARNING_PATHS = [
  {
    id: 'digital-safety',
    title: 'Digital Safety Fundamentals',
    description: 'Master the basics of staying safe online',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500',
    lessons: 8,
    completed: 3
  },
  {
    id: 'social-media',
    title: 'Social Media Security',
    description: 'Protect yourself on social platforms',
    icon: Users,
    color: 'from-pink-500 to-purple-500',
    lessons: 6,
    completed: 2
  },
  {
    id: 'emotional-wellness',
    title: 'Digital Wellness & Mental Health',
    description: 'Maintain healthy boundaries online',
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    lessons: 5,
    completed: 1
  }
];

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: 'password-security',
    title: 'Creating Strong Passwords',
    description: 'Learn to create unbreakable passwords that keep you safe',
    difficulty: 'beginner',
    duration: 5,
    category: 'Digital Safety',
    completed: false,
    content: [
      "🔒 A strong password is your first line of defense online!",
      "✨ Use at least 12 characters with a mix of letters, numbers, and symbols",
      "🚫 Never use personal information like birthdays or names",
      "🔄 Use a unique password for each account",
      "💡 Consider using a password manager like Bitwarden or 1Password",
      "🎯 Example: 'MyS@feP@ssw0rd2024!' is much stronger than 'password123'"
    ],
    quiz: {
      question: "Which of these is the strongest password?",
      options: [
        "password123",
        "MyBirthday1990",
        "T3@rs0fJ0y#2024!",
        "123456789"
      ],
      correct: 2
    }
  },
  {
    id: 'social-privacy',
    title: 'Social Media Privacy Settings',
    description: 'Master privacy controls on popular platforms',
    difficulty: 'intermediate',
    duration: 8,
    category: 'Social Media',
    completed: false,
    content: [
      "🔍 Review your privacy settings on all social platforms monthly",
      "👥 Limit who can see your posts and personal information",
      "📍 Turn off location sharing unless absolutely necessary",
      "🚫 Be cautious about accepting friend requests from strangers",
      "📱 Check what information apps can access on your phone",
      "🎯 Remember: If it's online, it can potentially be seen by others"
    ],
    quiz: {
      question: "How often should you review your social media privacy settings?",
      options: [
        "Once a year",
        "Monthly",
        "Only when you remember",
        "Never"
      ],
      correct: 1
    }
  }
];

export const AILearningCompanion: React.FC<AILearningCompanionProps> = ({ onLessonComplete }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalLessons: 19,
    completedLessons: 6,
    currentStreak: 3,
    points: 1250
  });

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setLessonProgress(0);
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  const nextLessonStep = () => {
    if (!currentLesson) return;
    
    if (lessonProgress < currentLesson.content.length - 1) {
      setLessonProgress(lessonProgress + 1);
    } else if (currentLesson.quiz && !showQuizResult) {
      // Show quiz
      setLessonProgress(currentLesson.content.length);
    } else {
      // Complete lesson
      completeLesson();
    }
  };

  const submitQuiz = () => {
    if (!currentLesson?.quiz || quizAnswer === null) return;
    
    setShowQuizResult(true);
    const isCorrect = quizAnswer === currentLesson.quiz.correct;
    
    setTimeout(() => {
      completeLesson(isCorrect ? 100 : 60);
    }, 2000);
  };

  const completeLesson = (score = 85) => {
    if (!currentLesson) return;
    
    // Update progress
    setUserProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons + 1,
      points: prev.points + Math.round(score * 1.2),
      currentStreak: prev.currentStreak + 1
    }));
    
    onLessonComplete?.(currentLesson.id, score);
    setCurrentLesson(null);
    setLessonProgress(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (currentLesson) {
    return (
      <div className="space-y-6">
        <Card className="hover-lift shadow-feminine">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  {currentLesson.title}
                </CardTitle>
                <CardDescription>{currentLesson.description}</CardDescription>
              </div>
              <Badge className={`${getDifficultyColor(currentLesson.difficulty)}`}>
                {currentLesson.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Progress 
                value={(lessonProgress / (currentLesson.content.length + (currentLesson.quiz ? 1 : 0))) * 100} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground">
                {lessonProgress + 1}/{currentLesson.content.length + (currentLesson.quiz ? 1 : 0)}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {lessonProgress < currentLesson.content.length ? (
                <motion.div
                  key={lessonProgress}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg border border-secondary/20">
                    <p className="text-lg leading-relaxed">{currentLesson.content[lessonProgress]}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentLesson(null)}
                    >
                      Exit Lesson
                    </Button>
                    <Button
                      onClick={nextLessonStep}
                      className="bg-gradient-feminine hover-lift"
                    >
                      {lessonProgress === currentLesson.content.length - 1 
                        ? (currentLesson.quiz ? 'Take Quiz' : 'Complete')
                        : 'Next'
                      }
                    </Button>
                  </div>
                </motion.div>
              ) : currentLesson.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg border border-accent/20">
                    <h3 className="text-lg font-semibold mb-4">Quiz Time! 🧠</h3>
                    <p className="text-base mb-4">{currentLesson.quiz.question}</p>
                    
                    <div className="space-y-2">
                      {currentLesson.quiz.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setQuizAnswer(index)}
                          disabled={showQuizResult}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            quizAnswer === index 
                              ? showQuizResult
                                ? index === currentLesson.quiz!.correct
                                  ? 'bg-green-100 border-green-300 text-green-700'
                                  : 'bg-red-100 border-red-300 text-red-700'
                                : 'bg-secondary/20 border-secondary/40'
                              : showQuizResult && index === currentLesson.quiz!.correct
                                ? 'bg-green-100 border-green-300 text-green-700'
                                : 'bg-background border-border hover:bg-secondary/10'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {showQuizResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-lg bg-gradient-feminine/10 border border-secondary/20"
                      >
                        <p className="text-center">
                          {quizAnswer === currentLesson.quiz.correct 
                            ? "🎉 Excellent! You got it right!" 
                            : "💪 Good try! You're learning and that's what matters!"}
                        </p>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentLesson(null)}
                    >
                      Exit Lesson
                    </Button>
                    <Button
                      onClick={submitQuiz}
                      disabled={quizAnswer === null || showQuizResult}
                      className="bg-gradient-feminine hover-lift"
                    >
                      {showQuizResult ? 'Completing...' : 'Submit Answer'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Progress */}
      <Card className="hover-lift shadow-feminine">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
            <Award className="h-5 w-5 text-secondary" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-gradient-feminine/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{userProgress.completedLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-navy-pink/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userProgress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-pink-yellow/20 rounded-lg">
              <div className="text-2xl font-bold text-accent">{userProgress.points}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div className="text-center p-4 bg-gradient-safe/20 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {userProgress.completedLessons}/{userProgress.totalLessons} lessons
              </span>
            </div>
            <Progress value={(userProgress.completedLessons / userProgress.totalLessons) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <div className="grid gap-6 md:grid-cols-3">
        {LEARNING_PATHS.map((path) => {
          const Icon = path.icon;
          return (
            <Card key={path.id} className="hover-lift shadow-feminine cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${path.color} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{path.completed}/{path.lessons}</span>
                    </div>
                    <Progress value={(path.completed / path.lessons) * 100} />
                  </div>
                  <Button 
                    className="w-full bg-gradient-feminine hover-lift"
                    onClick={() => setSelectedPath(path.id)}
                  >
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Available Lessons */}
      <Card className="hover-lift shadow-feminine">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-navy-pink bg-clip-text text-transparent">
            <Target className="h-5 w-5 text-secondary" />
            Featured Lessons
          </CardTitle>
          <CardDescription>
            Start with these essential safety lessons designed for women in Kenya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SAMPLE_LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 border rounded-lg hover:shadow-feminine transition-feminine hover-lift bg-gradient-to-r from-background to-secondary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{lesson.title}</h3>
                      <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.duration} min
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span>{lesson.category}</span>
                      {lesson.quiz && (
                        <>
                          <span>•</span>
                          <Brain className="h-3 w-3" />
                          <span>Interactive Quiz</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => startLesson(lesson)}
                    className="bg-gradient-feminine hover-lift shadow-glow"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningCompanion;
