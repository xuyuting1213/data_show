<template>
    <div class="content">
      <router-view> </router-view>
      <div
        style="width: 50%; text-align: center; position: absolute; bottom: 0.1rem"
      >
        <!-- <Navbar></Navbar> -->
      </div>
    </div>
  </template>
  
  <script>
  import { queryVideoDevice } from "@/api/watch/video/videodevice.js";
  import { queryVideoSite } from "@/api/watch/video/videosite.js";
  import Navbar from "../components/Navbar";
  export default {
    components: { Navbar },
    data() {
      return {};
    },
    mounted() {
      // console.log("12", this.$route.params);
      // queryVideoSite({ pageNum1: 1, pageSize: 10000, siteId: 2 }).then((res) => {
      //   //   console.log(JSON.stringify(res.rows.slice(6)));
      // });
    },
  };
  </script>
  
  <style lang="less"></style>
  