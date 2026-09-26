/** Ячейка без текста: только изображения, пробелы и пустые теги */
const isImageOrEmptyCell = (cellHtml: string) =>
  /<img/i.test(cellHtml)
  || cellHtml.replace(/<[^>]+>|&nbsp;|\s/g, '').length === 0;

/**
 * В CMS таблицы часто используют только для того, чтобы поставить фото рядом.
 * Помечает такие таблицы атрибутом `data-image-table` (в них есть изображения,
 * а все ячейки — только с фото или пустые). Стили в editor.css убирают у них
 * рамки, фон и лишние отступы. Таблицы с текстом не трогаются.
 */
export const markImageTables = (html?: string | null) => {
  if (!html || !/<table/i.test(html)) return html ?? '';

  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (table, attrs: string, body: string) => {
    if (!/<img/i.test(body)) return table;

    const cells = body.match(/<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi) ?? [];
    if (!cells.length || !cells.every(isImageOrEmptyCell)) return table;

    return `<table data-image-table${attrs}>${body}</table>`;
  });
};
