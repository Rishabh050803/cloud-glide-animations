import { createApiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/api';

// Replace the hardcoded API_BASE with the imported ENDPOINTS
const API_BASE = ENDPOINTS.STORAGE.BASE;

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

export interface UploadUrlResponse {
  file_id: string;
  upload_url: string;
  resumable_url: string; // Added resumable_url property
  storage_usage: StorageUsage;
}

class StorageServiceImpl {
  private apiClient = createApiClient();

  async getStorageStatus(): Promise<{ status: string; provider: string }> {
    const response = await this.apiClient.fetchWithAuth(ENDPOINTS.STORAGE.STORAGE_STATUS);
    
    if (!response.ok) {
      throw new Error('Failed to get storage status');
    }
    
    return response.json();
  }

  async getSupportedContentTypes(): Promise<string[]> {
    const response = await this.apiClient.fetchWithAuth(ENDPOINTS.STORAGE.SUPPORTED_CONTENT_TYPES);
    
    if (!response.ok) {
      throw new Error('Failed to get supported content types');
    }
    
    return response.json();
  }

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

  // NEW MULTI-STAGE UPLOAD PROCESS - UPDATED FOR FORM DATA
  async getUploadUrl(
    fileName: string, 
    folderPath: string = '', 
    fileSize: number = 100 * 1024 * 1024,
    contentType: string = 'application/octet-stream'
  ): Promise<UploadUrlResponse> {
    // Create FormData object as the backend expects form data, not JSON
    const formData = new FormData();
    formData.append('file_name', fileName);
    formData.append('folder_path', folderPath);
    formData.append('file_size', fileSize.toString());
    formData.append('content_type', contentType);
    
    // Add the client origin to help with CORS
    formData.append('client_origin', window.location.origin);

    const response = await this.apiClient.fetchWithAuth(`${API_BASE}/upload_file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    return response.json();
  }

  async uploadToSignedUrl(uploadUrl: string, file: File): Promise<void> {
    console.log('Attempting direct upload to GCS:', uploadUrl.split('?')[0]);
    console.log('File type:', file.type, 'File size:', file.size);
    
    try {
      // Use simple PUT approach like the Python script
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        }
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('GCS upload failed:', uploadResponse.status, uploadResponse.statusText);
        console.error('Error details:', errorText);
        throw new Error(`Failed to upload to cloud storage: ${uploadResponse.status}`);
      }
      
      console.log('Successfully uploaded to GCS via direct upload');
    } catch (error) {
      console.error('Error during GCS upload:', error);
      throw error;
    }
  }

  async confirmUpload(fileId: string): Promise<{ message: string; storage_usage: StorageUsage }> {
    console.log(`Confirming upload for file ID: ${fileId}`);
    
    try {
      const response = await this.apiClient.fetchWithAuth(`${API_BASE}/confirm_upload/${fileId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Confirm upload failed:', response.status, errorText);
        throw new Error(`Failed to confirm upload: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Confirmation successful:', result);
      return result;
    } catch (error) {
      console.error('Error in confirmUpload:', error);
      throw error;
    }
  }

  // Complete file upload (handles all stages) - UPDATED WITH CONTENT TYPE
  async uploadFile(file: File, folderPath: string = ''): Promise<any> {
    console.log(`Starting upload for "${file.name}" (${file.size} bytes) to path "${folderPath}"`);
    
    try {
      // Stage 1: Get signed URL and upload details
      console.log('Stage 1: Getting signed URL...');
      const { file_id, upload_url, resumable_url } = await this.getUploadUrl(
        file.name, 
        folderPath, 
        file.size,
        file.type || 'application/octet-stream'
      );
      console.log('Received file_id:', file_id);
      
      // Stage 2: Upload to GCS directly
      console.log('Stage 2: Uploading to GCS...');
      
      // For small files, use direct upload
      if (file.size < 10 * 1024 * 1024) { // Less than 10MB
        await this.uploadToSignedUrl(upload_url, file);
      } else {
        // For larger files, use resumable upload
        await this.uploadWithResumable(resumable_url, file);
      }
      
      console.log('GCS upload successful');
      
      // Stage 3: Confirm upload
      console.log('Stage 3: Confirming upload...');
      const result = await this.confirmUpload(file_id);
      console.log('Upload confirmed successfully');
      
      return result;
    } catch (error) {
      console.error('Upload process failed:', error);
      throw error;
    }
  }

  // Add a separate method for resumable uploads
  async uploadWithResumable(resumableUrl: string, file: File): Promise<void> {
    console.log('Attempting resumable upload to GCS:', resumableUrl.split('?')[0]);
    
    try {
      // Step 1: Initiate resumable upload session
      const sessionResponse = await fetch(resumableUrl, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-goog-resumable': 'start',
          'Origin': window.location.origin
        }
      });
      
      if (!sessionResponse.ok) {
        throw new Error(`Failed to initiate resumable upload: ${sessionResponse.status}`);
      }
      
      // Step 2: Get the upload URL from the Location header
      const uploadLocation = sessionResponse.headers.get('Location');
      
      if (!uploadLocation) {
        throw new Error('No upload location returned from GCS');
      }
      
      console.log('Got resumable upload URL:', uploadLocation.split('?')[0]);
      
      // Step 3: Upload the file to the resumable upload URL
      const uploadResponse = await fetch(uploadLocation, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        }
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to cloud storage: ${uploadResponse.status}`);
      }
      
      console.log('Successfully uploaded to GCS via resumable upload');
    } catch (error) {
      console.error('Error during resumable GCS upload:', error);
      throw error;
    }
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

  // Now uses signed URL from backend
  async downloadFile(fileUuid: string, fileName: string): Promise<void> {
    // Get signed URL for the file
    const signedUrl = await this.getFileSignedUrl(fileUuid, false);
    
    // Use the signed URL to download the file
    const response = await fetch(signedUrl);
    
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

  // Get signed URL for file access
  async getFileSignedUrl(fileUuid: string, preview: boolean = false): Promise<string> {
    const response = await this.apiClient.fetchWithAuth(
      `${API_BASE}/get_file/${fileUuid}?preview=${preview}`
    );

    if (!response.ok) {
      throw new Error('Failed to get file access URL');
    }

    return response.json();
  }

  // Updated to use signed URL
  async previewFile(fileUuid: string): Promise<string> {
    const signedUrl = await this.getFileSignedUrl(fileUuid, true);
    return signedUrl; // Return the signed URL directly - no need for blob conversion
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
      console.log(`Creating folder "${folderName}" in path "${currentPath}"`);
      
      // Create a tiny empty file as a placeholder with text/plain content type
      const dummyFile = new File([''], '.folder_placeholder', { type: 'text/plain' });
      
      // Determine the path where to create the folder
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      
      // Stage 1: Get signed URL
      const { file_id, upload_url } = await this.getUploadUrl(
        '.folder_placeholder', 
        folderPath, 
        dummyFile.size,
        'text/plain'
      );
      
      console.log('Got upload URL for folder placeholder:', upload_url.split('?')[0]);
      
      // Stage 2: Upload to GCS directly
      try {
        await this.uploadToSignedUrl(upload_url, dummyFile);
      } catch (uploadError) {
        console.error('Failed to upload folder placeholder to GCS:', uploadError);
        // Even if GCS upload fails, try to confirm anyway since folder entries
        // in DB are what matter for the virtual folder structure
      }
      
      // Stage 3: Confirm upload
      try {
        const result = await this.confirmUpload(file_id);
        console.log('Folder created successfully:', folderPath);
        return result;
      } catch (confirmError) {
        console.error('Failed to confirm folder creation:', confirmError);
        throw new Error(`Folder may be partially created. Please refresh and try again.`);
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      
      // Check if folder exists anyway (it might have been created despite errors)
      try {
        const exists = await this.checkPathExists(currentPath ? `${currentPath}/${folderName}` : folderName);
        if (exists) {
          console.log('Folder exists despite error, returning success');
          return { message: "Folder exists", created: false };
        }
      } catch (checkError) {
        // Ignore check errors
      }
      
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