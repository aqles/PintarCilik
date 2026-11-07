import React from 'react';
import { ArrowLeft, Heart, Users, Star } from 'lucide-react';
import { CHANGELOGS } from './changelogs';

interface AboutUsProps {
    onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6 pb-20">
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
                        <Heart className="text-pink-500" /> Tentang Kami
                    </h1>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8 text-center">

                    <div className="flex justify-center">
                        <div className="bg-indigo-100 p-4 rounded-full">
                            <img src="/logo.svg" alt="PintarCilik" className="w-20 h-20" />
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-indigo-900 mb-3">Misi Kami</h2>
                        <p className="text-gray-600 leading-relaxed">
                            <span className="font-bold text-indigo-600">PintarCilik</span> hadir untuk membuat pengalaman belajar membaca, berhitung, dan logika menjadi petualangan yang menyenangkan bagi anak-anak Indonesia.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                            <Star className="text-orange-500 mx-auto mb-2" />
                            <h3 className="font-bold text-gray-800">Menyenangkan</h3>
                            <p className="text-xs text-gray-500 mt-1">Belajar sambil bermain game interaktif.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <Users className="text-blue-500 mx-auto mb-2" />
                            <h3 className="font-bold text-gray-800">Ramah Anak</h3>
                            <p className="text-xs text-gray-500 mt-1">Desain aman, penuh warna, dan mudah digunakan.</p>
                        </div>
                    </div>

                    {/* Change Logs Section */}
                    <section className="text-left space-y-4">
                        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                            <span className="text-2xl">📝</span> Riwayat Perubahan
                        </h2>
                        <div className="space-y-6">
                            {CHANGELOGS.map((log) => (
                                <div key={log.version} className="border-l-4 border-indigo-200 pl-4 py-1 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">v{log.version}</h3>
                                            {log.title && <p className="text-sm text-indigo-600 font-medium">{log.title}</p>}
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{log.date}</span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        {log.features.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 flex items-center gap-1">✨ Fitur Baru</h4>
                                                <ul className="list-disc list-inside text-gray-600 ml-1">
                                                    {log.features.map((item, idx) => <li key={idx}>{item}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {log.improvements.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 flex items-center gap-1">🚀 Peningkatan</h4>
                                                <ul className="list-disc list-inside text-gray-600 ml-1">
                                                    {log.improvements.map((item, idx) => <li key={idx}>{item}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {log.fixes.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 flex items-center gap-1">🐛 Perbaikan</h4>
                                                <ul className="list-disc list-inside text-gray-600 ml-1">
                                                    {log.fixes.map((item, idx) => <li key={idx}>{item}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="text-left bg-gray-50 p-4 rounded-2xl">
                        <h3 className="font-bold text-gray-900 mb-2">Tim Kami</h3>
                        <p className="text-sm text-gray-600">
                            Dikembangkan dengan cinta oleh tim pengembang dan edukator yang percaya bahwa setiap anak adalah bintang kecil yang siap bersinar.
                        </p>
                    </section>

                    <div className="pt-4 text-xs text-gray-400">
                        &copy; 2025 PintarCilik. All rights reserved.
                        <div className="mt-1">
                            Part of <a href="https://ednasalam.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">EdnaSalam.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
