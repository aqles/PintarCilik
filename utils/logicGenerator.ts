import { DifficultyLevel, LogicQuestion } from '../types';

export const generateLogicQuestions = (level: DifficultyLevel, count: number = 5): LogicQuestion[] => {
    const questions: LogicQuestion[] = [];

    // Sets of emojis for variety
    const animals = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁'];
    const fruits = ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥭', '🍓', '🍒'];
    const vehicles = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐'];
    const shapes = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪'];
    const weather = ['☀️', '🌤️', '☁️', '🌧️', '⛈️', '❄️', '🌈', '⚡', '☂️'];
    const nature = ['🌳', '🌸', '🍃', '🌙', '⭐', '🌻', '🍂', '🪨'];

    const allEmojis = [...animals, ...fruits, ...vehicles, ...shapes, ...weather];

    for (let i = 0; i < count; i++) {
        const id = `l-${Date.now()}-${i}`;

        if (level === DifficultyLevel.PEMULA) {
            // Simple Odd One Out using a specific category vs random
            const category = [animals, fruits, vehicles, shapes, weather, nature][Math.floor(Math.random() * 6)];
            // Pick main emoji from category
            const mainEmoji = category[Math.floor(Math.random() * category.length)];
            // Pick diff emoji from DIFFERENT category if chance, or same category distinct
            let diffEmoji = '';

            if (Math.random() > 0.5) {
                // Different category
                const otherCats = [animals, fruits, vehicles, shapes, weather, nature].filter(c => c !== category).flat();
                diffEmoji = otherCats[Math.floor(Math.random() * otherCats.length)];
            } else {
                diffEmoji = category[Math.floor(Math.random() * category.length)];
                while (diffEmoji === mainEmoji) diffEmoji = category[Math.floor(Math.random() * category.length)];
            }

            const pos = Math.floor(Math.random() * 3);
            const sequence = [mainEmoji, mainEmoji, mainEmoji];
            sequence[pos] = diffEmoji;

            questions.push({
                id,
                question: "Mana yang berbeda?",
                sequence,
                answer: diffEmoji,
                options: [mainEmoji, diffEmoji].sort(() => Math.random() - 0.5),
                type: 'ODD_ONE_OUT'
            });
        } else {
            // Patterns
            // Use shapes for clearer patterns
            const source = Math.random() > 0.6 ? shapes : allEmojis;
            const a = source[Math.floor(Math.random() * source.length)];
            let b = source[Math.floor(Math.random() * source.length)];
            while (b === a) b = source[Math.floor(Math.random() * source.length)];

            let pattern: string[] = [];
            let answer = '';

            if (level === DifficultyLevel.MENENGAH) {
                const kind = Math.random();
                if (kind < 0.25) {
                    // A-B-A-B
                    pattern = [a, b, a, '?'];
                    answer = b;
                } else if (kind < 0.5) {
                    // A-A-B-A-A
                    pattern = [a, a, b, a, a, '?'];
                    answer = b;
                } else if (kind < 0.75) {
                    // A-B-B-A-B-? (mengulang ABB)
                    pattern = [a, b, b, a, b, '?'];
                    answer = b;
                } else {
                    // A-A-B-B-A-? (mengulang AABB)
                    pattern = [a, a, b, b, a, '?'];
                    answer = a;
                }
            } else {
                // Advanced
                const type = Math.floor(Math.random() * 3);

                if (type === 0) {
                    // A-B-C pattern
                    let c = source[Math.floor(Math.random() * source.length)];
                    while (c === a || c === b) c = source[Math.floor(Math.random() * source.length)];
                    pattern = [a, b, c, a, b, '?'];
                    answer = c;
                } else if (type === 1) {
                    // A-B-B-A pattern section
                    pattern = [a, b, b, a, a, b, b, '?'];
                    answer = a;
                } else {
                    // 3 items repeating A-B-C-A-B-?
                    let c = source[Math.floor(Math.random() * source.length)];
                    while (c === a || c === b) c = source[Math.floor(Math.random() * source.length)];
                    pattern = [a, b, c, a, b, '?'];
                    answer = c;
                }
            }

            const wrongOption = source.find(e => e !== answer && e !== a && e !== b) || '❓';
            questions.push({
                id,
                question: "Apa urutan selanjutnya?",
                sequence: pattern,
                answer: answer,
                options: [answer, wrongOption, a === answer ? b : a].sort(() => Math.random() - 0.5),
                type: 'PATTERN'
            });
        }
    }
    return questions;
};
