export interface ChangeLogEntry {
    version: string;
    date: string;
    title?: string;
    features: string[];
    fixes: string[];
    improvements: string[];
}

export const CHANGELOGS: ChangeLogEntry[] = [
    {
        version: "2.2.1",
        date: "Oktober 2026",
        title: "Ilustrasi Header Cerita",
        features: [
            "Header seksi Cerita di beranda kini memakai ilustrasi khusus (anak + tumpukan buku cerita + burung hantu), melengkapi tiga header bidang lainnya yang sudah bergambar"
        ],
        fixes: [],
        improvements: []
    },
    {
        version: "2.2.0",
        date: "Oktober 2026",
        title: "Lebih Banyak Game, Cerita & Area Orang Tua",
        features: [
            "Gerbang Orang Tua: Laporan, Profil, dan ganti level kini dibuka dengan soal tambah sederhana, berlaku selama sesi login",
            "Lencana di Perjalananku: Langkah Pertama, Pemburu Bintang, Nilai Sempurna, Rajin 3 Hari, Seminggu Penuh",
            "Game baru: Menulis Huruf (telusuri huruf di kanvas dengan jari), Susun Kata (urutkan huruf jadi kata), Tebak dari Ciri (24 teka-teki)",
            "Cerita: 7 cerita pendek orisinal yang dibacakan TTS per bagian, tanpa skor dan tanpa simpan riwayat, masing-masing dengan ilustrasi sampul hasil generate AI, plus maskot burung hantu PintarCilik di beranda dan halaman awal, menu beranda dikelompokkan per bidang (Membaca, Berhitung & Ukuran, Logika & Bentuk, Cerita) dengan ilustrasi tiap bidang, dan layar selesai permainan memakai ilustrasi perayaan",
            "Laporan bisa dicetak / disimpan sebagai PDF (tombol bawaan v1, diverifikasi masih ada — tidak didobel)",
            "Avatar kustom dari satu kata (ilustrasi DiceBear) dan saklar kenyamanan: teks lebih besar, kurangi gerakan",
            "Total permainan kini 10, ditambah Cerita"
        ],
        fixes: [],
        improvements: [
            "Profil multi-anak belum dibangun di batch ini: butuh migrasi skema di proyek Supabase bersama, dirancang dulu sebelum dieksekusi"
        ]
    },
    {
        version: "2.1.1",
        date: "Oktober 2026",
        title: "Perbaikan, Profil & Game Baru",
        features: [
            "Halaman Profil baru: ubah nama, umur, dan avatar (8 pilihan) dari Beranda, tersimpan ke Supabase; gagal simpan membatalkan perubahan, bukan menyimpan setengah-setengah",
            "3 game baru: Warna & Bentuk (8 warna, 6 bentuk), Besar & Kecil (pilih sisi yang lebih besar/kecil), Kartu Memori (4 pasang, balik kartu)",
            "Beranda lebih ramai: kartu Perjalananku (total permainan, rata-rata skor, streak hari beruntun), misi harian main 3 permainan, dan menu game 2 kolom di tablet"
        ],
        fixes: [
            "Tombol bunyi jawaban dan tombol dengarkan instruksi tidak lagi memakai ikon speaker yang sama: bunyi jawaban kini lonceng (Bell/BellOff), dengarkan tetap speaker, dan keduanya berlabel teks Bunyi dan Dengar",
            "Permainan tidak lagi mental sendiri ke beranda saat sesi login diperbarui (mis. kembali dari background HP): pembaruan sesi kini memuat ulang data diam-diam tanpa pindah layar"
        ],
        improvements: [
            "Judul game kini satu baris penuh di atas tombol, jadi tidak terjepit tombol di layar sempit",
            "Ikon jawaban di tombol opsi diperbesar (emoji 60-72px, angka/huruf 48-60px), opsi pendek selalu 3 kolom, area game dan beranda melebar di tablet, tinggi layar memakai dvh dan safe-area agar nyaman di HP/tablet"
        ]
    },
    {
        version: "2.1.0",
        date: "Oktober 2026",
        title: "Bank Soal Membesar + Game Baru",
        features: [
            "Game baru: Huruf & Benda (pilih gambar dari huruf depannya, memakai bank kata yang sama)",
            "Bank kata 108 menjadi 168 kata unik (profesi, rumah, hewan, makanan, benda, tempat)",
            "Kalimat template: subjek x kata kerja x tempat, jadi ratusan kombinasi kalimat",
            "Fitur bunyi jawaban gratis (WebAudio, tanpa file) dengan tombol mute di tiap game",
            "Fitur bintang di beranda: hitungan permainan dengan skor 80+"
        ],
        fixes: [
            "Game Huruf tidak memakai gambar yang dipakai dua kata (AYAH/PAMAN, IBU/BIBI) agar tidak ambigu"
        ],
        improvements: [
            "Kalimat dan bandingkan angka yang tadinya hanya di MAHIR kini benar-benar muncul di Menengah"
        ]
    },
    {
        version: "2.0.0",
        date: "Oktober 2026",
        title: "Rebuild PintarCilik",
        features: [
            "Soal dari generator lokal, laporan orang tua dari agregasi lokal",
            "GameShell tunggal untuk 3 game: skor benar/total soal, tanpa auto-lanjut timer",
            "Audio gratis: tombol speaker TTS browser (id-ID) di tiap soal",
            "Level untuk usia 4-6 tahun: hanya Pemula dan Menengah (MAHIR dipetakan ke Menengah)",
            "Bank soal diperluas untuk usia 4-6: 108 kata baca (dari 50), 22 lawan kata (dari 14), 27 kalimat (dari 17), soal cerita tambah/kurang bervariasi, bandingkan angka di Menengah, pola logika ABB/AABB, dan kategori cuaca/alam di cari-yang-berbeda"
        ],
        fixes: [
            "Skor tidak lagi +20 per soal dan total hardcode 100",
            "Soal mustahil diperbaiki (huruf-hilang spasi, distraktor negatif, data nyasar)",
            "Error database dibedakan dari profil kosong; simpan tidak lagi fire-and-forget",
            "Auth load tidak lagi nyangkut: paralel, ada catch, guard stale dan load ganda",
            "Skema + RLS Supabase ditulis dan diterapkan (lihat supabase/schema.sql)"
        ],
        improvements: [
            "Jawaban salah menampilkan jawaban benar + tombol Lanjut",
            "Keluar/soal baru dikonfirmasi; tombol Simpan sekali dan bisa retry bila gagal",
            "Aksesibilitas: tombol 44px, progressbar ber-aria, fokus keyboard, prefers-reduced-motion",
            "PWA: runtime caching font, laporan di-lazy-load (bundle utama mengecil)"
        ]
    },
    {
        version: "1.4.0",
        date: "Desember 2025",
        title: "Unlimited AI Questions",
        features: [
            "Fitur 'Buat Soal Baru dengan AI' (Unlimited Questions)",
            "Integrasi Gemini AI real-time untuk Reading, Math, & Logic",
            "Sistem loading interaktif saat AI membuat soal"
        ],
        fixes: [],
        improvements: [
            "Optimasi performa UI saat mengambil data AI",
            "Penambahan indikator 'AI Generated' pada kartu soal"
        ]
    },
    {
        version: "1.3.0",
        date: "Desember 2025",
        title: "Massive Content Expansion",
        features: [
            "Bank Soal Masif: Warna, Bentuk, Hewan, Kendaraan, dll.",
            "Matematika: Soal Cerita (Word Problems) & Operasi Campuran",
            "Logika: Pola Bentuk (Shapes) & Kategori Visual"
        ],
        fixes: [],
        improvements: [
            "Refactoring kode generator ke folder 'utils'",
            "Peningkatan algoritma adaptasi kesulitan (Pemula/Menengah/Mahir)"
        ]
    },
    {
        version: "1.2.0",
        date: "Desember 2025",
        title: "PWA, Reports & Changelogs",
        features: [
            "PWA Installability (Android & iOS support)",
            "Offline mode support",
            "Fitur Riwayat Perubahan (Change Logs)"
        ],
        fixes: [
            "Resolved 'missing module' build errors",
            "Fixed StrictMode JSX syntax error"
        ],
        improvements: [
            "Added custom icons and splash screens",
            "Updated application manifest",
            "Peningkatan format Laporan AI (Rata Kiri-Kanan)",
            "Penghapusan signature default pada laporan AI"
        ]
    },
    {
        version: "1.1.0",
        date: "Desember 2025",
        title: "Google Login Integration",
        features: [
            "Google Login integration for easier access",
            "Report History feature"
        ],
        fixes: [],
        improvements: [
            "Refined Landing Page UI",
            "New Logo implementation",
            "Mobile responsive adjustments"
        ]
    },
    {
        version: "1.0.0",
        date: "Desember 2025",
        title: "Initial Release",
        features: [
            "Belajar Membaca (Image & Word Matching)",
            "Belajar Berhitung (Addition, Subtraction, Counting)",
            "Belajar Logika (Pattern & Odd One Out)",
            "Gemini AI Integration for Progress Reports",
            "User Profile Management"
        ],
        fixes: [],
        improvements: [
            "Kid-friendly UI/UX design",
            "Interactive feedback system"
        ]
    }
];
