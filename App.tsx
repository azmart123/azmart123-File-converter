import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ConversionState } from './types';
import { CONVERSION_FORMATS } from './constants';
import { FileUploader } from './components/FileUploader';
import { FormatSelector } from './components/FormatSelector';
import { ProgressBar } from './components/ProgressBar';
import { CheckIcon } from './components/icons/CheckIcon';
import { FilePreview } from './components/FilePreview';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUbJHWXejKfa39jtaiB9O6Z2kJ9bh0d40",
  authDomain: "file-converter-26210.firebaseapp.com",
  databaseURL: "https://file-converter-26210-default-rtdb.firebaseio.com",
  projectId: "file-converter-26210",
  storageBucket: "file-converter-26210.firebasestorage.app",
  messagingSenderId: "607398257213",
  appId: "1:607398257213:web:c53fbeb9fda4c628180054"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [toFormat, setToFormat] = useState('');
  const [conversionState, setConversionState] = useState<ConversionState>(ConversionState.IDLE);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
  }, []);

  const handleConvert = () => {
    if (!file || !toFormat) return;

    setConversionState(ConversionState.CONVERTING);
    setProgress(0);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(currentProgress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setConversionState(ConversionState.ERROR);
      },
      () => {
        // Using a short timeout to simulate a backend conversion process
        setTimeout(() => {
          setConversionState(ConversionState.DONE);
          const dummyContent = `This is a simulated converted file.\nOriginal: ${file.name}\nConverted to: .${toFormat}`;
          const blob = new Blob([dummyContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
        }, 1500);
      }
    );
  };

  const handleReset = () => {
    setFile(null);
    setToFormat('');
    setProgress(0);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setConversionState(ConversionState.IDLE);
  };
  
  const renderContent = () => {
    switch (conversionState) {
      case ConversionState.IDLE:
        return file ? null : <FileUploader onFileSelect={handleFileSelect} />;
      case ConversionState.CONVERTING:
        return (
          <div className="w-full max-w-lg text-center">
            <h3 className="text-xl font-semibold mb-2">{progress < 100 ? 'Uploading...' : 'Finalizing conversion...'}</h3>
            <p className="text-slate-400 mb-4">Please wait while we process your file.</p>
            <ProgressBar progress={progress} />
             <p className="text-lg font-mono mt-4 text-brand-primary">{Math.round(progress)}%</p>
          </div>
        );
      case ConversionState.DONE:
        return (
          <div className="w-full max-w-lg text-center flex flex-col items-center">
            <CheckIcon className="w-20 h-20 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Conversion Successful!</h3>
            <p className="text-slate-300 mb-6">Your file is ready for download.</p>
            <a
              href={downloadUrl!}
              download={`${file?.name.split('.')[0]}-converted.${toFormat}`}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-4 shadow-lg shadow-brand-primary/20"
            >
              Download File
            </a>
            <button
              onClick={handleReset}
              className="w-full bg-base-300 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Convert Another File
            </button>
          </div>
        );
      case ConversionState.ERROR:
        return (
           <div className="w-full max-w-lg text-center flex flex-col items-center">
            <ErrorIcon className="w-20 h-20 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-red-500 mb-2">Conversion Failed</h3>
            <p className="text-slate-300 mb-6">An error occurred during the file upload. Please try again.</p>
            <button
              onClick={handleReset}
              className="w-full bg-base-300 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition-all"
            >
              Convert Another File
            </button>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">File Converter <span className="text-brand-primary">Pro</span></h1>
        <p className="text-slate-400 mt-2">Fast, simple, and (simulated) powerful.</p>
      </header>

      <main className="w-full flex items-center justify-center">
        <div className="w-full max-w-2xl bg-base-200 rounded-2xl shadow-2xl p-6 md:p-10 transition-all duration-500 min-h-[300px] flex items-center justify-center">
          {renderContent()}

          {file && (conversionState === ConversionState.IDLE || conversionState === ConversionState.ERROR) && (
            <div className="w-full max-w-lg flex flex-col space-y-6 animate-fade-in">
              <FilePreview file={file} />

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <span className="text-slate-400 font-medium hidden md:block">Convert to</span>
                <FormatSelector
                  id="to-format"
                  value={toFormat}
                  onChange={setToFormat}
                  options={CONVERSION_FORMATS}
                />
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                 <button
                    onClick={handleConvert}
                    disabled={!toFormat}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 shadow-lg shadow-brand-primary/20"
                  >
                    Convert Now
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full text-slate-400 hover:text-white hover:bg-base-300 text-sm py-2 px-4 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center mt-10 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} File Converter Pro. A demonstration project.</p>
      </footer>
    </div>
  );
};

export default App;
