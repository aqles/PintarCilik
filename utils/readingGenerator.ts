import { DifficultyLevel, ReadingQuestion } from '../types';

// Bank kata v2 — diekspor agar game lain (mis. Huruf & Benda) memakai bank yang sama,
// bukan menyalin daftar kata kedua yang bisa berantakan.
export const READING_WORDS = [
        // Fruits & Food
        { word: 'APEL', img: 'emoji:🍎' }, { word: 'PISANG', img: 'emoji:🍌' },
        { word: 'ANGGUR', img: 'emoji:🍇' }, { word: 'JERUK', img: 'emoji:🍊' },
        { word: 'SEMANGKA', img: 'emoji:🍉' }, { word: 'ROTI', img: 'emoji:🍞' },
        { word: 'SUSU', img: 'emoji:🥛' }, { word: 'ES KRIM', img: 'emoji:🍦' },
        { word: 'PERMEN', img: 'emoji:🍬' }, { word: 'COKELAT', img: 'emoji:🍫' },
        { word: 'NASI', img: 'emoji:🍚' }, { word: 'TELUR', img: 'emoji:🥚' },

        // Animals
        { word: 'KUCING', img: 'emoji:🐱' }, { word: 'ANJING', img: 'emoji:🐶' },
        { word: 'AYAM', img: 'emoji:🐔' }, { word: 'BEBEK', img: 'emoji:🦆' },
        { word: 'SAPI', img: 'emoji:🐮' }, { word: 'KAMBING', img: 'emoji:🐐' },
        { word: 'IKAN', img: 'emoji:🐟' }, { word: 'BURUNG', img: 'emoji:🐦' },
        { word: 'GAJAH', img: 'emoji:🐘' }, { word: 'JERAPAH', img: 'emoji:🦒' },
        { word: 'MONYET', img: 'emoji:🐵' }, { word: 'SINGA', img: 'emoji:🦁' },
        { word: 'KELINCI', img: 'emoji:🐰' }, { word: 'KURA', img: 'emoji:🐢' },

        // Objects & Places
        { word: 'BOLA', img: 'emoji:⚽' }, { word: 'BUKU', img: 'emoji:📚' },
        { word: 'RUMAH', img: 'emoji:🏠' }, { word: 'HUTAN', img: 'emoji:🌲' },
        { word: 'LAUT', img: 'emoji:🌊' }, { word: 'GUNUNG', img: 'emoji:🏔️' },
        { word: 'SEKOLAH', img: 'emoji:🏫' }, { word: 'TAMAN', img: 'emoji:⛲' },

        // Transport
        { word: 'MOBIL', img: 'emoji:🚗' }, { word: 'BUS', img: 'emoji:🚌' },
        { word: 'KERETA', img: 'emoji:🚂' }, { word: 'PESAWAT', img: 'emoji:✈️' },
        { word: 'SEPEDA', img: 'emoji:🚲' }, { word: 'KAPAL', img: 'emoji:🚢' },

        // Nature
        { word: 'MATAHARI', img: 'emoji:☀️' }, { word: 'BULAN', img: 'emoji:🌙' },
        { word: 'BINTANG', img: 'emoji:⭐' }, { word: 'AWAN', img: 'emoji:☁️' },
        { word: 'HUJAN', img: 'emoji:🌧️' }, { word: 'PELANGI', img: 'emoji:🌈' },

        // Clothing
        { word: 'BAJU', img: 'emoji:👕' }, { word: 'CELANA', img: 'emoji:👖' },
        { word: 'SEPATU', img: 'emoji:👟' }, { word: 'TOPI', img: 'emoji:🧢' },
        { word: 'MANGGA', img: 'emoji:🥭' }, { word: 'DONAT', img: 'emoji:🍩' },
        { word: 'KEJU', img: 'emoji:🧀' }, { word: 'MADU', img: 'emoji:🍯' },
        { word: 'MIE', img: 'emoji:🍜' }, { word: 'PIZZA', img: 'emoji:🍕' },
        { word: 'BURGER', img: 'emoji:🍔' }, { word: 'KENTANG', img: 'emoji:🥔' },
        { word: 'WORTEL', img: 'emoji:🥕' }, { word: 'TOMAT', img: 'emoji:🍅' },
        { word: 'JAGUNG', img: 'emoji:🌽' }, { word: 'STROBERI', img: 'emoji:🍓' },
        { word: 'LEBAH', img: 'emoji:🐝' }, { word: 'SEMUT', img: 'emoji:🐜' },
        { word: 'ULAT', img: 'emoji:🐛' }, { word: 'KODOK', img: 'emoji:🐸' },
        { word: 'HARIMAU', img: 'emoji:🐯' }, { word: 'ZEBRA', img: 'emoji:🦓' },
        { word: 'PANDA', img: 'emoji:🐼' }, { word: 'KOALA', img: 'emoji:🐨' },
        { word: 'SERIGALA', img: 'emoji:🐺' }, { word: 'RUBAH', img: 'emoji:🦊' },
        { word: 'DOMBA', img: 'emoji:🐑' }, { word: 'KUDA', img: 'emoji:🐴' },
        { word: 'TIKUS', img: 'emoji:🐭' }, { word: 'PENSIL', img: 'emoji:✏️' },
        { word: 'TAS', img: 'emoji:🎒' }, { word: 'PAYUNG', img: 'emoji:☂️' },
        { word: 'KUNCI', img: 'emoji:🔑' }, { word: 'JAM', img: 'emoji:⏰' },
        { word: 'PIRING', img: 'emoji:🍽️' }, { word: 'SENDOK', img: 'emoji:🥄' },
        { word: 'PANTAI', img: 'emoji:🏖️' }, { word: 'KOTA', img: 'emoji:🏙️' },
        { word: 'PASAR', img: 'emoji:🏪' }, { word: 'MASJID', img: 'emoji:🕌' },
        { word: 'POHON', img: 'emoji:🌳' }, { word: 'BUNGA', img: 'emoji:🌸' },
        { word: 'DAUN', img: 'emoji:🍃' }, { word: 'API', img: 'emoji:🔥' },
        { word: 'AIR', img: 'emoji:💧' }, { word: 'MOTOR', img: 'emoji:🏍️' },
        { word: 'TRUK', img: 'emoji:🚚' }, { word: 'PERAHU', img: 'emoji:🛶' },
        { word: 'HELIKOPTER', img: 'emoji:🚁' }, { word: 'MATA', img: 'emoji:👀' },
        { word: 'TANGAN', img: 'emoji:🤚' }, { word: 'KAKI', img: 'emoji:🦶' },
        { word: 'HIDUNG', img: 'emoji:👃' }, { word: 'TELINGA', img: 'emoji:👂' },
        { word: 'MULUT', img: 'emoji:👄' }, { word: 'GIGI', img: 'emoji:🦷' },
        { word: 'IBU', img: 'emoji:👩' }, { word: 'AYAH', img: 'emoji:👨' },
        { word: 'ADIK', img: 'emoji:👶' }, { word: 'KAKAK', img: 'emoji:🧒' },
        { word: 'NENEK', img: 'emoji:👵' }, { word: 'KAKEK', img: 'emoji:👴' },
        { word: 'GURU', img: 'emoji:👩‍🏫' }, { word: 'DOKTER', img: 'emoji:👨‍⚕️' },
        { word: 'POLISI', img: 'emoji:👮' }, { word: 'PETANI', img: 'emoji:👨‍🌾' },
        { word: 'KOKI', img: 'emoji:👨‍🍳' }, { word: 'PILOT', img: 'emoji:👨‍✈️' },
        { word: 'LAMPU', img: 'emoji:💡' }, { word: 'CERMIN', img: 'emoji:🪞' },
        { word: 'SELIMUT', img: 'emoji:🛏️' }, { word: 'SABUN', img: 'emoji:🧼' },
        { word: 'SISIR', img: 'emoji:🪮' }, { word: 'GUNTING', img: 'emoji:✂️' },
        { word: 'CICAK', img: 'emoji:🦎' }, { word: 'ULAR', img: 'emoji:🐍' },
        { word: 'BUAYA', img: 'emoji:🐊' }, { word: 'PAUS', img: 'emoji:🐳' },
        { word: 'LUMBA', img: 'emoji:🐬' }, { word: 'SIPUT', img: 'emoji:🐌' },
        { word: 'CACING', img: 'emoji:🪱' }, { word: 'KEPITING', img: 'emoji:🦀' },
        { word: 'UDANG', img: 'emoji:🦐' }, { word: 'KUE', img: 'emoji:🍰' },
        { word: 'JUS', img: 'emoji:🧃' }, { word: 'TEH', img: 'emoji:🍵' },
        { word: 'KOPI', img: 'emoji:☕' }, { word: 'GARAM', img: 'emoji:🧂' },
        { word: 'CABAI', img: 'emoji:🌶️' }, { word: 'BAWANG', img: 'emoji:🧅' },
        { word: 'LABU', img: 'emoji:🎃' }, { word: 'MELON', img: 'emoji:🍈' },
        { word: 'KIWI', img: 'emoji:🥝' }, { word: 'LEMON', img: 'emoji:🍋' },
        { word: 'NANAS', img: 'emoji:🍍' }, { word: 'BALON', img: 'emoji:🎈' },
        { word: 'LAYANG', img: 'emoji:🪁' }, { word: 'KADO', img: 'emoji:🎁' },
        { word: 'LILIN', img: 'emoji:🕯️' }, { word: 'KAMERA', img: 'emoji:📷' },
        { word: 'TELEPON', img: 'emoji:📞' }, { word: 'KOMPUTER', img: 'emoji:💻' },
        { word: 'RADIO', img: 'emoji:📻' }, { word: 'GITAR', img: 'emoji:🎸' },
        { word: 'DRUM', img: 'emoji:🥁' }, { word: 'BONEKA', img: 'emoji:🧸' },
        { word: 'ROBOT', img: 'emoji:🤖' }, { word: 'DANAU', img: 'emoji:🏞️' },
        { word: 'SAWAH', img: 'emoji:🌾' }, { word: 'KEBUN', img: 'emoji:🌻' },
        { word: 'JEMBATAN', img: 'emoji:🌉' }, { word: 'MENARA', img: 'emoji:🗼' },
        { word: 'ISTANA', img: 'emoji:🏰' }, { word: 'TOKO', img: 'emoji:🏬' },
        { word: 'SALJU', img: 'emoji:❄️' }, { word: 'ANGIN', img: 'emoji:🌬️' },
        { word: 'PETIR', img: 'emoji:⚡' }, { word: 'JARI', img: 'emoji:👆' },
        { word: 'LIDAH', img: 'emoji:👅' }, { word: 'PAMAN', img: 'emoji:👨' },
        { word: 'BIBI', img: 'emoji:👩' }, { word: 'TEMAN', img: 'emoji:🧑' },
    ];

