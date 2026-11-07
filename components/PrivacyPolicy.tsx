import React from 'react';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import { Button } from './UI';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 pb-20">
            <div className="max-w-2xl mx-auto animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition border border-gray-100"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-green-500" /> Kebijakan Privasi
                    </h1>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    <section>
                        <h2 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <Lock size={20} className="text-indigo-500" /> Pengumpulan Data
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Di PintarCilik, keamanan privasi anak adalah prioritas utama kami. Kami hanya mengumpulkan data minimal yang diperlukan untuk fungsionalitas aplikasi, seperti:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm">
                            <li>Nama panggilan (untuk personalisasi).</li>
                            <li>Progress belajar (skor dan level).</li>
                            <li>Informasi login Google (jika digunakan).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <Eye size={20} className="text-indigo-500" /> Penggunaan Informasi
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Informasi yang kami kumpulkan hanya digunakan untuk:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm">
                            <li>Menyimpan kemajuan belajar anak.</li>
                            <li>Menampilkan laporan belajar untuk orang tua.</li>
                            <li>Meningkatkan kualitas materi pembelajaran.</li>
                        </ul>
                        <p className="text-gray-600 mt-2 text-sm font-semibold">
                            Kami TIDAK menjual data pribadi kepada pihak ketiga.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-indigo-900 mb-2">Hubungi Kami</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Jika Ayah/Bunda memiliki pertanyaan seputar privasi, silakan hubungi kami di pintarcilik@ednasalam.com.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">Terakhir diperbarui: Desember 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
