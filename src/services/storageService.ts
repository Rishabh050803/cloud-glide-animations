const API_BASE = 'http://127.0.0.1:8000/storage';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

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

export const storageService = {
  async listFiles(): Promise<FileItem[]> {
    const response = await fetch(`${API_BASE}/list_files`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  },

  async exploreFolder(folderPath: string = ''): Promise<FolderItem[]> {
    const response = await fetch(`${API_BASE}/explore_folder/${encodeURIComponent(folderPath)}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to explore folder');
    }
    
    return response.json();
  },

  async uploadFile(file: File, folderPath: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder_path', folderPath);

    const response = await fetch(`${API_BASE}/upload_file`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },

  async deleteFile(fileUuid: string): Promise<any> {
    const response = await fetch(`${API_BASE}/delete_file/${fileUuid}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return response.json();
  },

  async deleteFolder(folderPath: string): Promise<any> {
    const response = await fetch(`${API_BASE}/delete_folder/${encodeURIComponent(folderPath)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete folder');
    }

    return response.json();
  },

  async downloadFile(fileUuid: string, fileName: string): Promise<void> {
    const response = await fetch(`${API_BASE}/get_file/${fileUuid}`, {
      headers: getAuthHeaders(),
    });

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
  },

  async previewFile(fileUuid: string): Promise<string> {
    const response = await fetch(`${API_BASE}/get_file/${fileUuid}?preview=true`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to preview file');
    }

    const blob = await response.blob();
    return window.URL.createObjectURL(blob);
  },

  async getStorageUsage(): Promise<StorageUsage> {
    const response = await fetch(`${API_BASE}/storage_usage`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get storage usage');
    }

    const data = await response.json();
    return data.storage_usage;
  },
};