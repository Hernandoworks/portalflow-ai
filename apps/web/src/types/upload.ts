export interface UploadResponse {
  success: boolean;
  file?: {
    id?: string;
    name?: string;
    webViewLink?: string;
  };
  error?: string;
}
