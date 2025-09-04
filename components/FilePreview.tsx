import React, { useState, useEffect } from 'react';
import { FileIcon } from './icons/FileIcon';

interface FilePreviewProps {
  file: File;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
    setError(null);
    
    let objectUrl: string | null = null;
    let fileReader: FileReader | null = null;
    
    if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else if (file.type.startsWith('text/')) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      fileReader.onerror = () => {
        setError('Could not read the text file.');
        fileReader?.abort();
      };
      fileReader.readAsText(file.slice(0, 1000)); 
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      if (fileReader) {
        fileReader.abort();
      }
    };
  }, [file]);

  const renderPreviewContent = () => {
    if (error) {
        return <p className="text-red-500 text-sm">{error}</p>;
    }
    
    if (file.type.startsWith('image/') && preview) {
      return (
        <img 
            src={preview} 
            alt="File preview" 
            className="max-h-32 w-auto object-contain rounded-md" 
        />
      );
    }
    if (file.type.startsWith('video/') && preview) {
      return (
        <video 
            src={preview} 
            controls 
            className="max-h-32 w-auto rounded-md"
        />
      );
    }
    if (file.type.startsWith('audio/') && preview) {
      return (
        <audio 
            src={preview} 
            controls 
            className="w-full"
        />
      );
    }
    if (file.type.startsWith('text/') && preview) {
      return (
        <pre className="text-left text-xs text-slate-400 bg-base-100 p-2 rounded-md max-h-32 overflow-y-auto w-full">
          <code>{preview}{file.size > 1000 ? '...' : ''}</code>
        </pre>
      );
    }
    
    return <FileIcon className="w-16 h-16 text-brand-primary" />;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 p-4 bg-base-300 rounded-lg border border-slate-700">
      <div className="flex justify-center items-center h-32 w-full">
        {renderPreviewContent()}
      </div>
      <div className="w-full text-center overflow-hidden">
        <p className="font-semibold truncate text-white">{file.name}</p>
        <p className="text-sm text-slate-400">
          {formatBytes(file.size)} &middot; .{getFileExtension(file.name)}
        </p>
      </div>
    </div>
  );
};
