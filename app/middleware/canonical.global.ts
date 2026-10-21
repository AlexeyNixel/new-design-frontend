/**
 * Двойники служебных страниц (старые адреса, посты-копии) ведут на один адрес —
 * см. shared/utils/canonicalPath.ts. На сервере это 301, на клиенте — переход.
 */
export default defineNuxtRouteMiddleware((to) => {
  const target = canonicalPath(to.path);
  if (target !== to.path) {
    return navigateTo({ path: target, query: to.query, hash: to.hash }, { redirectCode: 301 });
  }
});
