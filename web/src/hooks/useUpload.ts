import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../api/upload';

export const useUpload = () => {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) => {
      return uploadApi.uploadFile(file, onProgress);
    },
  });
};