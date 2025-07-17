<template>
    <div class="content" style="padding-top: 10px;
    color: white;
    "> 
      <router-view> </router-view>
      <div
      style="width: 740px; text-align: center; position: absolute; bottom: 17px;left: 380px;"
    >
      <!-- <Navbar></Navbar> -->
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
  
  </style>