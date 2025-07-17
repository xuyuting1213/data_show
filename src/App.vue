<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.name == 'index'"></router-view>
    </keep-alive>
    <router-view v-if="$route.name != 'index'"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style></style>
