import apiClient from './axios';

export const uploadApi = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string }>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },
};