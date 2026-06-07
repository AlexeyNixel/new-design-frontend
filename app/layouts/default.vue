<template>
  <div class="flex flex-col min-h-screen bg-neutral-100">
    <!-- ХЕДЕР -->
    <LayoutHeader />

    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- ФУТЕР -->
    <LayoutFooter />
  </div>
</template>
