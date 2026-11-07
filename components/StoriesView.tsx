import React, { useEffect, useRef, useState } from 'react';
import { stopSpeaking } from '../utils/speak';
import { Button, Card } from './UI';

interface StoriesViewProps {
  onBack: () => void;
}

interface Story {
  title: string;
  emoji: string;
  cover: string;
  paragraphs: string[];
}

// Cerita orisinal pendek v2.2.0, dibacakan TTS browser gratis.
// Bukan permainan (tidak ada skor, tidak disimpan ke riwayat) — konten tenang
// untuk dibaca bersama atau didengarkan sebelum tidur.
const STORIES: Story[] = [
  {
    title: 'Kiki dan Kucing Oren',
    emoji: '🐱',
    cover: '/cerita-kiki.webp',
    paragraphs: [
      'Di sebuah rumah kecil, tinggalah anak bernama Kiki dan kucing oren bernama Oren.',
      'Setiap pagi, Kiki memberi Oren susu hangat dan mengelus bulunya yang lembut.',
      'Suatu hari, Oren bersembunyi di balik pot bunga. Kiki mencarinya sambil tertawa.',
      'Akhirnya Kiki menemukan Oren sedang tidur pulas. Mereka pun bermain bersama sampai sore.',
    ],
  },
  {
    title: 'Budi Pergi ke Pasar',
    emoji: '🏪',
    cover: '/cerita-pasar.webp',
    paragraphs: [
      'Pagi ini Budi pergi ke pasar bersama ibunya. Pasar itu ramai dan penuh warna.',
      'Budi melihat apel merah, pisang kuning, dan wortel oranye di meja pedagang.',
      'Ibu membeli apel untuk Budi. Budi mengucapkan terima kasih dengan sopan.',
      'Di jalan pulang, Budi menggigit apelnya. Rasanya manis dan segar!',
    ],
  },
  {
    title: 'Bintang Kecil yang Berani',
    emoji: '⭐',
    cover: '/cerita-bintang.webp',
    paragraphs: [
      'Di langit malam, ada bintang kecil yang takut bersinar karena merasa dirinya redup.',
      'Bulan tersenyum dan berkata, cahaya kecil pun bisa menuntun orang pulang.',
      'Bintang kecil itu pun bersinar sekuat tenaga. Cahayanya hangat dan indah.',
      'Sejak malam itu, bintang kecil tidak takut lagi. Ia bersinar setiap malam.',
    ],
  },
  {
    title: 'Rani dan Sepeda Merah',
    emoji: '🚲',
    cover: '/cerita-sepeda.webp',
    paragraphs: [
      'Di taman, ada anak bernama Rani yang baru belajar naik sepeda merah.',
      'Awalnya Rani goyah dan jatuh pelan. Ibunya tersenyum dan berkata, coba lagi, Nak.',
      'Rani mengayuh pelan-pelan, lalu makin lancar. Ia tertawa gembira!',
      'Sejak hari itu, Rani berani bersepeda sendiri, selalu memakai helm.',
    ],
  },
  {
    title: 'Dino Belajar Berbagi',
    emoji: '🦕',
    cover: '/cerita-dino.webp',
    paragraphs: [
      'Di padang bunga, tinggal dino kecil bernama Dino yang punya banyak balok warna-warni.',
      'Datanglah Kelinci dan Tupai yang ingin ikut bermain. Dino sempat ragu.',
      'Lalu Dino membagi baloknya: merah untuk Kelinci, kuning untuk Tupai.',
      'Mereka membangun menara tinggi bersama. Berbagi ternyata membuat bermain makin seru!',
    ],
  },
  {
    title: 'Lala Menanam Bunga',
    emoji: '🌻',
    cover: '/cerita-bunga.webp',
    paragraphs: [
      'Lala menanam biji bunga matahari di kebun bersama ayahnya.',
      'Setiap pagi, Lala menyiramnya dengan gembor kecil dan berkata, tumbuh ya!',
      'Hari demi hari, tunas hijau muncul, lalu kuncup kuning merekah.',
      'Kini kebun Lala penuh bunga matahari yang tersenyum ke arah matahari.',
    ],
  },
  {
    title: 'Hujan dan Pelangi',
    emoji: '🌈',
    cover: '/cerita-hujan.webp',
    paragraphs: [
      'Sore itu hujan turun rintik-rintik. Sita melihat dari jendela sambil memegang cokelat hangat.',
      'Ketika hujan berhenti, langit berubah cerah. Tiba-tiba muncul pelangi yang indah!',
      'Sita menghitung warnanya satu per satu: merah, oranye, kuning, hijau, biru, dan ungu.',
      'Sita tersenyum. Hujan ternyata membawa hadiah yang cantik.',
    ],
  },
];