export const generateReadingQuestions = (level: DifficultyLevel, count: number = 5): ReadingQuestion[] => {
    const questions: ReadingQuestion[] = [];

    const words = READING_WORDS;

    const colors = [
        { word: 'MERAH', img: 'emoji:❤️' }, { word: 'BIRU', img: 'emoji:💙' },
        { word: 'HIJAU', img: 'emoji:💚' }, { word: 'KUNING', img: 'emoji:💛' },
        { word: 'HITAM', img: 'emoji:🖤' }, { word: 'PUTIH', img: 'emoji:🤍' },
        { word: 'UNGU', img: 'emoji:💜' }, { word: 'ORANYE', img: 'emoji:🧡' }
    ];

    const opposites = [
        { word: 'BESAR', opposite: 'KECIL', img: 'emoji:🐘' },
        { word: 'PANAS', opposite: 'DINGIN', img: 'emoji:🔥' },
        { word: 'SIANG', opposite: 'MALAM', img: 'emoji:☀️' },
        { word: 'BUKA', opposite: 'TUTUP', img: 'emoji:📂' },
        { word: 'ATAS', opposite: 'BAWAH', img: 'emoji:⬆️' },
        { word: 'SENANG', opposite: 'SEDIH', img: 'emoji:😊' },
        { word: 'PENDEK', opposite: 'TINGGI', img: 'emoji:📏' },
        { word: 'BERAT', opposite: 'RINGAN', img: 'emoji:🏋️' },
        { word: 'CEPAT', opposite: 'LAMBAT', img: 'emoji:🚀' },
        { word: 'KOSONG', opposite: 'PENUH', img: 'emoji:🫗' },
        { word: 'BERSIH', opposite: 'KOTOR', img: 'emoji:✨' },
        { word: 'MUDA', opposite: 'TUA', img: 'emoji:👶' },
        { word: 'MAJU', opposite: 'MUNDUR', img: 'emoji:▶️' },
        { word: 'KANAN', opposite: 'KIRI', img: 'emoji:➡️' },
        { word: 'JAUH', opposite: 'DEKAT', img: 'emoji:🗺️' },
        { word: 'TEBAL', opposite: 'TIPIS', img: 'emoji:📖' },
        { word: 'KUAT', opposite: 'LEMAH', img: 'emoji:💪' },
        { word: 'GELAP', opposite: 'TERANG', img: 'emoji:💡' },
        { word: 'BASAH', opposite: 'KERING', img: 'emoji:☔' },
        { word: 'RAMAI', opposite: 'SEPI', img: 'emoji:🏙️' },
        { word: 'AWAL', opposite: 'AKHIR', img: 'emoji:🏁' },
        { word: 'DALAM', opposite: 'LUAR', img: 'emoji:🏠' },
    ];

    const sentences = [
        { sentence: "Ikan berenang di ...", answer: "AIR", options: ["AIR", "TANAH", "API"] },
        { sentence: "Burung terbang di ...", answer: "LANGIT", options: ["LANGIT", "LAUT", "DALAM TANAH"] },
        { sentence: "Sapi makan ...", answer: "RUMPUT", options: ["RUMPUT", "BATU", "KAYU"] },
        { sentence: "Saya tidur di ...", answer: "KASUR", options: ["KASUR", "DAPUR", "KAMAR MANDI"] },
        { sentence: "Mobil punya empat ...", answer: "RODA", options: ["RODA", "KAKI", "SAYAP"] },
        { sentence: "Ibu memasak di ...", answer: "DAPUR", options: ["DAPUR", "TERAS", "KAMAR"] },
        { sentence: "Kita melihat dengan ...", answer: "MATA", options: ["MATA", "TELINGA", "HIDUNG"] },
        { sentence: "Kita mendengar dengan ...", answer: "TELINGA", options: ["TELINGA", "KAKI", "TANGAN"] },
        { sentence: "Gajah itu sangat ...", answer: "BESAR", options: ["BESAR", "KECIL", "TIPIS"] },
        { sentence: "Api itu terasa ...", answer: "PANAS", options: ["PANAS", "DINGIN", "BASAH"] },
        { sentence: "Es krim rasanya ...", answer: "MANIS", options: ["MANIS", "ASIN", "PEDAS"] },
        { sentence: "Buku adalah jendela ...", answer: "DUNIA", options: ["DUNIA", "RUMAH", "KOLAM"] },
        { sentence: "Sebelum makan harus ...", answer: "BERDOA", options: ["BERDOA", "TIDUR", "BERMAIN"] },
        { sentence: "Kita berjalan pakai ...", answer: "KAKI", options: ["KAKI", "TANGAN", "KEPALA"] },
        { sentence: "Matahari terbit ...", answer: "PAGI", options: ["PAGI", "MALAM", "SORE"] },
        { sentence: "Ayam bangun saat ...", answer: "SUBUH", options: ["SUBUH", "SIANG", "MALAM"] },
        { sentence: "Gigi harus disikat ...", answer: "BERSIH", options: ["BERSIH", "KOTOR", "HITAM"] },
        { sentence: "Kucing suka makan ...", answer: "IKAN", options: ["IKAN", "RUMPUT", "BATU"] },
        { sentence: "Bunga tumbuh di ...", answer: "TAMAN", options: ["TAMAN", "LAUT", "DAPUR"] },
        { sentence: "Ayah bekerja di ...", answer: "KANTOR", options: ["KANTOR", "KASUR", "DAPUR"] },
        { sentence: "Hujan turun dari ...", answer: "AWAN", options: ["AWAN", "TANAH", "API"] },
        { sentence: "Lebah membuat ...", answer: "MADU", options: ["MADU", "SUSU", "AIR"] },
        { sentence: "Kita menulis dengan ...", answer: "PENSIL", options: ["PENSIL", "SENDOK", "SEPATU"] },
        { sentence: "Bulan terlihat pada ...", answer: "MALAM", options: ["MALAM", "PAGI", "SIANG"] },
        { sentence: "Es itu terasa ...", answer: "DINGIN", options: ["DINGIN", "PANAS", "MANIS"] },
        { sentence: "Pisang warnanya ...", answer: "KUNING", options: ["KUNING", "MERAH", "BIRU"] },
        { sentence: "Langit warnanya ...", answer: "BIRU", options: ["BIRU", "HIJAU", "KUNING"] },
    ];

    for (let i = 0; i < count; i++) {
        const id = `r-${Date.now()}-${i}`;

        if (level === DifficultyLevel.PEMULA) {
            const rand = Math.random();

            // 20% chance for Color matching
            if (rand < 0.2) {
                const item = colors[Math.floor(Math.random() * colors.length)];
                const distractors = colors.filter(c => c.word !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
                const options = [item.word, ...distractors.map(d => d.word)].sort(() => Math.random() - 0.5);
                questions.push({ id, image: item.img, word: item.word, options, type: 'MATCH_IMAGE' });
            } else {
                const item = words[Math.floor(Math.random() * words.length)];
                if (rand < 0.5) {
                    // Match Image to Word
                    const distractors = words.filter(w => w.word !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
                    const options = [item.word, ...distractors.map(d => d.word)].sort(() => Math.random() - 0.5);
                    questions.push({ id, image: item.img, word: item.word, options, type: 'MATCH_IMAGE' });
                } else if (rand < 0.8) {
                    // Match Word to Image
                    const distractors = words.filter(w => w.word !== item.word).sort(() => Math.random() - 0.5).slice(0, 2);
                    const options = [item.img, ...distractors.map(d => d.img)].sort(() => Math.random() - 0.5);
                    questions.push({ id, word: item.word, image: item.img, options, type: 'MATCH_WORD' });
                } else {
                    // First Letter Match
                    const firstChar = item.word[0];
                    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    let opts = [firstChar];
                    while (opts.length < 3) {
                        const c = alphabet[Math.floor(Math.random() * 26)];
                        if (!opts.includes(c)) opts.push(c);
                    }
                    questions.push({
                        id,
                        image: item.img,
                        word: item.word,
                        options: opts.sort(() => Math.random() - 0.5),
                        type: 'FIRST_LETTER'
                    });
                }
            }
        } else if (level === DifficultyLevel.MENENGAH) {
            const rand = Math.random();

            if (rand < 0.4) {
                // Missing Letter
                const singleWords = words.filter(w => !w.word.includes(' '));
                const item = singleWords[Math.floor(Math.random() * singleWords.length)];
                const idx = Math.floor(Math.random() * item.word.length);
                const missingChar = item.word[idx];
                const display = item.word.substring(0, idx) + '_' + item.word.substring(idx + 1);
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let opts = [missingChar];
                while (opts.length < 3) {
                    const c = alphabet[Math.floor(Math.random() * 26)];
                    if (!opts.includes(c)) opts.push(c);
                }
                questions.push({ id, word: display, missingLetter: missingChar, image: item.img, options: opts.sort(() => Math.random() - 0.5), type: 'MISSING_LETTER' });
            } else if (rand < 0.7) {
                // Opposites
                const item = opposites[Math.floor(Math.random() * opposites.length)];
                const others = opposites.filter(o => o.opposite !== item.opposite).sort(() => Math.random() - 0.5).slice(0, 2);
                const options = [item.opposite, ...others.map(o => o.opposite)].sort(() => Math.random() - 0.5);

                questions.push({
                    id,
                    word: item.word,
                    image: item.img,
                    options,
                    type: 'OPPOSITE',
                    missingLetter: item.opposite
                });
            } else {
                // Sentence Completion (sederhana, untuk MENENGAH 5-6 tahun)
                // Setengahnya kalimat tetap, setengahnya template: subjek x kata kerja x tempat
                // = ratusan kombinasi kalimat berbeda tanpa menulis ratusan kalimat satu per satu.
                if (Math.random() < 0.5) {
                    const item = sentences[Math.floor(Math.random() * sentences.length)];
                    questions.push({
                        id,
                        word: item.sentence,
                        options: [...item.options].sort(() => Math.random() - 0.5),
                        type: 'SENTENCE',
                        image: 'emoji:📝',
                        missingLetter: item.answer
                    });
                } else {
                    const subjects = ['KUCING', 'ANJING', 'BURUNG', 'BEBEK', 'ANAK', 'IBU', 'AYAH'];
                    const verbs = ['bermain', 'belajar'];
                    const places = ['TAMAN', 'SEKOLAH', 'RUMAH', 'PASAR', 'PANTAI', 'KOTA'];
                    const subject = subjects[Math.floor(Math.random() * subjects.length)];
                    const verb = verbs[Math.floor(Math.random() * verbs.length)];
                    const answer = places[Math.floor(Math.random() * places.length)];
                    const others = places.filter((pl) => pl !== answer).sort(() => Math.random() - 0.5).slice(0, 2);
                    questions.push({
                        id,
                        word: `${subject} ${verb} di ...`,
                        options: [answer, ...others].sort(() => Math.random() - 0.5),
                        type: 'SENTENCE',
                        image: 'emoji:📝',
                        missingLetter: answer
                    });
                }
            }
        } else {
            // Advanced
            const rand = Math.random();
            if (rand < 0.4) {
                // Word Scramble
                const item = words[Math.floor(Math.random() * words.length)];
                const scrambled = item.word.split('').sort(() => Math.random() - 0.5).join(' ');
                const distractor1 = item.word.split('').reverse().join('');
                const distractor2 = "SALAH";
                questions.push({
                    id,
                    word: item.word,
                    scrambledWord: scrambled,
                    options: [item.word, distractor1, distractor2].sort(() => Math.random() - 0.5),
                    type: 'SCRAMBLE',
                    image: item.img
                });
            } else {
                // Sentence Completion
                const item = sentences[Math.floor(Math.random() * sentences.length)];
                questions.push({
                    id,
                    word: item.sentence,
                    options: item.options.sort(() => Math.random() - 0.5),
                    type: 'SENTENCE',
                    image: 'emoji:📝',
                    missingLetter: item.answer
                });
            }
        }
    }
    return questions;
};
