-- ==============================================================================
-- NOOKLY: A Smarter Way to Organize and Share Learning Resources
-- UNESA Data Science (Sains Data) Academic Repository
-- Architecture: PostgreSQL + Supabase Auth + Supabase Storage + RLS Policies
-- Team: KatanyaForFun (Hackathon Edition)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & CUSTOM TYPES
CREATE TYPE user_role AS ENUM ('student', 'contributor', 'admin', 'lecturer');
CREATE TYPE material_category AS ENUM ('lecture_slides', 'summary_notes', 'practice_questions', 'exam_review');
CREATE TYPE file_format AS ENUM ('pdf', 'pptx', 'docx', 'zip');
CREATE TYPE material_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE access_action_type AS ENUM ('view', 'download');

-- 3. PROFILES TABLE (Mirrors Supabase Auth Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    nim TEXT UNIQUE, -- Nomor Induk Mahasiswa UNESA (e.g., 24051204001)
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    department TEXT DEFAULT 'S1 Sains Data',
    faculty TEXT DEFAULT 'FMIPA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. COURSES TABLE (Academic Subjects)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE, -- e.g., 'SD101', 'SD102'
    name TEXT NOT NULL, -- e.g., 'Kalkulus I'
    description TEXT,
    sks INTEGER NOT NULL DEFAULT 3,
    semester INTEGER NOT NULL DEFAULT 1,
    lecturer_name TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'S1 Sains Data',
    icon TEXT DEFAULT 'BookOpen',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CHAPTERS TABLE (Curriculum Units)
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_course_chapter UNIQUE (course_id, chapter_number)
);

-- 6. MATERIALS TABLE (Vetted Documents & Notes)
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    contributor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category material_category NOT NULL DEFAULT 'summary_notes',
    file_type file_format NOT NULL DEFAULT 'pdf',
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    status material_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    views_count INTEGER NOT NULL DEFAULT 0,
    downloads_count INTEGER NOT NULL DEFAULT 0,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ACCESS LOGS TABLE (Granular View & Download Tracking)
CREATE TABLE public.access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type access_action_type NOT NULL,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. LEARNING GAP SIGNALS TABLE (Lecturer Insights & Needs)
CREATE TABLE public.learning_gap_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    material_count INTEGER NOT NULL DEFAULT 0,
    student_search_queries INTEGER NOT NULL DEFAULT 0,
    gap_severity TEXT NOT NULL CHECK (gap_severity IN ('critical', 'moderate', 'healthy')),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_materials_course_status ON public.materials(course_id, status);
CREATE INDEX idx_materials_chapter_status ON public.materials(chapter_id, status);
CREATE INDEX idx_materials_contributor ON public.materials(contributor_id);
CREATE INDEX idx_access_logs_material ON public.access_logs(material_id, action_type);
CREATE INDEX idx_chapters_course ON public.chapters(course_id, order_index);

-- ==============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

-- A. Auto-increment views and downloads count on access_logs insert
CREATE OR REPLACE FUNCTION public.handle_access_logging()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.action_type = 'view' THEN
        UPDATE public.materials
        SET views_count = views_count + 1, updated_at = now()
        WHERE id = NEW.material_id;
    ELSIF NEW.action_type = 'download' THEN
        UPDATE public.materials
        SET downloads_count = downloads_count + 1, updated_at = now()
        WHERE id = NEW.material_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_access_log_insert
AFTER INSERT ON public.access_logs
FOR EACH ROW EXECUTE FUNCTION public.handle_access_logging();

-- B. Sync auth.users with public.profiles on Supabase signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_gap_signals ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read all verified contributor profiles, users can update self
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses & Chapters: Everyone can read
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses FOR SELECT USING (true);

CREATE POLICY "Chapters are viewable by everyone" 
ON public.chapters FOR SELECT USING (true);

