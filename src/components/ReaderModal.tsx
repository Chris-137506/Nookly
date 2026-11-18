'use client';

import React, { useState } from 'react';
import { Material } from '@/types';
import { 
  X, 
  Download, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  User, 
  Share2, 
  Check,
  FileCheck
} from 'lucide-react';

interface ReaderModalProps {
  material: Material | null;
  onClose: () => void;
  onDownload: (material: Material) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  material,
  onClose,
  onDownload,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!material) return null;

  const handleDownloadClick = () => {
    setDownloading(true);
    onDownload(material);
    setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  const handleShareClick = () => {
    setCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Nookly UNESA: ${material.title} (${material.course_name} - ${material.chapter_title})`
      );
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Sheet Container */}
      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-slide-up">
        {/* Top Handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-academic-700 border border-blue-200/50">
                {material.course_code} • {material.course_name}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                Bab {material.chapter_number}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                <FileCheck className="w-3 h-3" /> Vetted Note
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {material.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {material.chapter_title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Kontributor</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="font-medium text-slate-800 truncate">{material.contributor_name}</span>
                {material.is_contributor_verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Format & Size</span>
              <span className="font-medium text-slate-800 mt-0.5 block uppercase">
                {material.file_type} • {material.file_size_mb} MB
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Statistik Akses</span>
              <div className="flex items-center space-x-2 mt-0.5 text-slate-700 font-medium">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3 text-slate-400" /> {material.views_count}
                </span>
                <span className="flex items-center gap-0.5">
                  <Download className="w-3 h-3 text-slate-400" /> {material.downloads_count}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tanggal Vetted</span>
              <span className="font-medium text-slate-800 mt-0.5 block">
                {material.approved_at || material.created_at}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ikhtisar Dokumen
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              {material.description}
            </p>
          </div>

          {/* Interactive Document Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-academic-600" />
                Pratinjau Halaman Sampel
              </h4>
              <span className="text-[11px] text-slate-400">Halaman 1 dari 6</span>
            </div>

            <div className="bg-[#FAF9F5] border border-amber-200/60 rounded-xl p-4 font-mono text-xs text-slate-800 leading-relaxed shadow-inner overflow-x-auto whitespace-pre-wrap">
              {material.preview_content || 'Memuat pratinjau teks materi perkuliahan FMIPA UNESA...'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex items-center gap-2.5">
          <button
            onClick={handleShareClick}
            className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Bagikan</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadClick}
            disabled={downloading}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-academic-600 hover:bg-academic-700 active:scale-98 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 disabled:opacity-75"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span>
              {downloading
                ? 'Mengunduh & Mencatat Akses...'
                : `Download Resource (${material.file_type.toUpperCase()} • ${material.file_size_mb} MB)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
