'use client';

import React, { useState, useMemo } from 'react';
import { Course, Chapter, Material, MaterialCategory, UserRole } from '@/types';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  FileText, 
  FileCode, 
  Presentation, 
  ChevronRight, 
  ArrowLeft, 
  Eye, 
  Download, 
  CheckCircle2, 
  FolderX, 
  PlusCircle, 
  Layers, 
  GraduationCap 
} from 'lucide-react';

interface StudentViewProps {
  courses: Course[];
  chapters: Chapter[];
  materials: Material[];
  selectedCourseId: string | null;
  onSelectCourse: (id: string | null) => void;
  onOpenReader: (material: Material) => void;
  onSwitchToContributor: (courseId?: string, chapterId?: string) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  courses,
  chapters,
  materials,
  selectedCourseId,
  onSelectCourse,
  onOpenReader,
  onSwitchToContributor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('all');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  // Filter approved materials only for students
  const approvedMaterials = useMemo(() => {
    return materials.filter((m) => m.status === 'approved');
  }, [materials]);

  // Current selected course object
  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  // Chapters for active course
  const activeChapters = useMemo(() => {
    if (!selectedCourseId) return [];
    return chapters
      .filter((ch) => ch.course_id === selectedCourseId)
      .sort((a, b) => a.order_index - b.order_index);
  }, [chapters, selectedCourseId]);

  // Search & category filtered results (if searching)
  const filteredMaterials = useMemo(() => {
    return approvedMaterials.filter((m) => {
      const matchSearch =
        searchQuery === '' ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.chapter_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || m.category === selectedCategory;

      const matchCourse =
        !selectedCourseId || m.course_id === selectedCourseId;

      return matchSearch && matchCategory && matchCourse;
    });
  }, [approvedMaterials, searchQuery, selectedCategory, selectedCourseId]);

