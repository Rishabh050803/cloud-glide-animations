import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileGrid } from '@/components/FileGrid';
import { storageService, FolderItem, StorageUsage } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  LogOut, 
  Home, 
  ChevronRight, 
  CloudDrizzle,
  Search,
  LayoutGrid,
  LayoutList,
  Plus,
  FolderPlus
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<FolderItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFolderContents();
    loadStorageUsage();
  }, [currentPath]);

  const loadFolderContents = async () => {
    try {
      setLoading(true);
      const folderItems = await storageService.exploreFolder(currentPath);
      setItems(folderItems);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load folder contents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStorageUsage = async () => {
    try {
      const usage = await storageService.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to load storage usage:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        await storageService.uploadFile(file, currentPath);
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded.`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}.`,
          variant: "destructive",
        });
      }
    }

    loadFolderContents();
    loadStorageUsage();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
  };

  const getBreadcrumbs = () => {
    if (!currentPath) return [];
    return currentPath.split('/');
  };

  const navigateToBreadcrumb = (index: number) => {
    const breadcrumbs = getBreadcrumbs();
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CloudDrizzle className="w-12 h-12 text-cloud-blue mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CloudDrizzle className="w-8 h-8 text-cloud-blue" />
                <h1 className="text-xl font-bold">CloudVault</h1>
              </div>
              
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPath('')}
                  className="hover:bg-muted"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
                {getBreadcrumbs().map((folder, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToBreadcrumb(index)}
                      className="hover:bg-muted"
                    >
                      {folder}
                    </Button>
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.first_name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </CardContent>
              </Card>

              {/* Storage Usage */}
              {storageUsage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{storageUsage.used_mb.toFixed(1)} MB used</span>
                        <span>{storageUsage.total_mb} MB total</span>
                      </div>
                      <Progress value={storageUsage.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {storageUsage.percentage.toFixed(1)}% of storage used
                      </p>
                    </div>
                    {storageUsage.percentage > 80 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        Storage is getting full. Consider upgrading your plan.
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* File Grid */}
            {filteredItems.length > 0 ? (
              <FileGrid
                items={filteredItems}
                currentPath={currentPath}
                onNavigate={navigateToPath}
                onRefresh={loadFolderContents}
              />
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <CloudDrizzle className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? 'No files found' : 'This folder is empty'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? `No files or folders match "${searchTerm}"`
                        : 'Upload your first file to get started'
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}