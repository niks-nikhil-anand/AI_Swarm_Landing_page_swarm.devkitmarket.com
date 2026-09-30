/**
 * Layout for rows of five cards: one column on phones, 3 + 2 (second row centred) from md,
 * five across from xl. Same pattern as the roadmap, so no card ever sits alone on a row.
 */
export const fiveUpGrid = "grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-6 xl:grid-cols-5";

export const fiveUpItem = (i: number) =>
  `md:col-span-2 xl:col-span-1 ${i === 3 ? "md:col-start-2 xl:col-start-auto" : ""}`;
