<!-- pages/debug-cors.vue -->
<template>
  <div style="padding: 20px">
    <h1>CORS Debug Page</h1>

    <div
      v-for="test in tests"
      :key="test.name"
      style="margin: 20px 0; padding: 15px; border: 1px solid #ccc"
    >
      <h3>{{ test.name }}</h3>
      <button @click="runTest(test)">Run Test</button>
      <div v-if="test.status === 'loading'">⏳ Loading...</div>
      <div v-if="test.status === 'success'" style="color: green">
        ✅ Success: {{ test.result }}
      </div>
      <div v-if="test.status === 'error'" style="color: red">
        ❌ Error: {{ test.error }}
      </div>
      <div v-if="test.details">
        <small>Details: {{ test.details }}</small>
      </div>
    </div>

    <div style="margin-top: 30px">
      <h3>Environment Info:</h3>
      <pre>{{ envInfo }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const tests = ref([
  {
    name: 'Test 1: Direct fetch to API',
    url: 'http://api2.infomania.ru/api/main-slider/?limit=5',
    method: 'direct',
    status: '',
    result: '',
    error: '',
    details: '',
  },
  {
    name: 'Test 2: Through /api-proxy/',
    url: '/api-proxy/main-slider/?limit=5',
    method: 'proxy',
    status: '',
    result: '',
    error: '',
    details: '',
  },
  {
    name: 'Test 3: Using useApi composable',
    url: '/main-slider/',
    method: 'composable',
    status: '',
    result: '',
    error: '',
    details: '',
  },
  {
    name: 'Test 4: Server-side test',
    url: '/api/debug-test',
    method: 'server',
    status: '',
    result: '',
    error: '',
    details: '',
  },
]);

const envInfo = ref({
  isServer: process.server,
  isClient: process.client,
  mode: process.dev ? 'development' : 'production',
  url: typeof window !== 'undefined' ? window.location.href : 'server',
});

const runTest = async (test: any) => {
  test.status = 'loading';
  test.error = '';
  test.result = '';

  try {
    let response;

    if (test.method === 'direct') {
      // Прямой fetch
      response = await fetch(test.url);
      test.details = `URL: ${test.url}`;
    } else if (test.method === 'proxy') {
      // Через прокси
      response = await $fetch(test.url);
      test.details = `URL: ${test.url}`;
    } else if (test.method === 'composable') {
      // Через ваш composable
      const { get } = useApi();
      response = await get(test.url, { params: { limit: 5 } });
      test.details = `Using useApi()`;
    } else if (test.method === 'server') {
      // Через серверный endpoint
      response = await $fetch(test.url);
      test.details = `Server route`;
    }

    test.result =
      typeof response === 'object'
        ? `Got response with keys: ${Object.keys(response).join(', ')}`
        : `Response: ${response}`;
    test.status = 'success';
  } catch (error: any) {
    test.status = 'error';
    test.error = error.message || 'Unknown error';
    test.details = error.toString();
    console.error(`Test "${test.name}" failed:`, error);
  }
};
</script>
