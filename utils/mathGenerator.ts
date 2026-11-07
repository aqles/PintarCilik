import { DifficultyLevel, MathQuestion } from '../types';

export const generateMathQuestions = (level: DifficultyLevel, count: number = 5): MathQuestion[] => {
    const questions: MathQuestion[] = [];

    for (let i = 0; i < count; i++) {
        let q: MathQuestion;
        const id = `m-${Date.now()}-${i}`;

        if (level === DifficultyLevel.PEMULA) {
            if (Math.random() > 0.4) {
                // Expanded range up to 20 for Pemula
                const num = Math.floor(Math.random() * 10) + 1; // PAUD: hitung 1-10 di PEMULA
                const options = [num, num + 1, Math.max(1, num - 1)].sort(() => Math.random() - 0.5);
                const visualTypes = ['star', 'apple', 'ball', 'flower'];
                const visualType = visualTypes[Math.floor(Math.random() * visualTypes.length)];

                q = {
                    id,
                    question: "Ada berapa jumlah gambar ini?",
                    answer: num,
                    options: Array.from(new Set(options)),
                    visualItems: [{ type: visualType, count: num }],
                    type: 'COUNT'
                };
            } else {
                const start = Math.floor(Math.random() * 10) + 1;
                const missingIdx = Math.floor(Math.random() * 3);
                const seq = [start, start + 1, start + 2];
                const ans = seq[missingIdx];
                seq[missingIdx] = -1;

                const questionStr = seq.map(s => s === -1 ? '?' : s).join(' - ');
                q = {
                    id,
                    question: `Lengkapi: ${questionStr}`,
                    answer: ans,
                    options: [ans, ans + 2, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5),
                    type: 'SEQUENCE'
                };
            }
        } else if (level === DifficultyLevel.MENENGAH) {
            const rand = Math.random();

            if (rand < 0.2) {
                // Soal cerita bervariasi: tambah dan kurang, benda sehari-hari
                const templates = [
                    (a: number, b: number) => ({ text: `Ibu beli ${a} apel, Ayah beli ${b} apel. Berapa jumlahnya?`, ans: a + b, type: 'ADD' as const }),
                    (a: number, b: number) => ({ text: `Siti punya ${a} kelereng, diberi ${b} lagi. Berapa kelereng Siti sekarang?`, ans: a + b, type: 'ADD' as const }),
                    (a: number, b: number) => ({ text: `Di piring ada ${a} permen, dimakan ${b}. Sisa berapa?`, ans: a - b, type: 'SUB' as const }),
                    (a: number, b: number) => ({ text: `Budi punya ${a} buku, dipinjamkan ${b}. Sisa berapa?`, ans: a - b, type: 'SUB' as const }),
                ];
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * a) + 1; // b <= a agar kurang tidak negatif
                const picked = templates[Math.floor(Math.random() * templates.length)](a, b);
                q = {
                    id,
                    question: picked.text,
                    answer: picked.ans,
                    options: [picked.ans, picked.ans + 1, Math.max(0, picked.ans - 1)].sort(() => Math.random() - 0.5),
                    type: picked.type
                };
            } else if (rand < 0.45) {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1; // PAUD: jumlah maks 20
                const ans = a + b;
                q = { id, question: `${a} + ${b} = ?`, answer: ans, options: [ans, ans + 2, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5), type: 'ADD' };
            } else if (rand < 0.7) {
                const a = Math.floor(Math.random() * 30) + 5;
                const b = Math.floor(Math.random() * a);
                const ans = a - b;
                q = { id, question: `${a} - ${b} = ?`, answer: ans, options: [ans, ans + 1, Math.max(0, ans - 2)].sort(() => Math.random() - 0.5), type: 'SUB' };
            } else if (rand < 0.85) {
                // Pattern +2, +3, +5
                const step = [2, 3, 5][Math.floor(Math.random() * 3)];
                const start = Math.floor(Math.random() * 10) + 1;
                const seq = [start, start + step, start + step * 2, start + step * 3];
                const missingIdx = Math.floor(Math.random() * 4);
                const ans = seq[missingIdx];
                seq[missingIdx] = -1;
                q = {
                    id,
                    question: `Pola (+${step}): ${seq.map(s => s === -1 ? '?' : s).join(', ')}`,
                    answer: ans,
                    options: [ans, ans + step, Math.max(0, ans - step)].sort(() => Math.random() - 0.5),
                    type: 'SEQUENCE'
                };
            } else {
                // Membandingkan angka (baru di MENENGAH; tadinya hanya di MAHIR)
                const a = Math.floor(Math.random() * 21);
                const b = Math.floor(Math.random() * 21);
                const ans = a > b ? '>' : (a < b ? '<' : '=');
                q = { id, question: `${a} ... ${b}`, answer: ans, options: ['>', '<', '='], type: 'COMPARE' };
            }
        } else {
            // ADVANCED
            const rand = Math.random();

            if (rand < 0.2) {
                // Word Problem Subtraction
                const a = Math.floor(Math.random() * 10) + 5;
                const b = Math.floor(Math.random() * 5) + 1;
                const ans = a - b;
                q = {
                    id,
                    question: `Ada ${a} burung, terbang ${b}. Sisa berapa?`,
                    answer: ans,
                    options: [ans, ans + 1, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5),
                    type: 'SUB'
                };
            } else if (rand < 0.4) {
                const a = Math.floor(Math.random() * 10) + 2;
                const b = Math.floor(Math.random() * 9) + 2;
                const ans = a * b;
                q = {
                    id,
                    question: `${a} x ${b} = ?`,
                    answer: ans,
                    options: [ans, ans + a, ans - b].sort(() => Math.random() - 0.5),
                    type: 'MULT'
                };
            } else if (rand < 0.6) {
                const b = Math.floor(Math.random() * 9) + 2;
                const ans = Math.floor(Math.random() * 9) + 1;
                const a = b * ans;
                q = {
                    id,
                    question: `${a} : ${b} = ?`,
                    answer: ans,
                    options: [ans, ans + 1, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5),
                    type: 'DIV'
                };
            } else if (rand < 0.8) {
                // Mixed Ops
                const a = Math.floor(Math.random() * 20) + 5;
                const b = Math.floor(Math.random() * 10) + 1;
                const c = Math.floor(Math.random() * 10) + 1;
                const ans = a + b - c;
                q = {
                    id,
                    question: `${a} + ${b} - ${c} = ?`,
                    answer: ans,
                    options: [ans, ans + 2, ans - 2].sort(() => Math.random() - 0.5),
                    type: 'SUB'
                }
            } else {
                const a = Math.floor(Math.random() * 100);
                const b = Math.floor(Math.random() * 100);
                const ans = a > b ? '>' : (a < b ? '<' : '=');
                q = { id, question: `${a} ... ${b}`, answer: ans, options: ['>', '<', '='], type: 'COMPARE' };
            }
        }

        // Ensure distinct options
        q.options = Array.from(new Set(q.options));
        while (q.options.length < 3 && typeof q.answer === 'number') {
            const r = Math.floor(Math.random() * 50) + 1;
            if (!q.options.includes(r) && r !== q.answer) q.options.push(r);
        }
        questions.push(q);
    }
    return questions;
};
