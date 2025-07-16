import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { StatsCard } from "./StatsCard";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-cloud-blue rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-sky-blue rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-ocean-blue rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Files,
                <span className="gradient-text block">Anywhere</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Store, sync, and share your files with the power of the cloud. 
                Access your documents from anywhere, collaborate in real-time, 
                and never lose your important data again.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-cloud-dark">
                <Cloud className="w-4 h-4" />
                <span>1GB Free • 10GB Pro</span>
              </div>
              <div className="flex items-center gap-2 text-cloud-dark">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-cloud-dark">
                <Zap className="w-4 h-4" />
                <span>Lightning Fast</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="cloud" 
                size="lg"
                className="text-lg px-8 py-6 h-auto"
                asChild
              >
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-border/20">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by over 10,000+ users worldwide
              </p>
              <div className="flex items-center gap-6">
                <div className="text-2xl font-bold text-cloud-blue">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="text-2xl font-bold text-cloud-blue">650MB</div>
                <div className="text-sm text-muted-foreground">Avg Usage</div>
              </div>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Cloud Drive Dashboard"
                className="w-full h-auto rounded-2xl shadow-strong hover-lift"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full animate-glow opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-sky-blue rounded-full animate-float opacity-30"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="mt-20">
          <StatsCard />
        </div>
      </div>
    </section>
  );
};