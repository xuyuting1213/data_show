<template>
  <div class="content">
    <router-view></router-view>
    <div
      style="width: 50%; text-align: center; position: absolute; bottom: 0.1rem"
    >
      <Navbar></Navbar>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
};
</script>

<style lang="less">
.content {
  height: calc(100% - 35px);
  .Navbar {
    // margin-top:-80px ;
  }
}
</style>
