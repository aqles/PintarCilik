// Utilitas acak bersama untuk v2 — menggantikan pola duplikatif di 3 generator.
// Fisher-Yates (bukan sort(() => Math.random() - 0.5) yang bias) dan ID unik.
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function uniqueOptions<T>(answer: T, distractors: T[]): T[] {
  const seen = new Set<string>([String(answer)]);
  const out: T[] = [answer];
  for (const d of distractors) {
    if (!seen.has(String(d))) { seen.add(String(d)); out.push(d); }
  }
  return shuffle(out);
}

export function newId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`;
}
