import { Course, Chapter, Material, LearningGapSignal } from '@/types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'SD101',
    name: 'Kalkulus I',
    description: 'Konsep bilangan real, fungsi, limit, turunan fungsi dan aplikasi optimasi pada permodelan data sains.',
    sks: 3,
    semester: 1,
    lecturer_name: 'Dr. Dwi Lestari, M.Si.',
    accent_color: 'bg-blue-500',
  },
  {
    id: 'c2',
    code: 'SD102',
    name: 'Algoritma & Pemrograman',
    description: 'Fondasi komputasi, struktur logika, pseudocode, dan implementasi algoritma menggunakan Python modern.',
    sks: 4,
    semester: 1,
    lecturer_name: 'I Kadek Dwi Nuryana, S.T., M.Kom.',
    accent_color: 'bg-emerald-500',
  },
  {
    id: 'c3',
    code: 'SD103',
    name: 'Pengantar Sains Data',
    description: 'Siklus hidup CRISP-DM, data wrangling dasar, eksplorasi dataset, visualisasi seaborn, dan etika data.',
    sks: 3,
    semester: 1,
    lecturer_name: 'Prof. Dr. Agus Triyono, M.Cs.',
    accent_color: 'bg-violet-500',
  },
  {
    id: 'c4',
    code: 'SD104',
    name: 'Statistika Dasar',
    description: 'Statistik deskriptif, ukuran pemusatan & keragaman, konsep peluang, sebaran distribusi, dan uji hipotesis.',
    sks: 3,
    semester: 1,
    lecturer_name: 'Endah Rahmawati, S.Si., M.Stat.',
    accent_color: 'bg-amber-500',
  },
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // Kalkulus I
  {
    id: 'ch1',
    course_id: 'c1',
    chapter_number: 1,
    title: 'Sistem Bilangan Real & Pertidaksamaan',
    description: 'Aksioma kelengkapan, pertidaksamaan pecahan dan kuadrat, serta konsep nilai mutlak.',
    order_index: 1,
  },
  {
    id: 'ch2',
    course_id: 'c1',
    chapter_number: 2,
    title: 'Fungsi, Limit & Kekontinuan',
    description: 'Konsep limit intuitif dan formal (epsilon-delta), teorema limit apit, dan uji kekontinuan fungsi.',
    order_index: 2,
  },
  {
    id: 'ch3',
    course_id: 'c1',
    chapter_number: 3,
    title: 'Turunan Fungsi & Aturan Rantai',
    description: 'Laju perubahan sesaat, aturan diferensiasi aljabar & trigonometri, dan aturan rantai multivariabel dasar.',
    order_index: 3,
  },
  {
    id: 'ch4',
    course_id: 'c1',
    chapter_number: 4,
    title: 'Aplikasi Turunan & Nilai Ekstrem',
    description: 'Uji turunan pertama/kedua, kecekungan kurva f\'\'(x), optimasi fungsi biaya, dan Teorema Nilai Rata-rata.',
    order_index: 4,
  },

  // Algoritma & Pemrograman
  {
    id: 'ch5',
    course_id: 'c2',
    chapter_number: 1,
    title: 'Logika Pemrograman & Flowchart Terstruktur',
    description: 'Standar diagram alir, pseudocode baku, variabel memory trace, dan pengantar interpreter Python.',
    order_index: 1,
  },
  {
    id: 'ch6',
    course_id: 'c2',
    chapter_number: 2,
    title: 'Struktur Data Dasar: List, Tuple & Dict',
    description: 'Indexing, slicing, mutability, methods built-in, dictionary comprehension, dan set operations.',
    order_index: 2,
  },
  {
    id: 'ch7',
    course_id: 'c2',
    chapter_number: 3,
    title: 'Percabangan, Looping & Modularitas Fungsi',
    description: 'Kondisional bersarang, perulangan for/while, parameter default vs keyword arguments, dan recursion.',
    order_index: 3,
  },

  // Pengantar Sains Data
  {
    id: 'ch8',
    course_id: 'c3',
    chapter_number: 1,
    title: 'Ekosistem Sains Data & Metodologi CRISP-DM',
    description: 'Fase business understanding hingga deployment, komparasi data analyst vs scientist vs engineer.',
    order_index: 1,
  },
  {
    id: 'ch9',
    course_id: 'c3',
    chapter_number: 2,
    title: 'Data Wrangling & Eksplorasi (Pandas & Seaborn)',
    description: 'Pembersihan missing data (imputation), penanganan duplikat, boxplot outlier detection, dan heatmap korelasi.',
    order_index: 2,
  },
  {
    id: 'ch10',
    course_id: 'c3',
    chapter_number: 3,
    title: 'Pengantar Machine Learning & Evaluasi Model',
    description: 'Supervised vs unsupervised learning, data splitting 80/20, confusion matrix, akurasi, dan over-fitting.',
    order_index: 3,
  },

  // Statistika Dasar
  {
    id: 'ch11',
    course_id: 'c4',
    chapter_number: 1,
    title: 'Statistika Deskriptif & Ukuran Pemusatan',
    description: 'Mean aritmetik, median posisi, modus modus, kuartil interkuartil, dan varians terbobot.',
    order_index: 1,
  },
  {
    id: 'ch12',
    course_id: 'c4',
    chapter_number: 2,
    title: 'Teori Peluang & Distribusi Probabilitas Diskrit',
    description: 'Permutasi & kombinasi, aturan Bayes, peubah acak, distribusi Binomial, dan Poisson.',
    order_index: 2,
  },
  {
    id: 'ch13',
    course_id: 'c4',
    chapter_number: 3,
    title: 'Distribusi Normal & Uji Hipotesis Dasar',
    description: 'Tabel kurva normal baku (Z-score), galat tipe I & II, uji rata-rata satu populasi menggunakan T-student.',
    order_index: 3,
  },
];

