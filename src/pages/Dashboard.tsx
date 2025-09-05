import React, { useState, useEffect } from 'react';
import { AlertTriangle, BookOpen, Shield, TrendingUp, Activity, Users, Clock, CheckCircle, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickActions from "@/components/QuickActions";
import SafetyTipCard from "@/components/SafetyTipCard";
import EmergencyButton from "@/components/EmergencyButton";
import QuickReportButton from "@/components/QuickReportButton";
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [safetyScore, setSafetyScore] = useState(0);
  const [activeThreats, setActiveThreats] = useState(3);
  const [reportsHandled, setReportsHandled] = useState(127);
  const [communitySize, setCommunitySize] = useState(2847);

  // Animate safety score on mount
  useEffect(() => {
    const timer = setTimeout(() => setSafetyScore(89), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Safety Score",
      value: `${safetyScore}/100`,
      change: "+5 this week",
      icon: Shield,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Threats Blocked",
      value: activeThreats,
      change: "Today",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Reports Handled",
      value: reportsHandled,
      change: "This month",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Community Members",
      value: communitySize.toLocaleString(),
      change: "+156 this week",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  const recentActivities = [
    {
      type: "success",
      title: "AI Protection Active",
      description: "Blocked 3 suspicious messages automatically",
      time: "5 minutes ago",
      icon: Shield
    },
    {
      type: "info",
      title: "Privacy Settings Updated",
      description: "Your safety profile has been optimized",
      time: "2 hours ago",
      icon: CheckCircle
    },
    {
      type: "warning",
      title: "New Safety Alert",
      description: "Phishing attempt detected on linked account",
      time: "1 day ago",
      icon: Bell
    }
  ];

  const safetyTips = [
    {
      title: "Protect Your Privacy",
      description: "Keep your personal information secure online",
      tips: [
        "Review your social media privacy settings regularly",
        "Don't share your location with strangers",
        "Use strong, unique passwords for each account",
        "Be cautious about what you post publicly"
      ],
      category: "privacy" as const
    },
    {
      title: "Dealing with Harassment",
      description: "How to handle online harassment and abuse",
      tips: [
        "Block and report abusive users immediately",
        "Document harassment with screenshots",
        "Don't engage with trolls or harassers",
        "Reach out to trusted friends or family for support"
      ],
      category: "harassment" as const
    },
    {
      title: "Emergency Preparedness",
      description: "Be prepared for urgent situations",
      tips: [
        "Save emergency contacts in your phone",
        "Know your local emergency numbers",
        "Share your location with trusted contacts when needed",
        "Have a safety plan for different scenarios"
      ],
      category: "emergency" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation showAuthButtons={false} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Breadcrumbs />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Your Safe Space
            </motion.h1>
            <motion.p 
              className="text-muted-foreground max-w-3xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              HerShield is designed to protect and empower women online. Access safety tools, 
              privacy controls, and emergency features all in one secure platform.
            </motion.p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Safety Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                      {stat.title === "Safety Score" && (
                        <div className="mt-4">
                          <Progress value={safetyScore} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Excellent protection level
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <QuickActions />
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Activity - Left Column */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest safety activities and system updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                          activity.type === 'success' ? 'bg-green-50 border-green-200' :
                          activity.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'success' ? 'bg-green-100' :
                          activity.type === 'warning' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <activity.icon className={`h-4 w-4 ${
                            activity.type === 'success' ? 'text-green-600' :
                            activity.type === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                        <Badge variant={activity.type === 'warning' ? 'destructive' : 'default'}>
                          {activity.type}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Tips - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Today's Safety Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg border">
                      <h4 className="font-semibold mb-2">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your accounts to prevent unauthorized access.
                      </p>
                      <Button size="sm" className="w-full">
                        Learn More
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View All Tips
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Fixed Action Buttons */}
      <EmergencyButton />
      <QuickReportButton />
    </div>
  );
};

export default Dashboard;