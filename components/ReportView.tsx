import React, { useState } from 'react';
import { GameResult, UserProfile } from '../types';
import { generateParentReport } from '../services/geminiService';
import { Button, Card } from './UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrainCircuit, Loader2, Download, Share2, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
    history: GameResult[];
    user: UserProfile;
    onBack: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ history, user, onBack }) => {
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateAI = async () => {
        setLoading(true);
        const report = await generateParentReport(history, user.name);
        setAiReport(report);
        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Laporan Perkembangan ${user.name}`,
                    text: `Lihat laporan perkembangan belajar ${user.name} di PintarCilik!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            alert('Fitur share tidak didukung di browser ini.');
        }
    };

    // Prepare data for Recharts (group by date)
    // Simplified grouping for demo purposes
    const chartData = history.map((h, idx) => ({
        name: `Game ${idx + 1}`,
        Skor: h.score,
        Kategori: h.category
    }));

    return (
        <div className="max-w-4xl mx-auto w-full pb-20">
            <div className="flex items-center justify-between mb-6 print:hidden">
                <div className="flex items-center">
                    <button onClick={onBack} className="bg-white p-2 rounded-full shadow hover:bg-gray-100 mr-4">
                        &larr;
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">Laporan Perkembangan</h2>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} variant="secondary" className="flex items-center gap-2">
                        <Printer size={18} />
                        <span className="hidden md:inline">Cetak / Simpan PDF</span>
                    </Button>
                    <Button onClick={handleShare} variant="primary" className="flex items-center gap-2">
                        <Share2 size={18} />
                        <span className="hidden md:inline">Bagikan</span>
                    </Button>
                </div>
            </div>

            <div className="hidden print:block mb-8 text-center border-b pb-4">
                <h1 className="text-3xl font-bold text-indigo-600">PintarCilik</h1>
                <p className="text-gray-500">Laporan Perkembangan Siswa</p>
                <p className="text-lg font-semibold mt-2">{user.name}</p>
                <p className="text-sm text-gray-400">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Basic Stats */}
                <Card color="bg-white">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Statistik Umum</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-gray-600">Total Permainan</span>
                            <span className="font-bold text-2xl text-blue-600">{history.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-gray-600">Rata-rata Skor</span>
                            <span className="font-bold text-2xl text-green-600">
                                {Math.round(history.reduce((a, b) => a + b.score, 0) / Math.max(1, history.length))}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Chart */}
                <Card color="bg-white" className="h-[300px]">
                    <h3 className="text-xl font-bold mb-2 text-gray-700">Grafik Skor</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Skor" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* AI Section */}
            <Card color="bg-gradient-to-br from-purple-50 to-indigo-50" className="border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="text-indigo-600" size={32} />
                    <h3 className="text-2xl font-bold text-indigo-800">Analisis Cerdas (AI)</h3>
                </div>

                {!aiReport && !loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-6">Dapatkan analisis mendalam tentang perkembangan {user.name} dan saran aktivitas dari AI.</p>
                        <Button onClick={handleGenerateAI} variant="secondary" className="w-full md:w-auto mx-auto">
                            Buat Laporan Bulanan
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                        <p className="text-indigo-600 font-medium">Sedang menganalisis data belajar...</p>
                    </div>
                )}

                {aiReport && (
                    <div className="bg-white rounded-xl p-6 shadow-inner text-gray-700 leading-relaxed animate-fade-in print:shadow-none print:p-0">
                        <div className="prose prose-indigo max-w-none">
                            <ReactMarkdown>{aiReport}</ReactMarkdown>
                        </div>
                        <div className="mt-6 text-center">
                            <Button onClick={() => setAiReport(null)} variant="primary" className="text-sm py-2">
                                Tutup Laporan
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Footer Signature - Visible only in Print or at bottom */}
            <div className="mt-12 text-center print:mt-20">
                <p className="text-gray-600 mb-8">Dibuat dengan kasih sayang oleh,</p>
                <div className="inline-block">
                    <img src="/logo.svg" alt="PintarCilik Logo" className="h-12 w-auto mx-auto mb-2 opacity-50 grayscale" />
                    <p className="font-bold text-xl text-indigo-800">Tim PintarCilik</p>
                </div>
            </div>

            {/* Hide close button when printing */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .max-w-4xl { max-width: 100% !important; margin: 0; padding: 0; }
        }
      `}</style>
        </div>
    );
};

export default ReportView;