export const INITIAL_MATERIALS: Material[] = [
  // Kalkulus I - Bab 2
  {
    id: 'm1',
    course_id: 'c1',
    chapter_id: 'ch2',
    course_name: 'Kalkulus I',
    course_code: 'SD101',
    chapter_title: 'Fungsi, Limit & Kekontinuan',
    chapter_number: 2,
    title: "Rangkuman Rumus Cepat Limit & Teorema L'Hopital",
    description: 'Catatan komprehensif penanganan bentuk tak tentu 0/0, inf/inf, teorema limit trigonometri khusus, dan 15 contoh soal bertingkat.',
    category: 'summary_notes',
    file_type: 'pdf',
    file_name: 'kalkulus1-bab2-rangkuman-limit.pdf',
    file_size_mb: 4.8,
    status: 'approved',
    contributor_name: 'Dimas Arya',
    contributor_nim: '24051204001',
    is_contributor_verified: true,
    views_count: 248,
    downloads_count: 142,
    created_at: '2026-10-14',
    approved_at: '2026-10-15',
    preview_content: `RINGKASAN MATERI: LIMIT & KEKONTINUAN
1. Definisi Intuitif Limit:
   lim(x -> c) f(x) = L berarti nilai f(x) mendekati L saat x mendekati c dari kedua sisi kiri dan kanan.
2. Bentuk Tak Tentu Utama:
   - [0/0] -> Faktorisasi aljabar, perkalian akar sekawan, atau Aturan L'Hopital
   - [inf/inf] -> Bagi dengan pangkat tertinggi variabel penyebut
3. Teorema Apit (Squeeze Theorem):
   Jika g(x) <= f(x) <= h(x) untuk setiap x dekat c, dan lim g(x) = lim h(x) = L, maka lim f(x) = L.
4. Kekontinuan pada Titik c:
   f kontinu di c JIKA & HANYA JIKA:
   a. f(c) terdefinisi
   b. lim(x -> c) f(x) ada (limit kiri = limit kanan)
   c. lim(x -> c) f(x) = f(c)`,
  },
  // Kalkulus I - Bab 3
  {
    id: 'm2',
    course_id: 'c1',
    chapter_id: 'ch3',
    course_name: 'Kalkulus I',
    course_code: 'SD101',
    chapter_title: 'Turunan Fungsi & Aturan Rantai',
    title: 'Latihan Soal UTS Kalkulus I Beserta Pembahasan 2024',
    description: 'Kompilasi 8 paket soal UTS tahun lalu dari FMIPA UNESA dengan coretan kunci jawaban langkah demi langkah yang telah diverifikasi asisten dosen.',
    category: 'practice_questions',
    file_type: 'pdf',
    file_name: 'bank-soal-uts-kalkulus1-fmipa.pdf',
    file_size_mb: 6.2,
    status: 'approved',
    contributor_name: 'Siti Nurhaliza',
    contributor_nim: '23051204019',
    is_contributor_verified: true,
    views_count: 489,
    downloads_count: 312,
    created_at: '2026-10-18',
    approved_at: '2026-10-19',
    preview_content: `BANK SOAL UTS RESMI FMIPA UNESA
Mata Kuliah: Kalkulus I (3 SKS)
Dosen Pengampu: Dr. Dwi Lestari, M.Si.

[SOAL 1] Turunkan fungsi implisit berikut terhadap x:
x^3 + y^3 = 6xy
Pembahasan:
Diferensialkan kedua ruas terhadap x:
3x^2 + 3y^2 (dy/dx) = 6(y + x dy/dx)
3x^2 + 3y^2 y' = 6y + 6x y'
y'(3y^2 - 6x) = 6y - 3x^2
dy/dx = (2y - x^2) / (y^2 - 2x) [TERBUKTI]`,
  },
  // Algoritma - Bab 3
  {
    id: 'm3',
    course_id: 'c2',
    chapter_id: 'ch7',
    course_name: 'Algoritma & Pemrograman',
    course_code: 'SD102',
    chapter_title: 'Percabangan, Looping & Modularitas Fungsi',
    title: 'Slide Kuliah: Alur Logika Percabangan & Loop Python',
    description: 'Slide resmi pertemuan 5-6 mencakup diagram eksekusi alur percabangan nested if, loop invariant, dan handling infinite loop bugs.',
    category: 'lecture_slides',
    file_type: 'pptx',
    file_name: 'slide-algo-looping-python.pptx',
    file_size_mb: 11.4,
    status: 'approved',
    contributor_name: 'Tim Dosen Algo UNESA',
    contributor_nim: 'DOSEN-FMIPA',
    is_contributor_verified: true,
    views_count: 310,
    downloads_count: 185,
    created_at: '2026-10-22',
    approved_at: '2026-10-22',
    preview_content: `MODUL KULIAH 05: KONTROL ALUR PROGRAM
Topik Utama:
- Struktur Percabangan Bersarang (Nested If-Elif-Else)
- Analisis Kondisi Kompleks (Boolean Operators: and, or, not)
- Perulangan Terkendali Pencacah (For Loops dengan range())
- Perulangan Terkondisi (While Loops & Break/Continue flags)
- Praktik Terbaik: Menghindari Nested Loop berkedalaman > 3`,
  },
  // Algoritma - Bab 2
  {
    id: 'm4',
    course_id: 'c2',
    chapter_id: 'ch6',
    course_name: 'Algoritma & Pemrograman',
    course_code: 'SD102',
    chapter_title: 'Struktur Data Dasar: List, Tuple & Dict',
    title: 'Cheat Sheet Sintaks List, Dict, Tuple & Lambda Python',
    description: 'Panduan saku 3 halaman berisi method bawaan python, kompleksitas waktu O(1) vs O(n), list slicing tricks, dan lambda sorting.',
    category: 'summary_notes',
    file_type: 'docx',
    file_name: 'cheatsheet-python-datastruct.docx',
    file_size_mb: 1.6,
    status: 'approved',
    contributor_name: 'Kevin Prasetya',
    contributor_nim: '24051204044',
    is_contributor_verified: true,
    views_count: 512,
    downloads_count: 388,
    created_at: '2026-10-28',
    approved_at: '2026-10-29',
    preview_content: `PYTHON DATA STRUCTURE QUICK REFERENCE
List: Mutable, Ordered -> [x, y, z]
- Append: O(1) | Insert at 0: O(n) | Slicing: lst[start:end:step]

Dictionary: Key-Value, Hash Map -> {"key": val}
- Lookup by key: O(1) avg
- .get(key, default) menghindari KeyError!

Tuple: Immutable -> (x, y)
- Sangat efisien untuk data konfigurasi konstan & tuple unpacking.`,
  },
  // Pengantar Sains Data - Bab 2
  {
    id: 'm5',
    course_id: 'c3',
    chapter_id: 'ch9',
    course_name: 'Pengantar Sains Data',
    course_code: 'SD103',
    chapter_title: 'Data Wrangling & Eksplorasi (Pandas & Seaborn)',
    title: 'Panduan Praktikum EDA & Visualisasi Data dengan Seaborn',
    description: 'Langkah praktis eksplorasi dataset Titanic: data cleaning, imputasi missing value dengan median group, dan visualisasi distribusi facet grid.',
    category: 'lecture_slides',
    file_type: 'pdf',
    file_name: 'modul-praktikum-eda-seaborn.pdf',
    file_size_mb: 7.9,
    status: 'approved',
    contributor_name: 'Lab Sains Data UNESA',
    contributor_nim: 'LAB-SD-2024',
    is_contributor_verified: true,
    views_count: 380,
    downloads_count: 224,
    created_at: '2026-11-02',
    approved_at: '2026-11-03',
    preview_content: `PANDUAN EKSPLORASI DATASET (EDA)
Framework 5 Langkah Lab Sains Data:
1. Inspeksi Metadata: df.info(), df.describe(include='all')
2. Audit Nilai Hilang: df.isnull().sum() / len(df) * 100
3. Analisis Univariat: Histogram skewness + Boxplot IQR
4. Analisis Bivariat: Scatter plot, Pairplot, Heatmap Korelasi Pearson
5. Dokumentasi Temuan Hipotesis Awal`,
  },
  // Statistika Dasar - Bab 3
  {
    id: 'm6',
    course_id: 'c4',
    chapter_id: 'ch13',
    course_name: 'Statistika Dasar',
    course_code: 'SD104',
    chapter_title: 'Distribusi Normal & Uji Hipotesis Dasar',
    title: 'Ringkasan Uji Hipotesis Z-Test & T-Test Satu Sampel',
    description: 'Tabel panduan cepat pemilihan uji parametrik, rumus derajat bebas (df), cara membaca tabel T, dan contoh keputusan tolak/gagal tolak H0.',
    category: 'summary_notes',
    file_type: 'pdf',
    file_name: 'ringkasan-uji-hipotesis-statistik.pdf',
    file_size_mb: 3.4,
    status: 'approved',
    contributor_name: 'Alya Putri',
    contributor_nim: '23051204012',
    is_contributor_verified: true,
    views_count: 295,
    downloads_count: 160,
    created_at: '2026-11-05',
    approved_at: '2026-11-06',
    preview_content: `UJI HIPOTESIS PARAMETRIK: PANDUAN KEPUTUSAN
Kapan Menggunakan Z-Test?
- Varians populasi (sigma^2) DIKETAHUI, ATAU
- Ukuran sampel n >= 30 (Teorema Limit Pusat)

Kapan Menggunakan T-Test?
- Varians populasi (sigma^2) TIDAK DIKETAHUI
- Ukuran sampel kecil n < 30
- Derajat bebas: df = n - 1

Kriteria Tolak H0:
- Jika p-value < alpha (misal alpha = 0.05), maka Tolak H0 (Ada signifikansi statistik).`,
  },

  // PRE-SEEDED PENDING SUBMISSIONS FOR ADMIN REVIEW QUEUE
  {
    id: 'm7',
    course_id: 'c1',
    chapter_id: 'ch4',
    course_name: 'Kalkulus I',
    course_code: 'SD101',
    chapter_title: 'Aplikasi Turunan & Nilai Ekstrem',
    chapter_number: 4,
    title: 'Catatan Tangan Teorema Nilai Rata-Rata & Optimasi Ekstrem',
    description: 'Ringkasan visual bertinta rapi mengenai uji turunan kedua f\'\'(x) untuk mencari titik balik, titik belok kurva, dan contoh persoalan optimasi volume kotak.',
    category: 'summary_notes',
    file_type: 'pdf',
    file_name: 'catatan-teorema-nilai-rata-rata.pdf',
    file_size_mb: 3.8,
    status: 'pending',
    contributor_name: 'Budi Santoso',
    contributor_nim: '24051204088',
    is_contributor_verified: false,
    views_count: 0,
    downloads_count: 0,
    created_at: '2026-11-14',
    preview_content: `Draft Preview Pengajuan:
- Teorema Rolle: Jika f kontinu pada [a, b], terturunkan pada (a, b), dan f(a) = f(b), maka ada c di mana f'(c) = 0.
- Teorema Nilai Rata-rata (MVT): f'(c) = [f(b) - f(a)] / (b - a).
- Dilengkapi sketsa grafik berwarna dan 4 soal optimasi.`,
  },
  {
    id: 'm8',
    course_id: 'c2',
    chapter_id: 'ch5',
    course_name: 'Algoritma & Pemrograman',
    course_code: 'SD102',
    chapter_title: 'Logika Pemrograman & Flowchart Terstruktur',
    chapter_number: 1,
    title: 'Kompilasi Soal Kuis Algoritma Week 1-4 beserta Trace Table',
    description: 'Bank latihan mandiri untuk persiapan kuis pertama. Menguji pemahaman dry-run variabel memory pada flowchart perulangan bertingkat.',
    category: 'practice_questions',
    file_type: 'pdf',
    file_name: 'kuis-algoritma-dryrun-trace.pdf',
    file_size_mb: 2.3,
    status: 'pending',
    contributor_name: 'Farhan Maulana',
    contributor_nim: '24051204031',
    is_contributor_verified: false,
    views_count: 0,
    downloads_count: 0,
    created_at: '2026-11-14',
    preview_content: `Draft Preview Pengajuan:
- 10 Soal tracing tabel variabel loop
- Studi kasus deret Fibonacci tanpa rekursi
- Analisis algoritma ganjil-genap biner`,
  },
  {
    id: 'm9',
    course_id: 'c3',
    chapter_id: 'ch8',
    course_name: 'Pengantar Sains Data',
    course_code: 'SD103',
    chapter_title: 'Ekosistem Sains Data & Metodologi CRISP-DM',
    chapter_number: 1,
    title: 'Slide Presentasi Studi Kasus CRISP-DM pada Retail E-Commerce',
    description: 'Deck presentasi tugas kelompok analisis alur CRISP-DM pada prediksi churn customer Tokopedia, mencakup diagram pipeline dan data dictionary.',
    category: 'lecture_slides',
    file_type: 'pptx',
    file_name: 'crisp-dm-ecommerce-study.pptx',
    file_size_mb: 8.7,
    status: 'pending',
    contributor_name: 'Nabila Kusuma',
    contributor_nim: '24051204015',
    is_contributor_verified: true,
    views_count: 0,
    downloads_count: 0,
    created_at: '2026-11-15',
    preview_content: `Draft Preview Pengajuan:
- Fase 1: Business Understanding (Penurunan churn 5%)
- Fase 2: Data Understanding (Log transaksi & review)
- Fase 3: Data Preparation (RFM segmentation)
- Fase 4-6: Modeling, Evaluation, Deployment plan`,
  },

  // PRE-SEEDED REJECTED SUBMISSION (To demo Contributor rejection feedback drawer)
  {
    id: 'm10',
    course_id: 'c1',
    chapter_id: 'ch1',
    course_name: 'Kalkulus I',
    course_code: 'SD101',
    chapter_title: 'Sistem Bilangan Real & Pertidaksamaan',
    chapter_number: 1,
    title: 'Foto Catatan Tulis Tangan Rumus Pertidaksamaan Nilai Mutlak',
    description: 'Foto lembar catatan buku tulis bab 1 halaman 1-5.',
    category: 'summary_notes',
    file_type: 'pdf',
    file_name: 'catatan-foto-bab1.pdf',
    file_size_mb: 1.2,
    status: 'rejected',
    rejection_reason: 'Foto catatan tidak terbaca dengan jelas (pencahayaan redup dan miring) serta halaman 3 terpotong. Mohon gunakan aplikasi pemindai dokumen (seperti CamScanner atau Adobe Scan) agar tulisan tajam, kontras tinggi, dan berformat dokumen tegak sebelum diajukan kembali.',
    contributor_name: 'Dimas Arya',
    contributor_nim: '24051204001',
    is_contributor_verified: true,
    views_count: 0,
    downloads_count: 0,
    created_at: '2026-11-10',
    preview_content: `Catatan ini ditolak oleh Admin Kurikulum FMIPA UNESA pada 11 Nov 2026.`,
  },
];

