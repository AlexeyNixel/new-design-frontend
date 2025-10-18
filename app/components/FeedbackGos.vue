<script lang="ts" setup>
import { onMounted } from 'vue';

const navigateRuStore = (e: any) => {
  e.stopPropagation();
  navigateTo('https://apps.rustore.ru/app/ru.gosuslugi.pos', {
    external: true,
    open: { target: '_blank' },
  });
};

onMounted(() => {
  if (import.meta.client) {
    const el = document.createElement('script');
    el.setAttribute('type', 'text/javascript');
    el.setAttribute('async', 'true');
    el.innerHTML = `(function(){
    "use strict";function ownKeys(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);if(t)r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable});n.push.apply(n,r)}return n}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};if(t%2)ownKeys(Object(n),true).forEach(function(t){_defineProperty(e,t,n[t])});else if(Object.getOwnPropertyDescriptors)Object.defineProperties(e,Object.getOwnPropertyDescriptors(n));else ownKeys(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function _defineProperty(e,t,n){if(t in e)Object.defineProperty(e,t,{value:n,enumerable:true,configurable:true,writable:true});else e[t]=n;return e}var POS_PREFIX_83="--pos-banner-fluid-83__",posOptionsInitialBanner83={background:"#50b3ff","grid-template-columns":"100%","grid-template-rows":"264px auto","max-width":"1422px","text-font-size":"20px","text-small-font-size":"14px","text-margin":"0 0px 12px 0","description-margin":"0 0 24px 0","button-wrap-max-width":"245px","bg-url":"url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-0.svg')","bg-url-position":"center top","content-padding":"40px 24px 48px","logo-wrap-padding":"12px 14px 10px 12px","logo-width":"65px","logo-wrap-top":"0","slogan-font-size":"12px","logo-box-shadow":"none","text-small-margin":0},setStyles=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:POS_PREFIX_83;Object.keys(e).forEach(function(r){t.style.setProperty(n+r,e[r])})},removeStyles=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:POS_PREFIX_83;Object.keys(e).forEach(function(e){t.style.removeProperty(n+e)})};function changePosBannerOnResize(){var e=document.documentElement,t=_objectSpread({},posOptionsInitialBanner83),n=document.getElementById("js-show-iframe-wrapper"),r=n?n.offsetWidth:document.body.offsetWidth;if(r>300)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-1.svg')",t["grid-template-rows"]="244px auto";if(r>360)t["description-margin"]="0 0 20px 0",t["content-padding"]="20px 55px 20px 24px",t["button-wrap-max-width"]="118px";if(r>415)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-2.svg')",t["content-padding"]="36px 25px 52px 24px";if(r>568)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83.svg')",t["text-font-size"]="24px",t["text-small-font-size"]="14px",t["grid-template-columns"]="53% 47%",t["grid-template-rows"]="332px",t["content-grid-row"]="1",t["content-padding"]="54px 28px",t["description-margin"]="0 0 24px 0",t["button-wrap-max-width"]="245px";if(r>783)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-3.svg')",t["grid-template-columns"]="1fr 1fr",t["grid-template-rows"]="268px",t["text-small-font-size"]="14px",t["content-padding"]="40px 24px 40px 50px",t["button-wrap-max-width"]="118px",t["text-font-size"]="24px";if(r>1098)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-4.svg')",t["grid-template-rows"]="300px",t["text-font-size"]="32px",t["text-small-font-size"]="18px",t["content-padding"]="42px 50px",t["logo-width"]="78px",t["slogan-font-size"]="15px",t["logo-wrap-padding"]="20px 16px 16px",t["text-small-margin"]="0px 150px 0px 0";if(r>1400)t["bg-url"]="url('https://pos.gosuslugi.ru/bin/banner-fluid/83/banner-fluid-bg-83-5.svg')",t["max-width"]="1422px",t["grid-template-columns"]="1fr 1fr",t["content-padding"]="34px 0px 34px 100px",t["logo-box-shadow"]="0px 1px 4px #E3EBFC, 0px 24px 48px rgba(230, 235, 245, 0.4)",t["text-small-margin"]="0",t["text-margin"]="0 140px 12px 0";setStyles(t,e)}changePosBannerOnResize(),window.addEventListener("resize",changePosBannerOnResize),window.onunload=function(){var e=document.documentElement,t=_objectSpread({},posOptionsInitialBanner83);window.removeEventListener("resize",changePosBannerOnResize),removeStyles(t,e)};
  })()`;
    document.body.after(el);

    // @ts-expect-error
    Widget('https://pos.gosuslugi.ru/form', 348893);
  }
});
</script>

<template>
  <div class="mr-5 w-full mb-4 md:mb-0">
    <div id="js-show-iframe-wrapper" class="content">
      <div class="pos-banner-fluid bf-83">
        <div class="bf-83__decor">
          <div class="bf-83__logo-wrap">
            <img
              class="bf-83__logo"
              src="https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg"
              alt="Госуслуги"
            />
            <div class="bf-83__slogan">Решаем вместе</div>
          </div>
        </div>
        <div class="bf-83__content">
          <div class="bf-83__description">
            <span class="bf-83__text"> Есть вопрос? </span>
            <span class="bf-83__text bf-83__text_small"> Напишите нам </span>
          </div>
          <div class="bf-83__bottom-wrap">
            <div class="bf-83__btn-wrap">
              <button class="pos-banner-btn_2" type="button">Написать</button>
              <UButton
                href="https://apps.rustore.ru/app/ru.gosuslugi.pos"
                target="_blank"
                class="pos-banner-btn_2 dark:bg-white min-h-[52px] ring-0 mt-2 rounded-[8px]"
                @click="navigateRuStore"
              >
                RuStore
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  //width: 50% !important;
  height: 100%;
}
.message {
  @apply mr-5 w-full mb-4 md:mb-0;
  //margin: 1vw 0;
}

.gos {
  width: 100%;
  height: 300px;
  border: none;
  margin: 0;
  padding: 0;
}

:deep(#js-show-iframe-wrapper) {
  @apply rounded-lg;
}

:deep(#js-show-iframe-wrapper .bf-83__decor) {
  @apply rounded-r-lg;
}
</style>
