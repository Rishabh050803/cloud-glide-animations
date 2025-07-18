export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://35.244.2.241:8000';

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    BASE: `${API_BASE_URL}/auth`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    GOOGLE_LOGIN: `${API_BASE_URL}/auth/login/google`,
    ME: `${API_BASE_URL}/auth/me`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  
  // Storage endpoints
  STORAGE: {
    BASE: `${API_BASE_URL}/storage`,
    HEALTH: `${API_BASE_URL}/storage/health`,
    STORAGE_STATUS: `${API_BASE_URL}/storage/storage-status`,
    SUPPORTED_CONTENT_TYPES: `${API_BASE_URL}/storage/supported_content_types`,
    LIST_FILES: `${API_BASE_URL}/storage/list_files`,
    GET_FILE: `${API_BASE_URL}/storage/get_file`,
    UPLOAD_FILE: `${API_BASE_URL}/storage/upload_file`,
    CONFIRM_UPLOAD: `${API_BASE_URL}/storage/confirm_upload`,
    DELETE_FILE: `${API_BASE_URL}/storage/delete_file`,
    EXPLORE_FOLDER: `${API_BASE_URL}/storage/explore_folder`,
    DELETE_FOLDER: `${API_BASE_URL}/storage/delete_folder`,
    STORAGE_USAGE: `${API_BASE_URL}/storage/storage_usage`,
  }
};