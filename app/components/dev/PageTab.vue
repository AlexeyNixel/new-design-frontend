<template>
  <div class="dev-section">
    <div class="dev-info">
      <div>
        <span>path</span><b>{{ route.path }}</b>
      </div>
      <div>
        <span>name</span><b>{{ String(route.name ?? '—') }}</b>
      </div>
      <div>
        <span>payload</span><b>{{ payloadSize }}</b>
      </div>
    </div>

    <details v-if="hasParams">
      <summary>params / query</summary>
      <pre>{{
        JSON.stringify({ params: route.params, query: route.query }, null, 2)
      }}</pre>
    </details>

    <div class="dev-subhead">
      payload.data ({{ dataKeys.length }})
    </div>
    <ul class="dev-list">
      <li
        v-for="d in dataKeys"
        :key="d.key"
      >
        <span>{{ d.key }}</span><b>{{ d.size }}</b>
      </li>
      <li
        v-if="!dataKeys.length"
        class="dev-muted"
      >
        —
      </li>
    </ul>

    <div class="dev-subhead">
      useState ({{ stateKeys.length }})
    </div>
    <ul class="dev-list">
      <li
        v-for="k in stateKeys"
        :key="k"
      >
        <span>{{ k }}</span>
      </li>
      <li
        v-if="!stateKeys.length"
        class="dev-muted"
      >
        —
      </li>
    </ul>

    <div class="dev-actions">
      <button @click="tick++">
        Обновить
      </button>
      <button @click="logPayload">
        payload → консоль
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const nuxtApp = useNuxtApp();

const tick = ref(0);

function bytes(value: unknown): string {
  try {
    const n = new Blob([JSON.stringify(value) ?? '']).size;
    return n > 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`;
  }
  catch {
    return '—';
  }
}

const payloadSize = computed(() => {
  void tick.value;
  return bytes(nuxtApp.payload);
});

const hasParams = computed(
  () =>
    Object.keys(route.params).length > 0 || Object.keys(route.query).length > 0,
);

const dataKeys = computed(() => {
  void tick.value;
  const data = (nuxtApp.payload.data ?? {}) as Record<string, unknown>;
  return Object.entries(data).map(([key, value]) => ({
    key,
    size: bytes(value),
  }));
});

const stateKeys = computed(() => {
  void tick.value;
  return Object.keys(
    (nuxtApp.payload.state ?? {}) as Record<string, unknown>,
  ).filter(k => !k.startsWith('$sdev:') && k !== '$s__nuxt_devtools__');
});

function logPayload() {
  console.log('[dev] payload', nuxtApp.payload);
}
</script>
