/** Ячейка без текста: только изображения, пробелы и пустые теги */
const isImageOrEmptyCell = (cellHtml: string) =>
  /<img/i.test(cellHtml)
  || cellHtml.replace(/<[^>]+>|&nbsp;|\s/g, '').length === 0;

const PX_WIDTH = /(^|[;"])\s*width:\s*([\d.]+)px\s*(?=[;"]|$)/i;

/** Убирает width/min-width из инлайн-стиля, пустой style удаляет целиком */
const stripWidth = (attrs: string) =>
  attrs
    .replace(/\s+width="[^"]*"/gi, '')
    .replace(/\sstyle="([^"]*)"/i, (_, style: string) => {
      const rest = style
        .split(';')
        .filter(rule => rule.trim() && !/^\s*(min-)?width\s*:/i.test(rule))
        .join(';');
      return rest ? ` style="${rest}"` : '';
    });

/**
 * Таблица из админки всегда вписывается в колонку контента, без прокрутки.
 * Редактор хранит ширину столбцов в px (<col style="width: 400px">) и ставит
 * таблице инлайн width/min-width — на узком экране она вылезала за контент.
 * Инлайн-ширину таблицы убираем, а px столбцов пересчитываем в % от их суммы:
 * пропорции сохраняются, а ширину задаёт CSS (width: 100%). Столбцы в %
 * (data-colpercent у ячеек) и столбцы без ширины не трогаем.
 */
export const fitTables = (html?: string | null) => {
  if (!html || !/<table/i.test(html)) return html ?? '';

  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (_, attrs: string, body: string) => {
    const colgroup = body.match(/<colgroup\b[^>]*>([\s\S]*?)<\/colgroup>/i);
    const cols = colgroup?.[1]?.match(/<col\b[^>]*>/gi) ?? [];
    const pxOf = (col: string) => {
      const style = col.match(/\sstyle="([^"]*)"/i)?.[1] ?? '';
      return Number(style.match(PX_WIDTH)?.[2]) || 0;
    };

    const widths = cols.map(pxOf);
    const fixed = widths.filter(Boolean);
    let fittedBody = body;

    if (colgroup && fixed.length) {
      // Столбцам без ширины оставляем долю, как у среднего px-столбца
      const average = fixed.reduce((a, b) => a + b, 0) / fixed.length;
      const total = widths.reduce((sum, w) => sum + (w || average), 0);

      let index = 0;
      const fittedCols = colgroup[0].replace(/<col\b[^>]*>/gi, (col) => {
        const px = widths[index++];
        if (!px) return col;
        const percent = +((px / total) * 100).toFixed(2);
        return col.replace(PX_WIDTH, `$1width: ${percent}%`);
      });
      fittedBody = body.replace(colgroup[0], fittedCols);
    }

    return `<table${stripWidth(attrs)}>${fittedBody}</table>`;
  });
};

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
