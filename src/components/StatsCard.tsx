import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  HardDrive, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive
} from "lucide-react";

const statsData = [
  {
    icon: HardDrive,
    label: "Storage Used",
    value: "650 MB",
    total: "1 GB",
    percentage: 65,
    color: "text-cloud-blue"
  },
  {
    icon: FileText,
    label: "Documents",
    value: "127",
    total: "files",
    percentage: 45,
    color: "text-sky-blue"
  },
  {
    icon: Image,
    label: "Photos",
    value: "89",
    total: "files",
    percentage: 30,
    color: "text-ocean-blue"
  },
  {
    icon: Video,
    label: "Videos",
    value: "23",
    total: "files",
    percentage: 20,
    color: "text-cloud-blue"
  },
  {
    icon: Music,
    label: "Audio",
    value: "45",
    total: "files",
    percentage: 15,
    color: "text-sky-blue"
  },
  {
    icon: Archive,
    label: "Archives",
    value: "12",
    total: "files",
    percentage: 10,
    color: "text-ocean-blue"
  }
];

export const StatsCard = () => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Card className="bg-gradient-card p-6 shadow-medium hover-lift">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-center mb-2">Your Storage Dashboard</h3>
          <p className="text-muted-foreground text-center">
            Track your storage usage and file statistics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-background p-4 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r from-cloud-light to-background ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.total}
                    </span>
                  </p>
                </div>
              </div>
              
              {stat.label === "Storage Used" && (
                <div className="space-y-2">
                  <Progress 
                    value={stat.percentage} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {stat.percentage}% used
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Free Plan</span>
            <span className="text-cloud-blue font-medium">
              Upgrade to Pro for 10GB storage
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};