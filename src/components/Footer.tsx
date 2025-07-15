import { Cloud, Twitter, Github, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-card border-t border-border/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">CloudDrive</span>
            </div>
            <p className="text-muted-foreground">
              The future of file storage and collaboration, designed for modern teams.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-cloud-blue transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 CloudDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};