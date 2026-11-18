'use client';

import React, { useState } from 'react';
import { Course, Chapter, Material, MaterialCategory, MaterialStatus } from '@/types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X, 
  FileCheck, 
  Info, 
  ChevronRight,
  Eye,
  Download
} from 'lucide-react';

interface ContributorViewProps {
  courses: Course[];
  chapters: Chapter[];
  myMaterials: Material[];
  initialCourseId?: string;
  initialChapterId?: string;
  onSubmitMaterial: (data: {
    courseId: string;
    chapterId: string;
    title: string;
    description: string;
    category: Exclude<MaterialCategory, 'all'>;
    fileName: string;
    fileSizeMb: number;
    fileType: 'pdf' | 'pptx' | 'docx' | 'zip';
    suggestedChapterName?: string;
  }) => void;
  onOpenReader: (material: Material) => void;
}

export const ContributorView: React.FC<ContributorViewProps> = ({
  courses,
  chapters,
  myMaterials,
  initialCourseId,
  initialChapterId,
  onSubmitMaterial,
  onOpenReader,
}) => {
  const [subTab, setSubTab] = useState<'upload' | 'submissions'>('upload');
  
  // Form State
  const [courseId, setCourseId] = useState(initialCourseId || courses[0]?.id || '');
  const [chapterId, setChapterId] = useState(initialChapterId || '');
  const [isSuggestingChapter, setIsSuggestingChapter] = useState(false);
  const [suggestedChapter, setSuggestedChapter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Exclude<MaterialCategory, 'all'>>('summary_notes');
  const [stagedFile, setStagedFile] = useState<{
    name: string;
    sizeMb: number;
    type: 'pdf' | 'pptx' | 'docx' | 'zip';
  } | null>({
    name: 'kalkulus-optimasi-catatan.pdf',
    sizeMb: 3.4,
    type: 'pdf',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Filter in My Submissions
  const [statusFilter, setStatusFilter] = useState<'all' | MaterialStatus>('all');

  const filteredChapters = chapters.filter((c) => c.course_id === courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || (!chapterId && !suggestedChapter) || !title.trim() || !stagedFile) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitMaterial({
        courseId,
        chapterId: isSuggestingChapter ? '' : chapterId,
        suggestedChapterName: isSuggestingChapter ? suggestedChapter : undefined,
        title: title.trim(),
        description: description.trim() || 'Catatan kuliah terverifikasi mahasiswa FMIPA UNESA.',
        category,
        fileName: stagedFile.name,
        fileSizeMb: stagedFile.sizeMb,
        fileType: stagedFile.type,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setIsSuggestingChapter(false);
      setSuggestedChapter('');
      setIsSubmitting(false);
      setSubTab('submissions');
    }, 600);
  };

  const handleSimulateFileUpload = (type: 'pdf' | 'pptx' | 'docx') => {
    const mockNames = {
      pdf: 'ringkasan-rumus-uts-sainsdata.pdf',
      pptx: 'slide-presentasi-praktikum.pptx',
      docx: 'latihan-soal-mandiri.docx',
    };
    setStagedFile({
      name: mockNames[type],
      sizeMb: parseFloat((Math.random() * 4 + 1.2).toFixed(1)),
      type,
    });
  };

  const filteredSubmissions = myMaterials.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-5 pb-20 animate-fade-in">
      {/* Segmented Top Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setSubTab('upload')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            subTab === 'upload'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-academic-600" />
          <span>Unggah Materi Baru</span>
        </button>

        <button
          onClick={() => setSubTab('submissions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            subTab === 'submissions'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Status Pengajuan Saya</span>
          <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {myMaterials.length}
          </span>
        </button>
      </div>

      {/* TAB 1: STREAMLINED UPLOAD FORM */}
      {subTab === 'upload' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Formulir Kontribusi Catatan Belajar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Materi yang diajukan akan melalui moderasi asisten dosen/admin sebelum tayang di perpustakaan publik.
            </p>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Mata Kuliah
            </label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setChapterId('');
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-academic-500/20 text-slate-900 font-medium"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} ({c.sks} SKS)
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Selection or Suggest New */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Pilih Bab Kuliah</label>
              <button
                type="button"
                onClick={() => setIsSuggestingChapter(!isSuggestingChapter)}
                className="text-[11px] text-academic-600 hover:underline font-semibold"
              >
                {isSuggestingChapter ? 'Pilih dari Bab Terdaftar' : '+ Usulkan Bab Baru'}
              </button>
            </div>

            {isSuggestingChapter ? (
              <input
                type="text"
                value={suggestedChapter}
                onChange={(e) => setSuggestedChapter(e.target.value)}
                placeholder="Contoh: Bab 5: Transformasi Fourier Diskrit"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-academic-500/20 text-slate-900"
              />
            ) : (
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-academic-500/20 text-slate-900 font-medium"
              >
                <option value="">-- Pilih Bab Materi --</option>
                {filteredChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Bab {ch.chapter_number}: {ch.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Materi Catatan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rangkuman Cepat Aturan Rantai & Uji Turunan Kedua"
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-academic-500/20 text-slate-900"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Dokumen
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'summary_notes', label: 'Summary Notes' },
                { id: 'lecture_slides', label: 'Lecture Slides' },
                { id: 'practice_questions', label: 'Practice Questions' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`p-2 rounded-lg border text-center font-medium transition-all ${
                    category === cat.id
                      ? 'border-academic-600 bg-blue-50/60 text-academic-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Singkat & Poin Penting
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan topik yang tercakup, latihan soal, atau rumus penting..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-academic-500/20 text-slate-900"
            />
          </div>

          {/* Realistic Drag & Drop Upload Simulator */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unggah File Dokumen (PDF, PPTX, DOCX)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-academic-500 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer">
              {stagedFile ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-2 text-left min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-academic-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {stagedFile.type}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {stagedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {stagedFile.sizeMb} MB • Siap diunggah
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStagedFile(null)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-600 font-medium">
                    Tarik file ke sini atau pilih format uji coba:
                  </div>
                  <div className="flex items-center justify-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('pdf')}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 hover:border-academic-500"
                    >
                      + Demo PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('pptx')}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 hover:border-academic-500"
                    >
                      + Demo PPTX
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateFileUpload('docx')}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700 hover:border-academic-500"
                    >
                      + Demo DOCX
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400">Maksimum ukuran 25 MB</div>
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !stagedFile}
            className="w-full py-2.5 rounded-xl bg-academic-600 hover:bg-academic-700 active:scale-98 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>
              {isSubmitting ? 'Mengirim ke Antrean Moderasi...' : 'Ajukan Catatan untuk Moderasi'}
            </span>
          </button>
        </form>
      )}

      {/* TAB 2: MY SUBMISSIONS & REJECTION FEEDBACK DRAWER */}
      {subTab === 'submissions' && (
        <section className="space-y-3">
          {/* Status Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'approved', label: 'Approved' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'rejected', label: 'Perlu Revisi' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {filteredSubmissions.map((sub) => {
              const isApproved = sub.status === 'approved';
              const isPending = sub.status === 'pending';
              const isRejected = sub.status === 'rejected';

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5 text-[10px] mb-1">
                        <span className="font-bold uppercase text-academic-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {sub.course_code}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">Bab {sub.chapter_number}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{sub.description}</p>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0">
                      {isApproved && (
                        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Perlu Revisi</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* IF REJECTED: HIGHLIGHT CALLOUT BOX WITH REJECTION REASON */}
                  {isRejected && sub.rejection_reason && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-rose-800 text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Catatan Evaluasi Admin & Panduan Perbaikan:</span>
                      </div>
                      <p className="text-rose-700 leading-relaxed text-xs">
                        "{sub.rejection_reason}"
                      </p>
                      <div className="pt-1.5 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setTitle(`(Revisi) ${sub.title}`);
                            setCourseId(sub.course_id);
                            setChapterId(sub.chapter_id);
                            setSubTab('upload');
                          }}
                          className="px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-rose-700 font-semibold text-[11px] hover:bg-rose-50 transition-colors"
                        >
                          Ajukan Ulang Versi Revisi
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submission Footer Metadata */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {sub.file_name} ({sub.file_size_mb} MB)
                    </span>
                    {isApproved ? (
                      <div className="flex items-center space-x-3 text-slate-600">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3 text-slate-400" /> {sub.views_count}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Download className="w-3 h-3 text-slate-400" /> {sub.downloads_count}
                        </span>
                        <button
                          onClick={() => onOpenReader(sub)}
                          className="text-academic-600 font-semibold hover:underline"
                        >
                          Lihat Pratinjau
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">Diajukan: {sub.created_at}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
