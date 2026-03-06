export const useStringCleaner = () => {
  const decodeHTMLEntities = (text: string): string => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const removeHtmlEntities = (text: string): string => {
    if (!text) return '';

    // Заменяем распространенные HTML-сущности
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  };

  return {
    decodeHTMLEntities,
    removeHtmlEntities,
  };
};