-- Materials:
-- 1. Anyone can view APPROVED materials
CREATE POLICY "Approved materials are viewable by everyone" 
ON public.materials FOR SELECT 
USING (status = 'approved');

-- 2. Contributors can view ALL their own submitted materials
CREATE POLICY "Contributors can view own submissions" 
ON public.materials FOR SELECT 
USING (auth.uid() = contributor_id);

-- 3. Admins and Lecturers can view and moderate ALL materials
CREATE POLICY "Admins and lecturers can view all materials" 
ON public.materials FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'lecturer')
    )
);

-- 4. Authenticated users can insert new materials with pending status
CREATE POLICY "Authenticated users can submit materials" 
ON public.materials FOR INSERT 
WITH CHECK (
    auth.uid() = contributor_id 
    AND status = 'pending'
);

-- Access Logs:
CREATE POLICY "Anyone can log view/download events" 
ON public.access_logs FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view access logs" 
ON public.access_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'lecturer')
    )
);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'learning-materials',
    'learning-materials',
    true,
    26214400, -- 25 MB max size
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read on learning-materials bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'learning-materials');

CREATE POLICY "Authenticated Upload to learning-materials bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'learning-materials' AND auth.role() = 'authenticated');

-- ==============================================================================
-- SEED DATA (Realistic UNESA Data Science First Semester Courses & Chapters)
-- ==============================================================================
DO $$
DECLARE
    course_kalkulus UUID;
    course_algo UUID;
    course_sainsdata UUID;
    course_statistika UUID;
    
    ch_kalkulus_1 UUID;
    ch_kalkulus_2 UUID;
    ch_kalkulus_3 UUID;
    ch_kalkulus_4 UUID;
    
    ch_algo_1 UUID;
    ch_algo_2 UUID;
    ch_algo_3 UUID;
    
    ch_sains_1 UUID;
    ch_sains_2 UUID;
    ch_sains_3 UUID;
    
    ch_stat_1 UUID;
    ch_stat_2 UUID;
    ch_stat_3 UUID;
    
    dummy_student_1 UUID := 'a1111111-1111-1111-1111-111111111111';
    dummy_student_2 UUID := 'a2222222-2222-2222-2222-222222222222';
    dummy_admin UUID := 'b1111111-1111-1111-1111-111111111111';
