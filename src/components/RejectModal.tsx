'use client';

import React, { useState } from 'react';
import { Material } from '@/types';
import { AlertCircle, X, CheckSquare, MessageSquare } from 'lucide-react';

interface RejectModalProps {
  material: Material | null;
  onClose: () => void;
  onConfirmReject: (materialId: string, reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  material,
  onClose,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState<string>('');

  if (!material) return null;

  const quickPresets = [
    'Foto atau hasil scan dokumen buram, redup, atau tidak terbaca dengan jelas. Mohon scan ulang menggunakan aplikasi pemindai dokumen.',
    'Halaman materi terpotong atau urutan halaman tidak lengkap. Mohon periksa kelengkapan halaman sebelum submit.',
    'Materi atau topik yang dibahas belum selaras dengan silabus kurikulum FMIPA S1 Sains Data UNESA.',
    'Dokumen terindikasi memuat buku teks komersial berhak cipta berbayar tanpa izin penerbit.',
  ];

  const handlePresetClick = (preset: string) => {
    setReason(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmReject(material.id, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 z-10 animate-scale-up">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tolak Pengajuan Materi</h3>
              <p className="text-[11px] text-slate-500">Berikan feedback revisi untuk kontributor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 truncate">{material.title}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Kontributor: {material.contributor_name} ({material.contributor_nim})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Pilih Catatan Template Cepat:</span>
              <span className="text-[10px] text-slate-400 font-normal">Klik untuk memilih</span>
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {quickPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left text-[11px] p-2 rounded-lg border border-slate-200 hover:border-academic-500 hover:bg-blue-50/50 text-slate-600 transition-colors flex items-start space-x-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{preset}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-academic-600" />
              Alasan Penolakan Resmi (Wajib)
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan dan instruksi perbaikan..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              Kirim Penolakan & Beri Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
