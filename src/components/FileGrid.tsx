import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreVertical, Folder, FileText, Image, Video, Music, Archive, Eye, Download, Trash2, FolderOpen } from 'lucide-react';
import { FolderItem, storageService } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileGridProps {
  items: FolderItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ items, currentPath, onNavigate, onRefresh }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>('');
  const [itemToDelete, setItemToDelete] = useState<FolderItem | null>(null);
  const { toast } = useToast();

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return Image;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
        return Video;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return Music;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
        return Archive;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDoubleClick = async (item: FolderItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      onNavigate(newPath);
    } else if (item.uuid) {
      await handlePreview(item.uuid, item.name);
    }
  };

  const handlePreview = async (fileUuid: string, fileName: string) => {
    try {
      const url = await storageService.previewFile(fileUuid);
      setPreviewUrl(url);
      setPreviewFileName(fileName);
    } catch (error) {
      toast({
        title: "Preview failed",
        description: "Could not preview this file type.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileUuid: string, fileName: string) => {
    try {
      await storageService.downloadFile(fileUuid, fileName);
      toast({
        title: "Download started",
        description: `${fileName} is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'folder') {
        await storageService.deleteFolder(itemToDelete.path);
        toast({
          title: "Folder deleted",
          description: `${itemToDelete.name} and all its contents have been deleted.`,
        });
      } else if (itemToDelete.uuid) {
        await storageService.deleteFile(itemToDelete.uuid);
        toast({
          title: "File deleted",
          description: `${itemToDelete.name} has been deleted.`,
        });
      }
      onRefresh();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the item.",
        variant: "destructive",
      });
    } finally {
      setItemToDelete(null);
    }
  };
  
  const handleDelete = (item: FolderItem) => {
    setItemToDelete(item);
  };
  
  const handleOpenFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    onNavigate(newPath);
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewFileName('');
  };

  // Filter out the .folder_placeholder files before displaying
  const visibleItems = items.filter(item => 
    !(item.type === 'file' && item.name === '.folder_placeholder')
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {visibleItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">This folder is empty</h3>
            <p className="text-muted-foreground mb-4">
              Upload files or create a new folder to get started
            </p>
          </div>
        ) : (
          visibleItems.map((item, index) => {
            const IconComponent = item.type === 'folder' ? Folder : getFileIcon(item.name);
            
            return (
              <Card 
                key={index}
                className="group hover:shadow-medium transition-all duration-200 cursor-pointer bg-background hover:bg-muted/50"
                onDoubleClick={() => handleDoubleClick(item)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${item.type === 'folder' ? 'bg-sky-blue/20 text-sky-blue' : 'bg-cloud-blue/20 text-cloud-blue'}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border border-border">
                        {item.type === 'folder' ? (
                          <>
                            <DropdownMenuItem onClick={() => handleOpenFolder(item.name)}>
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => item.uuid && handlePreview(item.uuid, item.name)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => item.uuid && handleDownload(item.uuid, item.name)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm truncate mb-1">{item.name}</p>
                    {item.type === 'file' && item.size && (
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(item.size)}
                      </p>
                    )}
                    {item.created_at && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={!!previewUrl} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewFileName}</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="flex justify-center">
              {previewFileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
                <img src={previewUrl} alt={previewFileName} className="max-w-full max-h-[70vh] object-contain" />
              ) : previewFileName.match(/\.(mp4|avi|mov|wmv|flv)$/i) ? (
                <video controls className="max-w-full max-h-[70vh]">
                  <source src={previewUrl} />
                  Your browser does not support the video tag.
                </video>
              ) : previewFileName.match(/\.(mp3|wav|flac|aac)$/i) ? (
                <audio controls className="w-full">
                  <source src={previewUrl} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <iframe src={previewUrl} className="w-full h-[70vh]" title={previewFileName} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'folder' 
                ? `This will delete "${itemToDelete?.name}" and all its contents. This action cannot be undone.`
                : `This will delete "${itemToDelete?.name}". This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};