export const INITIAL_LEARNING_GAPS: LearningGapSignal[] = [
  {
    id: 'gap1',
    course_id: 'c1',
    course_name: 'Kalkulus I',
    course_code: 'SD101',
    chapter_id: 'ch4',
    chapter_title: 'Aplikasi Turunan & Nilai Ekstrem',
    chapter_number: 4,
    materials_available: 0,
    student_search_volume: 342,
    gap_severity: 'critical',
    suggested_action: '342 pencarian minggu ini tanpa materi terverifikasi. Rekrut asisten dosen untuk mengunggah catatan optimasi & kurva.',
  },
  {
    id: 'gap2',
    course_id: 'c3',
    course_name: 'Pengantar Sains Data',
    course_code: 'SD103',
    chapter_id: 'ch10',
    chapter_title: 'Pengantar Machine Learning & Evaluasi Model',
    chapter_number: 3,
    materials_available: 0,
    student_search_volume: 289,
    gap_severity: 'critical',
    suggested_action: 'Materi persiapan UAS Sains Data belum tersedia. Minta dosen pengampu Prof. Agus mengunggah slide komparasi supervised vs unsupervised.',
  },
  {
    id: 'gap3',
    course_id: 'c2',
    course_name: 'Algoritma & Pemrograman',
    course_code: 'SD102',
    chapter_id: 'ch5',
    chapter_title: 'Logika Pemrograman & Flowchart Terstruktur',
    chapter_number: 1,
    materials_available: 0,
    student_search_volume: 178,
    gap_severity: 'moderate',
    suggested_action: 'Mahasiswa baru sering mencari template flowchart ISO standar. Ada 1 materi pending di antrean moderasi.',
  },
  {
    id: 'gap4',
    course_id: 'c4',
    course_name: 'Statistika Dasar',
    course_code: 'SD104',
    chapter_id: 'ch12',
    chapter_title: 'Teori Peluang & Distribusi Probabilitas Diskrit',
    chapter_number: 2,
    materials_available: 0,
    student_search_volume: 154,
    gap_severity: 'moderate',
    suggested_action: 'Topik Teorema Bayes dan Distribusi Binomial memerlukan latihan soal terstruktur dengan kunci pembahasan.',
  },
];