const StoriesView: React.FC<StoriesViewProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  useEffect(
    () => () => {
      speakingRef.current = false;
      stopSpeaking();
    },
    [],
  );

  const speakStory = (story: Story) => {
    speakingRef.current = true;
    setSpeaking(true);
    const speakParagraph = (idx: number) => {
      if (!speakingRef.current || idx >= story.paragraphs.length) {
        speakingRef.current = false;
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(story.paragraphs[idx]);
      utterance.lang = 'id-ID';
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
      if (idVoice) utterance.voice = idVoice;
      utterance.rate = 0.9;
      utterance.onend = () => speakParagraph(idx + 1);
      utterance.onerror = () => {
        speakingRef.current = false;
        setSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    };
    window.speechSynthesis.cancel();
    speakParagraph(0);
  };

  const stopStory = () => {
    speakingRef.current = false;
    setSpeaking(false);
    stopSpeaking();
  };

  if (selected !== null) {
    const story = STORIES[selected];
    return (
      <div className="max-w-md sm:max-w-xl mx-auto w-full p-4 animate-fade-in-up pb-10">
        <button
          onClick={() => {
            stopStory();
            setSelected(null);
          }}
          aria-label="Kembali ke daftar cerita"
          className="min-h-[44px] px-3 mb-4 text-gray-700 hover:text-gray-900 font-bold"
        >
          &larr; Daftar Cerita
        </button>
        <Card className="text-left">
          <img src={story.cover} alt={`Ilustrasi cerita ${story.title}`} className="w-full rounded-3xl mb-4 object-cover max-h-[320px]" />
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">{story.title}</h2>
          {story.paragraphs.map((para, i) => (
            <p key={i} className="text-lg text-gray-800 leading-relaxed mb-4">
              {para}
            </p>
          ))}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => (speaking ? stopStory() : speakStory(story))}
              variant="primary"
              className="flex-1 min-h-[44px]"
            >
              {speaking ? '⏹ Berhenti' : '🔊 Bacakan'}
            </Button>
            <Button onClick={onBack} variant="secondary" className="flex-1 min-h-[44px] bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400">
              Beranda
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md sm:max-w-xl mx-auto w-full p-4 animate-fade-in-up pb-10">
      <button
        onClick={onBack}
        aria-label="Kembali ke beranda"
        className="min-h-[44px] px-3 mb-4 text-gray-700 hover:text-gray-900 font-bold"
      >
        &larr; Kembali
      </button>
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">Cerita 📖</h2>
      <p className="text-gray-600 mb-6 font-medium">
        Pilih cerita, lalu tekan Bacakan untuk mendengarkannya.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {STORIES.map((story, i) => (
          <button
            key={story.title}
            onClick={() => setSelected(i)}
            className="min-h-[44px] bg-white hover:bg-indigo-50 p-5 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-indigo-200 flex items-center gap-4 transition-all active:scale-95 text-left"
          >
            <img src={story.cover} alt="" aria-hidden="true" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            <span>
              <span className="block text-lg font-bold text-gray-800">{story.title}</span>
              <span className="block text-gray-600 text-sm">
                {story.paragraphs.length} bagian • dibacakan dengan suara
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoriesView;
