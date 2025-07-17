<template>
    <div id="top-header">
      <dv-decoration-8 class="header-left-decoration" />
      <dv-decoration-5 class="header-center-decoration" />
      <dv-decoration-8 class="header-right-decoration" :reverse="true" />
      <div class="center-title">{{title}}</div>
      <div class="time">{{time}}</div>
    </div>
  </template>
  
  <script>
  
  export default {
    name:'TopHeader',
    props:['title'],
    data() {
      return {
        time:'2024-05-08 10:57:11星期三',
        timeInterval: null
      }
    },
    mounted() {
      this.getTime();
    },
    beforeDestroy() {
        clearInterval(this.timeInterval);
    },
    methods: {
      getTime(){
        this.getCurrentTime()
        if (this.timeInterval) {
          clearInterval(this.timeInterval);
        }
        this.timeInterval = setInterval(() => this.getCurrentTime(), 1000);
      },
      getCurrentTime() {
        const now = new Date();
        // 获取年、月、日、小时、分钟、秒
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        let seconds = now.getSeconds();
        
        // 确保月份和日期为两位数
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        seconds = seconds < 10 ? '0' + seconds : seconds;
  
        const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const week = weekArr[now.getDay()];
        this.time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${week}`;
      }
    }
  }
  </script>
  
  <style lang="less">
  #top-header{
    position: relative;
    height: 100px;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    .time{
      position: absolute;
      right: 5px;
      top: 33px;
    }
  
    .header-center-decoration {
      width: 40%;
      height: 60px;
      margin-top: 30px;
    }
  
    .header-left-decoration, .header-right-decoration {
      width: 25%;
      height: 60px;
    }
  
    .center-title {
      position: absolute;
      font-size: 30px;
      font-weight: bold;
      left: 50%;
      top: 15px;
      transform: translateX(-50%);
    }
  }
  </style>