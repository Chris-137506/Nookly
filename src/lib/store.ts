'use client';

import { useState, useEffect } from 'react';
import { Course, Chapter, Material, UserRole, MaterialCategory, ToastMessage, LearningGapSignal } from '@/types';
import { INITIAL_COURSES, INITIAL_CHAPTERS, INITIAL_MATERIALS, INITIAL_LEARNING_GAPS } from './mock-data';

const STORAGE_KEY = 'nookly_state_v1';

export function useNooklyStore() {
  const [role, setRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'submissions' | 'admin_queue' | 'analytics'>('browse');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [learningGaps, setLearningGaps] = useState<LearningGapSignal[]>(INITIAL_LEARNING_GAPS);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('all');
  
  const [activeReaderMaterial, setActiveReaderMaterial] = useState<Material | null>(null);
  const [rejectingMaterial, setRejectingMaterial] = useState<Material | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.materials) setMaterials(parsed.materials);
        if (parsed.role) setRoleState(parsed.role);
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  // Sync materials & role changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ materials, role }));
    } catch {
      // ignore
    }
  }, [materials, role]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'student') {
      setActiveTab('browse');
      addToast({
        type: 'info',
        title: 'Switched to Student Role',
        description: 'You can explore vetted courses, search chapters, and download lecture notes.',
      });
    } else if (newRole === 'contributor') {
      setActiveTab('upload');
      addToast({
        type: 'info',
        title: 'Switched to Contributor Role',
        description: 'Upload high-quality notes or check moderation status of your submissions.',
      });
    } else if (newRole === 'admin') {
      setActiveTab('admin_queue');
      addToast({
        type: 'warning',
        title: 'Switched to Admin / Lecturer Role',
        description: 'Moderate pending submissions and inspect curriculum learning gaps.',
      });
    }
  };

  const openReader = (material: Material) => {
    // Log view event
    setMaterials((prev) =>
      prev.map((m) => (m.id === material.id ? { ...m, views_count: m.views_count + 1 } : m))
    );
    setActiveReaderMaterial({ ...material, views_count: material.views_count + 1 });
  };

  const closeReader = () => {
    setActiveReaderMaterial(null);
  };

  const downloadMaterial = (material: Material) => {
    // Log download event
    setMaterials((prev) =>
      prev.map((m) => (m.id === material.id ? { ...m, downloads_count: m.downloads_count + 1 } : m))
    );
    if (activeReaderMaterial?.id === material.id) {
      setActiveReaderMaterial((prev) => prev ? { ...prev, downloads_count: prev.downloads_count + 1 } : null);
    }
    addToast({
      type: 'success',
      title: 'Download Started & Logged',
      description: `${material.file_name} (${material.file_size_mb} MB) downloaded. Access logged to analytics.`,
    });
  };

  const submitMaterial = (data: {
    courseId: string;
    chapterId: string;
    title: string;
    description: string;
    category: Exclude<MaterialCategory, 'all'>;
    fileName: string;
    fileSizeMb: number;
    fileType: 'pdf' | 'pptx' | 'docx' | 'zip';
    suggestedChapterName?: string;
  }) => {
    const course = courses.find((c) => c.id === data.courseId);
    let chapter = chapters.find((ch) => ch.id === data.chapterId);

    // If new chapter suggested
    if (!chapter && data.suggestedChapterName) {
      const newChId = 'ch_' + Math.random().toString(36).substring(2, 7);
      const newChapter: Chapter = {
        id: newChId,
        course_id: data.courseId,
        chapter_number: (chapters.filter((c) => c.course_id === data.courseId).length || 0) + 1,
        title: data.suggestedChapterName,
        description: 'Bab baru diajukan oleh kontributor mahasiswa',
        order_index: (chapters.filter((c) => c.course_id === data.courseId).length || 0) + 1,
      };
      setChapters((prev) => [...prev, newChapter]);
      chapter = newChapter;
    }

    const newMaterial: Material = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      course_id: data.courseId,
      chapter_id: chapter?.id || data.chapterId,
      course_name: course?.name || 'Mata Kuliah',
      course_code: course?.code || 'SD',
      chapter_title: chapter?.title || 'Bab Kuliah',
      chapter_number: chapter?.chapter_number || 1,
      title: data.title,
      description: data.description,
      category: data.category,
      file_type: data.fileType,
      file_name: data.fileName,
      file_size_mb: data.fileSizeMb,
      status: 'pending',
      contributor_name: 'Dimas Arya',
      contributor_nim: '24051204001',
      is_contributor_verified: true,
      views_count: 0,
      downloads_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      preview_content: `Pratinjau Dokumen (${data.fileName}):\n${data.description}`,
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    addToast({
      type: 'success',
      title: 'Material Submitted for Review',
      description: 'Your notes are now pending moderation. Admin FMIPA UNESA will review formatting and accuracy.',
    });
    setActiveTab('submissions');
  };

  const approveMaterial = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, status: 'approved', approved_at: new Date().toISOString().split('T')[0] }
          : m
      )
    );

    // Update learning gaps if applicable
    const approved = materials.find((m) => m.id === materialId);
    if (approved) {
      setLearningGaps((prev) =>
        prev.map((gap) =>
          gap.chapter_id === approved.chapter_id
            ? { ...gap, materials_available: gap.materials_available + 1, gap_severity: 'healthy' }
            : gap
        )
      );
    }

    addToast({
      type: 'success',
      title: 'Resource Approved & Published',
      description: 'Material is now live in the student library and chapter drilldown.',
    });
  };

  const rejectMaterial = (materialId: string, reason: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, status: 'rejected', rejection_reason: reason }
          : m
      )
    );
    setRejectingMaterial(null);
    addToast({
      type: 'warning',
      title: 'Submission Rejected with Feedback',
      description: 'Detailed revision notes have been posted to the contributor drawer.',
    });
  };

  const requestMaterialTA = (gapTitle: string) => {
    addToast({
      type: 'info',
      title: 'Notified Teaching Assistants',
      description: `Bounty alert triggered for "${gapTitle}". Top 3 TA note takers in FMIPA UNESA have been alerted!`,
    });
  };

  return {
    role,
    setRole,
    activeTab,
    setActiveTab,
    courses,
    chapters,
    materials,
    learningGaps,
    selectedCourseId,
    setSelectedCourseId,
    selectedChapterId,
    setSelectedChapterId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeReaderMaterial,
    openReader,
    closeReader,
    downloadMaterial,
    rejectingMaterial,
    setRejectingMaterial,
    submitMaterial,
    approveMaterial,
    rejectMaterial,
    requestMaterialTA,
    toasts,
    addToast,
    removeToast,
  };
}
