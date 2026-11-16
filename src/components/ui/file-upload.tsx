"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as LucideImage } from "lucide-react";

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  hint?: string;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept = "image/*,.pdf,.png,.jpg,.jpeg",
  maxSizeMB,
  multiple = false,
  hint,
  onFilesSelected,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError(null);
    let fileArray = Array.from(newFiles);

    if (maxSizeMB) {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const validFiles = fileArray.filter((file) => file.size <= maxBytes);
      if (validFiles.length < fileArray.length) {
        setError(`Tệp vượt quá giới hạn tối đa ${maxSizeMB}MB`);
      }
      fileArray = validFiles;
    }

    const updated = multiple ? [...files, ...fileArray] : fileArray;
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <LucideImage className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-2.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#27252d]">
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all duration-150",
          isDragging
            ? "border-[#6551a4] bg-[#ece5f5]/30"
            : "border-[#d4c3e7] bg-[#fbfaf8] hover:border-[#6551a4] hover:bg-white"
        )}
      >
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg border transition-colors",
            isDragging
              ? "bg-[#6551a4] text-white border-transparent"
              : "bg-white border-[#e5e2de] text-[#6551a4]"
          )}
        >
          <Upload className="h-5 w-5" />
        </div>
        <div className="text-center">
          <p className="text-sm text-[#27252d]">
            Kéo thả tệp vào đây hoặc{" "}
            <span className="text-[#6551a4] font-semibold underline underline-offset-2">chọn tệp</span>
          </p>
          {(hint || maxSizeMB) && (
            <p className="text-xs text-[#5e5866] mt-1">
              {hint ?? `Dung lượng tối đa ${maxSizeMB}MB`}
            </p>
          )}
          {error && <p className="text-xs text-[#a64533] mt-1 font-medium">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 rounded-lg bg-white border border-[#e5e2de] px-3.5 py-2.5 text-sm shadow-sm"
            >
              <span className="text-[#6551a4]">{getFileIcon(file)}</span>
              <span className="flex-1 truncate text-[#27252d] font-medium">
                {file.name}
              </span>
              <span className="text-xs font-mono text-[#5e5866]">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="rounded p-1 text-[#5e5866] hover:text-[#a64533] hover:bg-[#fceeea] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
