<template>
  <!-- Без данных не рисуем: иначе при 404 шаблон падает и мешает показать страницу ошибки -->
  <CommonContentContainer v-if="game">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        to="/games"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-700"
      >
        <Icon
          name="i-heroicons-arrow-left-20-solid"
          class="h-4 w-4"
        />
        Каталог игр
      </NuxtLink>
    </div>

    <GameDetailModern
      :game="game"
      :other-games="otherGames"
      :modal="modal"
    />
  </CommonContentContainer>
</template>

<script setup lang="ts">
import { useGameApi } from '~~/services/api/game.api';
import { ModalsCommon } from '#components';

const route = useRoute();
const overlay = useOverlay();
const gameApi = useGameApi();

const { data: game } = await gameApi.getOneGames(route.params.slug as string);

// Если игра — часть серии, "Смотрите также" показывает другие её части,
// иначе — произвольную подборку из каталога.
const { data: otherGames } = await gameApi.getAllGames(
  game?.seriesId
    ? { seriesId: game.seriesId, limit: 6 }
    : { limit: 6 },
);

const modal = overlay.create(ModalsCommon);

if (game) {
  // Заголовок под поисковые запросы «настольная игра … Новосибирск».
  // Длинное название не дополняем городом, чтобы title не обрезался в выдаче.
  const title
    = game.title.length > 30
      ? `${game.title} — настольная игра`
      : `${game.title} — настольная игра в Новосибирске`;

  const players
    = game.playerMin && game.playerMax && game.playerMin !== game.playerMax
      ? `${game.playerMin}–${game.playerMax} игроков`
      : game.playerMin || game.playerMax
        ? `от ${game.playerMin || game.playerMax} игроков`
        : '';
  const facts = [players, game.playerAge ? `от ${game.playerAge} лет` : '']
    .filter(Boolean)
    .join(', ');
  const where = 'Поиграть можно в игротеке молодёжной библиотеки, Новосибирск, Красный проспект, 26.';
  const lead = game.shortDescription?.trim();
  const description = truncateText(
    [
      lead
        ? /[.!?…]$/.test(lead) ? lead : `${lead}.`
        : `Настольная игра «${game.title}».`,
      facts ? `${facts[0]!.toUpperCase()}${facts.slice(1)}.` : '',
      where,
    ]
      .filter(Boolean)
      .join(' '),
  );

  usePageSeo({
    title,
    description,
    image: game.images[0]?.file.path,
    type: 'article',
  });

  const toAbsolute = useAbsoluteUrl();
  useJsonLd('content', {
    '@type': 'Game',
    'name': game.title,
    'description': description,
    'image': game.images.map(image => toAbsolute(image.file.path)),
    'url': toAbsolute(`/games/${game.slug}`),
    'numberOfPlayers':
      game.playerMin || game.playerMax
        ? {
            '@type': 'QuantitativeValue',
            'minValue': game.playerMin ?? undefined,
            'maxValue': game.playerMax ?? undefined,
          }
        : undefined,
    'typicalAgeRange': game.playerAge ? `${game.playerAge}-` : undefined,
    'dateCreated': game.year ? String(game.year) : undefined,
  });
}
</script>

<style scoped></style>
