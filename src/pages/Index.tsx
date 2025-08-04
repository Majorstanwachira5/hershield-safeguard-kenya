import { Shield, Heart, Users, Lock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HerShieldLogo from "@/components/HerShieldLogo";
import LanguageSelector from "@/components/LanguageSelector";
import { Link } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <HerShieldLogo size="md" />
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Button variant="ghost">Sign In</Button>
              <Button variant="hero">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Your Digital Safety, 
              <br />
              <span className="text-foreground">Our Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              HerShield empowers women and girls in Kenya with AI-powered protection, 
              privacy controls, and emergency tools designed for your digital wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Protecting Yourself
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="soft" size="xl" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Your Safety</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed with Safety by Design principles, 
              ensuring your protection is our foundation, not an afterthought.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/80 border-border/50 hover:shadow-card transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Women Across Kenya</h2>
            <p className="text-muted-foreground">
              Real stories from real women who trust HerShield for their digital safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/80">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take Control of Your Digital Safety?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of women who trust HerShield to protect their digital wellbeing. 
              Your safety journey starts here.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary" size="xl">
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
            <HerShieldLogo size="md" />
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
    </div>
  );
};

export default Index;
