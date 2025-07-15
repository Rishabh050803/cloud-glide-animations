import { Button } from "@/components/ui/button";
import { Check, Star, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Productivity",
    description: "Increase your personal productivity by 40% with organized file management and quick access.",
    stats: "40% increase"
  },
  {
    icon: Star,
    title: "Enhance Security",
    description: "Enterprise-grade security and encryption keep your files safe and always protected.",
    stats: "Bank-level security"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    quote: "This platform revolutionized how I manage my files. The storage is secure and access is lightning fast.",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Creative Director",
    company: "DesignStudio",
    quote: "The secure storage and intuitive interface have made our workflow incredibly smooth.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Team Lead",
    company: "StartupXYZ",
    quote: "Best cloud storage solution we've used. The security and reliability are outstanding.",
    rating: 5
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Benefits Section */}
        <div className="mb-20">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose
              <span className="gradient-text block">Our Platform?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits that make us the preferred choice for users worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6 group-hover:animate-glow">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-cloud-blue transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {benefit.description}
                </p>
                <div className="text-3xl font-bold text-cloud-blue">
                  {benefit.stats}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-card p-8 lg:p-12 rounded-2xl shadow-soft">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">What Our Users Say</h3>
            <p className="text-muted-foreground">
              Don't just take our word for it. Here's what our satisfied users have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-background p-6 rounded-xl shadow-soft hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Ready to Transform Your File Management?
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied users and experience the future of cloud storage today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};