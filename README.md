<div align="center">
  <img src="https://img.freepik.com/free-vector/kids-studying-from-home-concept-illustration_114360-3286.jpg" alt="Pintar Cilik Banner" width="100%" height="auto" style="border-radius: 20px; object-fit: cover; max-height: 300px;">

  <h1 style="margin-top: 20px; font-size: 3rem;">PintarCilik 🎓</h1>

  <p>
    <strong>Aplikasi Belajar Interaktif untuk Anak Usia Dini</strong><br>
    <em>Membaca, Berhitung, dan Logika dengan sentuhan AI & Gamifikasi.</em>
  </p>

  <p>
    <a href="https://calistung.ednasalam.com">
      <img src="https://img.shields.io/badge/Live_Demo-calistung.ednasalam.com-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Tech_Stack-React_%7C_Vite_%7C_Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Tech Stack">
    <img src="https://img.shields.io/badge/AI_Powered-Gemini_2.0-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="AI Powered">
  </p>
</div>

---

## 📖 Tentang Projek

**PintarCilik** adalah platform edukasi interaktif yang dirancang khusus untuk anak-anak prasekolah hingga sekolah dasar awal. Aplikasi ini menggabungkan metode belajar sambil bermain (*learning by doing*) dengan teknologi modern untuk memantau perkembangan anak.

### ✨ Fitur Unggulan

- 🎮 **3 Mode Permainan**:
  - **Membaca**: Mengenal huruf, suku kata, dan benda.
  - **Berhitung**: Operasi matematika dasar dengan visual menarik.
  - **Logika**: Asah kemampuan berpikir kritis dan pola.
- 🤖 **Laporan Pintar (AI)**: Menggunakan **Google Gemini 2.0** untuk menganalisis riwayat bermain anak dan memberikan saran personal kepada orang tua.
- 🏆 **Sistem Gamifikasi**: Level (Pemula, Menengah, Mahir), Skor, dan Avatar untuk memotivasi anak.
- 🔐 **Login Aman**: Integrasi **Google Auth** via Supabase untuk menyimpan *progress* belajar dengan aman.
- 📱 **Mobile Friendly**: Desain responsif yang nyaman digunakan di Tablet maupun Smartphone.

---

## 🛠️ Teknologi yang Digunakan

Project ini dibangun dengan *stack* modern untuk performa tinggi dan pengembangan yang cepat:

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) (TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Artificial Intelligence**: [Google Gemini API](https://ai.google.dev/) (via Vercel Serverless Functions)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan aplikasi di komputer Anda:

### 1. Clone Repository
```bash
git clone https://github.com/aqles/Pintar-Calistung.git
cd Pintar-Calistung
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root folder dan isi dengan kredensial Anda (lihat `.env.example`):

```env
# Supabase Configuration (Dari Dashboard Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API (Simpan di .env lokal, jangan commit!)
GEMINI_API_KEY=your-secure-api-key
```

> **Catatan Penting**: Untuk development lokal, jika ingin mencoba fitur AI, pastikan Anda menyesuaikan endpoint API atau menjalankannya via `vercel dev` untuk mendukung Serverless Functions.

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser dan akses `http://localhost:3000`.

---

## 🌐 Deployment (Vercel)

Aplikasi ini dioptimalkan untuk Vercel.

1.  Push kode ke GitHub.
2.  Import project di Dashboard Vercel.
3.  Masukkan **Environment Variables** di pengaturan Vercel:
    -   `GEMINI_API_KEY`
    -   `SUPABASE_URL`
    -   `SUPABASE_ANON_KEY`
4.  Deploy!

---

## 🔒 Keamanan

- **API Key Protection**: API Key Gemini **tidak pernah** diekspos ke sisi klien. Permintaan diproses melalui *Serverless Function* (`api/gemini-report.ts`).
- **Data User**: Autentikasi dan database dikelola oleh Supabase dengan kebijakan RLS (*Row Level Security*) yang ketat (opsional, disarankan untuk diaktifkan di sisi database).

---

## 🤝 Kontribusi

Ingin berkontribusi? Silakan buat *Pull Request* atau laporkan *issue* jika menemukan *bug*. Ide-ide kreatif untuk fitur baru sangat diterima!

---

<div align="center">
  <p>Dibuat dengan ❤️ dari Aql untuk pendidikan Indonesia.</p>
  <p>© 2025 PintarCilik Project</p>
</div>
