import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";
import { CertificateUploadProps, UploadState, WalrusResponse } from "../../types";
import { PUBLISHER } from "../../constants";

const CertificateUpload: React.FC<CertificateUploadProps> = ({ onUpload, currentImage }) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    progress: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const [blobId, setBlobId] = useState<string>("");

  const EPOCHS = 10;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadState(prev => ({ ...prev, error: "File size must be less than 10 MiB" }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setUploadState(prev => ({ ...prev, error: "Please select an image file" }));
        return;
      }

      setSelectedFile(file);
      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto upload to Walrus
      try {
        const response = await fetch(`${PUBLISHER}/v1/blobs?epochs=${EPOCHS}`, {
          method: "PUT",
          body: file
        });
        console.log("response: ", response);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload file: ${errorText}`);
        }

        const info: WalrusResponse = await response.json();
        console.log("info response: ", info);

        // Set blob ID for display - correct path based on the response structure
        const blobIdValue = info.newlyCreated?.blobObject?.blobId || "";
        setBlobId(blobIdValue);

        console.log("blobID: ", blobIdValue);

        onUpload({
          info,
          mediaType: file.type
        });

        // Reset form
        setSelectedFile(null);
        const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (error) {
        console.error('Upload error:', error);
        setUploadState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to upload file'
        }));
      } finally {
        setUploadState(prev => ({ ...prev, isUploading: false }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Certificate preview"
              className="w-32 h-24 object-cover rounded-md border-2 border-gray-600"
            />
          ) : (
            <div className="w-32 h-24 bg-gray-700 rounded-md border-2 border-gray-600 flex items-center justify-center">
              <span className="text-gray-400 text-xs text-center">No image</span>
            </div>
          )}
          {uploadState.isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <label htmlFor="certificate-file" className="block text-sm font-medium text-gray-300 mb-1">
                Certificate Image (Max 10 MiB)
              </label>
              <input
                id="certificate-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadState.isUploading}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {selectedFile && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
                {uploadState.isUploading && (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-blue-400">Uploading to Walrus...</span>
                  </div>
                )}
              </div>
            )}

            {uploadState.error && (
              <div className="p-3 bg-red-900/50 border border-red-600 rounded-md">
                <p className="text-sm text-red-300">{uploadState.error}</p>
              </div>
            )}

            {blobId && (
              <div className="p-3 bg-green-900/50 border border-green-600 rounded-md">
                <p className="text-sm text-green-300 mb-2">✓ Certificate image uploaded successfully!</p>
                <div className="text-xs text-gray-300">
                  <p className="font-mono break-all">Blob ID: {blobId}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUpload;