/**
 * Пары «вопрос — ответ» из HTML страницы CMS для разметки schema.org FAQPage.
 * Формат, в котором редакторы пишут вопросы (страница «Ответы на вопросы»):
 *   <p><strong>1. Какой режим работы?</strong><br>Библиотека работает…</p>
 * Вопрос — выделенный текст в начале абзаца, оканчивающийся на «?»;
 * ответ — остальной текст абзаца.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

const toText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();

export const extractFaq = (html?: string | null): FaqItem[] => {
  if (!html) return [];
  const items: FaqItem[] = [];

  for (const [, paragraph = ''] of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const match = paragraph.match(/^\s*<(strong|b)[^>]*>([\s\S]*?)<\/\1>([\s\S]*)$/i);
    if (!match) continue;

    // «1. Какой режим работы?» → «Какой режим работы?»
    const question = toText(match[2]!).replace(/^\d+[.)]\s*/, '');
    const answer = toText(match[3]!);
    if (question.endsWith('?') && answer.length > 10) {
      items.push({ question, answer });
    }
  }

  return items;
};