BEGIN
    -- Courses
    INSERT INTO public.courses (id, code, name, description, sks, semester, lecturer_name)
    VALUES 
    (uuid_generate_v4(), 'SD101', 'Kalkulus I', 'Dasar analisis matematika real, limit kontinu, turunan fungsi, dan aplikasi optimasi untuk pemodelan data.', 3, 1, 'Dr. Dwi Lestari, M.Si.')
    RETURNING id INTO course_kalkulus;

    INSERT INTO public.courses (id, code, name, description, sks, semester, lecturer_name)
    VALUES 
    (uuid_generate_v4(), 'SD102', 'Algoritma & Pemrograman', 'Pengenalan logika algoritma, alur berpikir komputasional, tipe data, struktur kontrol, dan pemrograman Python modern.', 4, 1, 'I Kadek Dwi Nuryana, S.T., M.Kom.')
    RETURNING id INTO course_algo;

    INSERT INTO public.courses (id, code, name, description, sks, semester, lecturer_name)
    VALUES 
    (uuid_generate_v4(), 'SD103', 'Pengantar Sains Data', 'Fondasi data science, pembersihan data (wrangling), visualisasi insight, etika data, dan pengenalan alur machine learning.', 3, 1, 'Prof. Dr. Agus Triyono, M.Cs.')
    RETURNING id INTO course_sainsdata;

    INSERT INTO public.courses (id, code, name, description, sks, semester, lecturer_name)
    VALUES 
    (uuid_generate_v4(), 'SD104', 'Statistika Dasar', 'Statistik deskriptif, ukuran pemusatan & penyebaran, peluang dasar, sebaran distribusi diskrit dan kontinu, serta uji hipotesis awal.', 3, 1, 'Endah Rahmawati, S.Si., M.Stat.')
    RETURNING id INTO course_statistika;

    -- Chapters for Kalkulus I
    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_kalkulus, 1, 'Sistem Bilangan Real & Pertidaksamaan', 'Himpunan bilangan real, sifat aljabar, pertidaksamaan linear/kuadrat, dan konsep nilai mutlak.', 1)
    RETURNING id INTO ch_kalkulus_1;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_kalkulus, 2, 'Fungsi, Limit & Kekontinuan', 'Definisi intuitif dan presisi limit, teorema apit, limit fungsi trigonometri, dan uji kekontinuan.', 2)
    RETURNING id INTO ch_kalkulus_2;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_kalkulus, 3, 'Turunan Fungsi & Aturan Rantai', 'Konsep laju perubahan sesaat, turunan fungsi aljabar, trigonometri, dan aturan rantai bertingkat.', 3)
    RETURNING id INTO ch_kalkulus_3;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_kalkulus, 4, 'Aplikasi Turunan & Nilai Ekstrem (Learning Gap)', 'Uji turunan pertama/kedua, kecekungan kurva, dan masalah pemodelan optimasi praktis.', 4)
    RETURNING id INTO ch_kalkulus_4;

    -- Chapters for Algoritma
    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_algo, 1, 'Logika Dasar Pemrograman & Pseudocode', 'Penyusunan flowchart standar ISO, pseudocode terstruktur, dan analisis kompleksitas ruang-waktu dasar.', 1)
    RETURNING id INTO ch_algo_1;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_algo, 2, 'Struktur Data Python: List, Tuple & Dict', 'Manipulasi array, list comprehension, dictionary mapping, hashing dasar, dan unpacking variabel.', 2)
    RETURNING id INTO ch_algo_2;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_algo, 3, 'Percabangan, Looping & Modular Functions', 'Struktur if-elif-else, nested while/for loop, pembuatan modul terpisah, dan fungsi lambda rekursif.', 3)
    RETURNING id INTO ch_algo_3;

    -- Chapters for Pengantar Sains Data
    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_sainsdata, 1, 'Ekosistem & Siklus Hidup Sains Data', 'Framework CRISP-DM, peran data scientist vs data engineer, dan studi kasus industri.', 1)
    RETURNING id INTO ch_sains_1;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_sainsdata, 2, 'Data Wrangling & Eksplorasi (Pandas/Seaborn)', 'Handling missing values, outlier detection, filtering, grouping data frame, dan visualisasi distribusi.', 2)
    RETURNING id INTO ch_sains_2;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_sainsdata, 3, 'Pengantar Machine Learning & Evaluasi Model', 'Supervised vs unsupervised learning, split train-test, dan metrik akurasi/confusion matrix.', 3)
    RETURNING id INTO ch_sains_3;

    -- Chapters for Statistika Dasar
    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_statistika, 1, 'Statistika Deskriptif & Penyajian Data', 'Mean, median, modus, varians, deviasi standar, serta visualisasi boxplot dan histogram.', 1)
    RETURNING id INTO ch_stat_1;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_statistika, 2, 'Peluang & Distribusi Diskrit/Kontinu', 'Kaidah perkalian & penjumlahan, probabilitas bersyarat, distribusi Binomial, Poisson, dan Normal Gauss.', 2)
    RETURNING id INTO ch_stat_2;

    INSERT INTO public.chapters (id, course_id, chapter_number, title, description, order_index)
    VALUES
    (uuid_generate_v4(), course_statistika, 3, 'Uji Hipotesis & Uji Rata-Rata Satu Sampel', 'Taraf signifikansi alpha, Z-test vs T-test, one-tailed vs two-tailed, dan interpretasi p-value.', 3)
    RETURNING id INTO ch_stat_3;

END $$;
