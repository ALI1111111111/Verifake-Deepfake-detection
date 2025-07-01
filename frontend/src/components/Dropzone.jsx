import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../utils/cn';

export default function Dropzone({ onFile, preview }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) onFile(acceptedFiles[0]);
  }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded p-6 text-center cursor-pointer',
        isDragActive ? 'bg-indigo-50' : ''
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="preview" className="h-32 mx-auto object-contain" />
      ) : (
        <p>Drag and drop a file here, or click to select</p>
      )}
    </div>
  );
}