  // Helper to render file icon badge
  const renderFileBadge = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-bold px-1.5 py-0.5 rounded">
            PDF
          </span>
        );
      case 'pptx':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-bold px-1.5 py-0.5 rounded">
            PPTX
          </span>
        );
      case 'docx':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-bold px-1.5 py-0.5 rounded">
            DOCX
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
            {fileType}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* 1. HERO LANDING BANNER (High-impact entry) */}
      {!selectedCourseId && !searchQuery && (
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50/70 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            {/* Research Backing Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Backed by 81.8% student demand at UNESA</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Stop losing lecture notes in messy chat histories.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Organized by course & chapter, vetted by top cohort TAs and lecturers, and continuously tracked for curriculum learning gaps.
            </p>

            <div className="mt-4 flex items-center space-x-3">
              <a
                href="#courses-section"
                className="bg-academic-600 hover:bg-academic-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
              >
                <span>Explore Course Library</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => onSwitchToContributor()}
                className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Become a Contributor
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. SEARCH BAR & CATEGORY PILLS */}
      <section className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across courses, chapters, or note topics (e.g., L'Hopital, Seaborn)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-academic-500/20 focus:border-academic-600 text-slate-900 placeholder:text-slate-400 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'summary_notes', label: 'Summary Notes' },
            { id: 'lecture_slides', label: 'Lecture Slides' },
            { id: 'practice_questions', label: 'Practice Questions' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as MaterialCategory)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ACTIVE SEARCH RESULTS (If user is searching) */}
      {searchQuery && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Hasil pencarian untuk "{searchQuery}"</span>
            <span>{filteredMaterials.length} materi ditemukan</span>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200/90 text-center space-y-3">
              <FolderX className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">Tidak ada materi ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Belum ada catatan terverifikasi yang cocok dengan kata kunci ini.
              </p>
              <button
                onClick={() => onSwitchToContributor()}
                className="inline-flex items-center space-x-1.5 text-xs text-academic-600 font-semibold hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Unggah catatan untuk topik ini</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => onOpenReader(mat)}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-academic-500/60 shadow-xs hover:shadow-subtle transition-all cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                      {renderFileBadge(mat.file_type)}
                      <span className="font-semibold text-slate-700">{mat.course_code}</span>
                      <span>•</span>
                      <span className="truncate">{mat.chapter_title}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-academic-600 transition-colors line-clamp-1">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{mat.description}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        {mat.contributor_name}
                        {mat.is_contributor_verified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" /> {mat.views_count}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Download className="w-3 h-3" /> {mat.downloads_count}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. HIERARCHICAL DRILL-DOWN: COURSE LIST OR CHAPTER VIEW */}
      {!searchQuery && !selectedCourseId && (
        <section id="courses-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Mata Kuliah Semester 1
              </h2>
              <p className="text-xs text-slate-500">Kurikulum S1 Sains Data FMIPA UNESA</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              4 Mata Kuliah
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((course) => {
              const courseMaterials = approvedMaterials.filter((m) => m.course_id === course.id);
              const courseChapters = chapters.filter((ch) => ch.course_id === course.id);

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-academic-500/60 shadow-xs hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-academic-700 border border-blue-200/60">
                        {course.code} • {course.sks} SKS
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Semester {course.semester}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-academic-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[170px] text-slate-600 font-medium">
                      {course.lecturer_name}
                    </span>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-semibold text-academic-600">
                        {courseMaterials.length} catatan
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-academic-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. CHAPTER ACCORDION & MATERIALS VIEW (When Course is Selected) */}
      {!searchQuery && selectedCourseId && activeCourse && (
        <section className="space-y-4 animate-fade-in">
          {/* Breadcrumb Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelectCourse(null)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Mata Kuliah</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              {activeCourse.code} • {activeCourse.sks} SKS
            </span>
          </div>

          {/* Active Course Card Header */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-academic-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                  Mata Kuliah Pilihan
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {activeCourse.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <GraduationCap className="w-3.5 h-3.5 text-academic-600" />
                Dosen: {activeCourse.lecturer_name}
              </span>
              <span>{activeChapters.length} Bab Kurikulum</span>
            </div>
          </div>

          {/* Chapter Accordions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              Daftar Bab & Materi Terverifikasi
            </h3>

            {activeChapters.map((chapter) => {
              const chapterMaterials = approvedMaterials.filter(
                (m) => m.chapter_id === chapter.id
              );
              const isExpanded = expandedChapterId === chapter.id || expandedChapterId === null;

              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  {/* Chapter Header Accordion Toggle */}
                  <div
                    onClick={() =>
                      setExpandedChapterId(
                        expandedChapterId === chapter.id ? '' : chapter.id
                      )
                    }
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          Bab {chapter.chapter_number}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {chapter.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {chapter.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          chapterMaterials.length > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {chapterMaterials.length} catatan
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Materials List Inside Chapter */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-3 bg-slate-50/40 space-y-2">
                      {chapterMaterials.length === 0 ? (
                        /* ENGAGING MINIMALIST EMPTY STATE */
                        <div className="bg-white rounded-xl p-5 border border-dashed border-slate-300 text-center space-y-2.5">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">
                              No vetted notes here yet
                            </h5>
                            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                              Be the first to contribute notes or formula summaries for Bab {chapter.chapter_number}!
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              onSwitchToContributor(activeCourse.id, chapter.id)
                            }
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-academic-600 hover:bg-academic-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Unggah Catatan Bab Ini</span>
                          </button>
                        </div>
                      ) : (
                        chapterMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            onClick={() => onOpenReader(mat)}
                            className="bg-white p-3 rounded-lg border border-slate-200/80 hover:border-academic-500 shadow-xs hover:shadow-subtle transition-all cursor-pointer flex items-start justify-between gap-2.5 group"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center space-x-1.5 text-[10px]">
                                {renderFileBadge(mat.file_type)}
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500 font-medium">
                                  {mat.file_size_mb} MB
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 group-hover:text-academic-600 transition-colors">
                                {mat.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {mat.description}
                              </p>
                              <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
                                <span className="flex items-center gap-1 text-slate-600">
                                  {mat.contributor_name}
                                  {mat.is_contributor_verified && (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  )}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <Eye className="w-3 h-3" /> {mat.views_count}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Download className="w-3 h-3" /> {mat.downloads_count}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-academic-600 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
