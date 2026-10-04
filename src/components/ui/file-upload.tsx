"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as LucideImage } from "lucide-react";

export interface FileUploadProps {
  /** Label text */
  label?: string;
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Whether multiple files can be uploaded */
  multiple?: boolean;
  /** Hint text below the drop zone */
  hint?: string;
  /** Callback with selected files */
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
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#E3E2E5]">
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
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all duration-150",
          isDragging
            ? "border-[#5E6AD2]/60 bg-[#5E6AD2]/5"
            : "border-white/[0.12] bg-[#0F1115] hover:border-white/[0.2] hover:bg-[#14171D]"
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
            isDragging
              ? "bg-[#5E6AD2]/10 border-[#5E6AD2]/30 text-[#5E6AD2]"
              : "bg-white/[0.04] border-white/[0.08] text-[#9BA1B0]"
          )}
        >
          <Upload className="h-5 w-5" />
        </div>
        <div className="text-center">
          <p className="text-sm text-[#E3E2E5]">
            Kéo & thả tệp vào đây hoặc{" "}
            <span className="text-[#5E6AD2] font-medium">chọn tệp</span>
          </p>
          {(hint || maxSizeMB) && (
            <p className="text-xs text-[#5D6474] mt-1">
              {hint ?? `Dung lượng tối đa ${maxSizeMB}MB`}
            </p>
          )}
          {error && <p className="text-xs text-[#FF5C5C] mt-1">{error}</p>}
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
        <div className="space-y-1.5">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-2.5 rounded-lg bg-[#14171D] border border-white/[0.08] px-3 py-2 text-sm animate-fade-in"
            >
              <span className="text-[#9BA1B0]">{getFileIcon(file)}</span>
              <span className="flex-1 truncate text-[#E3E2E5]">
                {file.name}
              </span>
              <span className="text-xs font-mono text-[#5D6474]">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="rounded p-0.5 text-[#9BA1B0] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
