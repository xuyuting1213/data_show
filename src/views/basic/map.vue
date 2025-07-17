<template>
    <div>
      <div id="mapContainer" style="width: 100%; height: 500px;"></div>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      this.initMap(); // 组件挂载后初始化地图
    },
    methods: {
      initMap() {
        // 初始化卫星地图
        const map = new AMap.Map("mapContainer", {
          zoom: 15, // 设置缩放级别
          center: [116.397428, 39.90923], // 设置地图中心点
          mapStyle: "amap://styles/whitesmoke" // 设置为卫星地图样式
        });
  
        // 加载 AR 插件
        AMap.plugin(["AMap.AR"], () => {
          const arControl = new AMap.AR({
            position: "RB", // 控制按钮的位置（RB：右下角）
            viewMode: "3D", //是否为3D地图模式
          });
  
          // 将 AR 控件添加到地图中
          map.addControl(arControl);
          arControl.start(); // 启动 AR 模式
        });
      },
    },
  };
  </script>
  
  <style scoped>
  #mapContainer {
    width: 100%;
    height: 500px;
  }
  </style>
  