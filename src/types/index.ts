export type UserRole = 'student' | 'contributor' | 'admin';

export type MaterialCategory = 'all' | 'lecture_slides' | 'summary_notes' | 'practice_questions' | 'exam_review';

export type FileFormat = 'pdf' | 'pptx' | 'docx' | 'zip';

export type MaterialStatus = 'pending' | 'approved' | 'rejected';

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  sks: number;
  semester: number;
  lecturer_name: string;
  accent_color?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  course_id: string;
  chapter_number: number;
  title: string;
  description: string;
  order_index: number;
}

export interface Material {
  id: string;
  course_id: string;
  chapter_id: string;
  course_name: string;
  course_code: string;
  chapter_title: string;
  chapter_number: number;
  title: string;
  description: string;
  category: Exclude<MaterialCategory, 'all'>;
  file_type: FileFormat;
  file_name: string;
  file_size_mb: number;
  status: MaterialStatus;
  rejection_reason?: string;
  contributor_name: string;
  contributor_nim: string;
  is_contributor_verified: boolean;
  views_count: number;
  downloads_count: number;
  created_at: string;
  approved_at?: string;
  preview_content?: string;
}

export interface AccessLog {
  id: string;
  material_id: string;
  material_title: string;
  action_type: 'view' | 'download';
  timestamp: string;
  user_role: UserRole;
}

export interface LearningGapSignal {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  materials_available: number;
  student_search_volume: number;
  gap_severity: 'critical' | 'moderate' | 'healthy';
  suggested_action: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
}
