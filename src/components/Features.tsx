import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Shield, 
  Zap,
  FileText,
  Search,
  Share2
} from "lucide-react";
import featuresImage from "@/assets/features-bg.jpg";

const features = [
  {
    icon: Cloud,
    title: "Secure Storage",
    description: "Store your files securely with 1GB free storage or upgrade to 10GB with Pro plan.",
    color: "text-cloud-blue"
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Bank-level encryption and security measures to keep your files safe and protected.",
    color: "text-sky-blue"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Upload and download files at blazing speeds with our optimized cloud infrastructure.",
    color: "text-ocean-blue"
  },
  {
    icon: FileText,
    title: "File Preview",
    description: "Preview documents, images, and videos without downloading them first.",
    color: "text-cloud-blue"
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your files instantly with powerful search capabilities and smart filtering.",
    color: "text-sky-blue"
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share files and folders with custom permissions and expiration dates.",
    color: "text-ocean-blue"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-gradient-sky">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="gradient-text block">Modern Teams</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to store, organize, and collaborate on your files 
            in one secure, easy-to-use platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-gradient-card p-6 rounded-xl shadow-soft hover-lift hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r from-cloud-light to-background ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-cloud-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-card p-8 rounded-2xl shadow-medium max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience the Future of File Storage?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust our platform for their file storage needs.
            </p>
            <Button variant="gradient" size="lg" className="text-lg px-8 py-6 h-auto">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};