/** Служебные и тестовые страницы, которые не должны попадать в индекс */
const DISALLOW = ['/api/', '/test', '/debug-cors', '/games/test'];

/**
 * AI-краулеры, которым явно разрешаем индексацию (видимость в ChatGPT,
 * Claude, Perplexity, Google AI Overviews и т.д.)
 */
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'YandexAdditional',
];

export default defineEventHandler((event) => {
  const siteUrl = String(useRuntimeConfig(event).public.siteUrl).replace(
    /\/$/,
    '',
  );

  const disallowLines = DISALLOW.map(path => `Disallow: ${path}`);

  const body = [
    'User-agent: *',
    ...disallowLines,
    '',
    ...AI_BOTS.map(bot => `User-agent: ${bot}`),
    'Allow: /',
    ...disallowLines,
    '',
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return body;
});
