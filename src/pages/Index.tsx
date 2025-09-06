import { Shield, Heart, Users, Lock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FeminineLogo from "@/components/ui/FeminineLogo";
import FeminineBackground from "@/components/ui/FeminineBackground";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Protection",
      description: "Real-time detection of harassment and abuse with intelligent filtering"
    },
    {
      icon: Lock,
      title: "Privacy by Design", 
      description: "Complete control over your data with encrypted, secure storage"
    },
    {
      icon: Users,
      title: "Trusted Network",
      description: "Connect with verified support contacts and emergency resources"
    },
    {
      icon: Heart,
      title: "Mental Wellbeing",
      description: "Resources and tools to support your emotional and mental health"
    }
  ];

  const testimonials = [
    {
      name: "Amina K.",
      location: "Nairobi",
      text: "HerShield gave me the confidence to engage online safely. The emergency features are a lifesaver.",
      rating: 5
    },
    {
      name: "Grace M.", 
      location: "Mombasa",
      text: "Finally, a platform that understands the unique challenges women face online in Kenya.",
      rating: 5
    }
  ];

  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <FeminineBackground variant="hero" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <FeminineBackground variant="particles" className="opacity-30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-navy-pink bg-clip-text text-transparent float">
              Your Digital Safety, 
              <br />
              <span className="bg-gradient-feminine bg-clip-text text-transparent">Our Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              HerShield empowers women and girls in Kenya with AI-powered protection, 
              privacy controls, and emergency tools designed for your digital wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="w-full sm:w-auto bg-gradient-navy-pink hover-lift shadow-glow">
                  Start Protecting Yourself
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="soft" 
                size="xl" 
                className="w-full sm:w-auto bg-gradient-pink-yellow hover-lift shadow-glow"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 px-4 bg-background/50 relative">
        <FeminineBackground variant="pattern" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Your Safety</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed with Safety by Design principles, 
              ensuring your protection is our foundation, not an afterthought.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/80 border-border/50 hover:shadow-feminine transition-feminine hover-lift">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-feminine rounded-lg flex items-center justify-center mb-4 pulse-glow">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-navy-pink bg-clip-text text-transparent">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative">
        <FeminineBackground variant="subtle" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Women Across Kenya</h2>
            <p className="text-muted-foreground">
              Real stories from real women who trust HerShield for their digital safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-secondary/20 hover-lift shadow-feminine">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic text-base leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-feminine rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold bg-gradient-navy-pink bg-clip-text text-transparent">{testimonial.name}</p>
                      <p className="text-sm text-secondary/70">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-navy-pink relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-feminine opacity-20 shimmer"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-2xl mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4 float">
              Ready to Take Control of Your Digital Safety?
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              Join thousands of women who trust HerShield to protect their digital wellbeing. 
              Your safety journey starts here.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary" size="xl" className="bg-gradient-pink-yellow hover-lift shadow-glow text-foreground">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t border-border/40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <FeminineLogo size="medium" showText={true} />
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © 2024 HerShield. Protecting women's digital rights.
              </p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
                <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
                <a href="#" className="text-muted-foreground hover:text-primary">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chat Assistant */}
      <AIChatAssistant 
        isMinimized={!isChatOpen}
        onToggle={toggleChat}
        position="bottom-right"
      />
    </div>
  );
};

export default Index;
