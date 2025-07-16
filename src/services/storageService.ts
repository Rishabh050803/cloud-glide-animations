import { createApiClient } from '@/utils/apiClient';

const API_BASE = 'http://127.0.0.1:8000/storage';

export interface FileItem {
  uuid: string;
  name: string;
  folder_path: string;
  size: number;
  created_at: string;
}

export interface FolderItem {
  type: 'folder' | 'file';
  name: string;
  path: string;
  uuid?: string;
  size?: number;
  created_at?: string;
}

export interface StorageUsage {
  used_mb: number;
  total_mb: number;
  percentage: number;
}

class StorageServiceImpl {
  private apiClient = createApiClient();

  async listFiles(): Promise<FileItem[]> {
    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/list_files`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  }

  async exploreFolder(folderPath: string = ''): Promise<FolderItem[]> {
    const response = await this.apiClient.fetchWithAuth(
      `${API_BASE}/explore_folder/${encodeURIComponent(folderPath)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to explore folder');
    }
    
    return response.json();
  }

  async uploadFile(file: File, folderPath: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder_path', folderPath);

    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/upload_file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }

  async deleteFile(fileUuid: string): Promise<any> {
    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/delete_file/${fileUuid}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return response.json();
  }

  async deleteFolder(folderPath: string): Promise<any> {
    const response = await this.apiClient.fetchWithAuth(
      `${API_BASE}/delete_folder/${encodeURIComponent(folderPath)}`, 
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Failed to delete folder');
    }

    return response.json();
  }

  async downloadFile(fileUuid: string, fileName: string): Promise<void> {
    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/get_file/${fileUuid}`);

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async previewFile(fileUuid: string): Promise<string> {
    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/get_file/${fileUuid}?preview=true`);

    if (!response.ok) {
      throw new Error('Failed to preview file');
    }

    const blob = await response.blob();
    return window.URL.createObjectURL(blob);
  }

  async getStorageUsage(): Promise<StorageUsage> {
    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/storage_usage`);

    if (!response.ok) {
      throw new Error('Failed to get storage usage');
    }

    const data = await response.json();
    return data.storage_usage;
  }

  async createFolder(folderName: string, currentPath: string = ''): Promise<any> {
    try {
      // Create a tiny empty file as a placeholder
      const dummyFile = new File([''], '.folder_placeholder', { type: 'text/plain' });
      
      // Determine the path where to create the folder
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      
      // Upload the dummy file to the new folder path
      return this.uploadFile(dummyFile, folderPath);
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw new Error(`Failed to create folder: ${folderName}`);
    }
  }

  // Add a utility method to check if a path exists
  async checkPathExists(path: string): Promise<boolean> {
    try {
      const items = await this.exploreFolder(path);
      return true; // If we got items or empty array, the path exists
    } catch (error) {
      return false; // If we got an error, the path doesn't exist
    }
  }
}

// Export a singleton instance
export const storageService = new StorageServiceImpl();