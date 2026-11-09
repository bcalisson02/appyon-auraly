/** "1 question" / "9 questions": counts in copy read naturally at 1. */
export const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
