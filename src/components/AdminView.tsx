'use client';

import React, { useState, useMemo } from 'react';
import { Material, LearningGapSignal } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  AlertTriangle, 
  Eye, 
  Download, 
  CheckSquare, 
  Sparkles, 
  BellRing, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Search
} from 'lucide-react';

interface AdminViewProps {
  materials: Material[];
  learningGaps: LearningGapSignal[];
  onApprove: (materialId: string) => void;
  onOpenRejectModal: (material: Material) => void;
  onOpenReader: (material: Material) => void;
  onRequestTA: (gapTitle: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  materials,
  learningGaps,
  onApprove,
  onOpenRejectModal,
  onOpenReader,
  onRequestTA,
}) => {
  const [adminTab, setAdminTab] = useState<'queue' | 'analytics'>('queue');

  // Pending materials
  const pendingMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'pending');
  }, [materials]);

  // Approved materials
  const approvedMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'approved');
  }, [materials]);

  // Total views & downloads
  const totalViews = useMemo(() => {
    return materials.reduce((acc, m) => acc + m.views_count, 0);
  }, [materials]);

  const totalDownloads = useMemo(() => {
    return materials.reduce((acc, m) => acc + m.downloads_count, 0);
  }, [materials]);

  const approvalRate = useMemo(() => {
    const totalDecided = materials.filter((m) => m.status !== 'pending').length;
    if (totalDecided === 0) return 100;
    return Math.round((approvedMaterials.length / totalDecided) * 100);
  }, [materials, approvedMaterials]);

  // Top accessed materials sorted by downloads
  const topMaterials = useMemo(() => {
    return [...approvedMaterials]
      .sort((a, b) => b.downloads_count - a.downloads_count)
      .slice(0, 4);
  }, [approvedMaterials]);

  const maxDownloads = topMaterials[0]?.downloads_count || 1;

  return (
    <div className="space-y-5 pb-20 animate-fade-in">
      {/* Top Segmented Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setAdminTab('queue')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            adminTab === 'queue'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>Antrean Moderasi Pengajuan</span>
          {pendingMaterials.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingMaterials.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            adminTab === 'analytics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-academic-600" />
          <span>Tren Akses & Detektor Gap Belajar</span>
        </button>
      </div>

      {/* 1. REVIEW QUEUE TAB */}
      {adminTab === 'queue' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Verifikasi Catatan Mahasiswa
              </h2>
              <p className="text-xs text-slate-500">
                Pemeriksaan kepatuhan silabus FMIPA UNESA, kelengkapan rumus, dan kejernihan dokumen.
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              {pendingMaterials.length} Menunggu Moderasi
            </span>
          </div>

          {pendingMaterials.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 text-center space-y-3 shadow-xs">
              <CheckSquare className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                Semua Pengajuan Selesai Dimoderasi!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tidak ada materi baru yang menunggu verifikasi saat ini. Materi baru yang diunggah oleh mahasiswa akan langsung masuk ke antrean ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMaterials.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3"
                >
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-1.5 text-[10px] mb-1">
                        <span className="font-bold uppercase tracking-wider text-academic-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                          {item.course_code} • {item.course_name}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-semibold">
                          Bab {item.chapter_number}: {item.chapter_title}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Review
                    </span>
                  </div>

                  {/* Submission Meta & File details */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Pengunggah</span>
                      <span className="font-medium text-slate-800 mt-0.5 block">
                        {item.contributor_name} ({item.contributor_nim})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">File Terlampir</span>
                      <span className="font-medium text-slate-800 mt-0.5 block truncate">
                        {item.file_name} ({item.file_size_mb} MB)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Waktu Pengajuan</span>
                      <span className="font-medium text-slate-800 mt-0.5 block">
                        {item.created_at}
                      </span>
                    </div>
                  </div>

                  {/* Excerpt snippet */}
                  {item.preview_content && (
                    <div className="bg-amber-50/30 p-2.5 rounded-lg border border-amber-200/50 font-mono text-[11px] text-slate-700 line-clamp-2">
                      {item.preview_content}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                    <button
                      onClick={() => onOpenReader(item)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      Pratinjau Dokumen
                    </button>

                    <button
                      onClick={() => onOpenRejectModal(item)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak & Beri Alasan</span>
                    </button>

                    <button
                      onClick={() => onApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. ANALYTICS & LEARNING GAPS DETECTOR TAB */}
      {adminTab === 'analytics' && (
        <section className="space-y-6">
          {/* A. KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Vetted Materials
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {approvedMaterials.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Live di Mahasiswa
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Total Views
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {totalViews}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <Eye className="w-3 h-3" /> Frekuensi Baca
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Total Downloads
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {totalDownloads}
              </div>
              <span className="text-[10px] text-academic-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <Download className="w-3 h-3" /> Disimpan Offline
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Approval Rate
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {approvalRate}%
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                Standar Kurikulum
              </span>
            </div>
          </div>

          {/* B. Top Accessed Materials Leaderboard */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-academic-600" />
                  Materi Paling Banyak Diandalkan Mahasiswa
                </h3>
                <p className="text-[11px] text-slate-500">Peringkat berdasarkan volume unduhan dan pembaca aktif</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {topMaterials.map((mat, idx) => {
                const percentage = Math.round((mat.downloads_count / maxDownloads) * 100);
                return (
                  <div key={mat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {mat.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          ({mat.course_code})
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 shrink-0 ml-2">
                        {mat.downloads_count} dl
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-academic-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. ACCESS GAPS DETECTOR (Crucial Feature for Lecturers & Cohort Leads) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Curriculum Need Analyzer</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Access Gaps Detector (Peluang Kebutuhan Materi)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mendeteksi bab dengan <b>volume pencarian mahasiswa tinggi</b> tetapi <b>ketersediaan materi terverifikasi 0 atau sangat minim</b>.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {learningGaps.map((gap) => {
                const isCritical = gap.gap_severity === 'critical';
                return (
                  <div
                    key={gap.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-slate-700 uppercase">
                            {gap.course_code} - {gap.course_name}
                          </span>
                          <span>•</span>
                          <span>Bab {gap.chapter_number}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {gap.chapter_title}
                        </h4>
                      </div>

                      {/* Severity badge */}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : gap.gap_severity === 'moderate'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isCritical ? 'Critical Gap (0 Note)' : gap.gap_severity === 'moderate' ? 'Moderate Gap' : 'Tercukupi'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <Search className="w-3.5 h-3.5" />
                        {gap.student_search_volume} Mahasiswa Mencari
                      </span>
                      <span>•</span>
                      <span>Tersedia: {gap.materials_available} Catatan</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70">
                      💡 <b>Rekomendasi Dosen/Admin:</b> {gap.suggested_action}
                    </p>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => onRequestTA(gap.chapter_title)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-academic-600 hover:bg-academic-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Kirim Notifikasi Request ke Tim Asisten Dosen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
