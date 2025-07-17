<template>
  <div class="model-container">
    <div ref="modelContainer" class="content"></div>
    <div v-if="loading" class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{ width: `${progress === Infinity ? 100 : progress}%` }"
      ></div>
      <span class="progress-text"
        >{{ progress === Infinity ? 100 : progress }}%</span
      >
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

let modelCache = null; // 声明全局缓存

export default {
  name: "ModelViewer",
  // props: {
  //   modelUrl: {
  //     type: String,
  //     required: true,
  //   },
  // },
  data() {
    return {
      modelUrl: "/map_2.glb",
      //   modelUrl: "/map_k/scene.gltf",
      // modelUrl: "/s/oho/scene.gltf",
      model: null,
      loading: true,
      progress: 0, // 追踪加载进度
      //   modelUrl: "/statics/map_kyiv_ukraine/scene.gltf",
    };
  },
  mounted() {
    this.initThree();

    // if (modelCache) {
    //   this.model = modelCache; // 如果缓存存在，直接使用缓存
    //   this.scene.add(this.model);
    // } else {
    //   const loader = new GLTFLoader();
    //   loader.load(
    //     "path/to/model.gltf",
    //     (gltf) => {
    //       modelCache = gltf.scene; // 加载后缓存模型
    //       this.model = modelCache;
    //       this.scene.add(this.model);
    //     },
    //     undefined,
    //     (error) => console.error("模型加载出错:", error)
    //   );
    // this.loadModel(this.modelUrl);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadModel(); // 当模型在视口内时开始加载
          observer.unobserve(this.$refs.modelContainer); // 加载后停止监听
        }
      });
    });
    observer.observe(this.$refs.modelContainer);
    // }
  },
  beforeDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThree() {
      // 初始化场景
      this.scene = new THREE.Scene();

      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.$refs.modelContainer.clientWidth /
          this.$refs.modelContainer.clientHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.$refs.modelContainer.clientWidth,
        this.$refs.modelContainer.clientHeight
      );
      this.$refs.modelContainer.appendChild(this.renderer.domElement);

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0x404040, 2); // 环境光
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);

      // 添加OrbitControls控件
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // 启用阻尼效果
      this.controls.dampingFactor = 0.1; // 阻尼系数

      // 启动动画循环
      this.animate();
    },
    // loadModel(url) {
    //   //   const loader = new GLTFLoader();
    //   //   loader.load(this.modelUrl, (gltf) => {
    //   //     this.scene.add(gltf.scene);
    //   //   });
    //   const loader = new GLTFLoader();
    //   loader.load(
    //     this.modelUrl,
    //     (gltf) => {
    //       this.scene.add(gltf.scene);
    //       console.log(gltf);
    //     },
    //     (xhr) => {
    //       console.log(xhr);
    //       console.log(
    //         `模型加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`
    //       );
    //     },
    //     (error) => {
    //       console.error("模型加载出错:", error);
    //     }
    //   );
    // },
    // loadModel() {
    //   const loader = new GLTFLoader();

    //   // 使用 DracoLoader 进行压缩
    //   const dracoLoader = new DRACOLoader();
    //   dracoLoader.setDecoderPath("/path/to/draco/"); // 替换为 Draco 解码路径
    //   loader.setDRACOLoader(dracoLoader);

    //   loader.load(
    //     this.modelUrl,
    //     (gltf) => {
    //       this.scene.add(gltf.scene);
    //       console.log(gltf);
    //     },
    //     (xhr) => {
    //       console.log(
    //         `模型加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`
    //       );
    //     },
    //     (error) => {
    //       console.error("模型加载出错:", error);
    //     }
    //   );
    // },
    loadModel() {
      this.loading = true; // 显示加载进度条

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/public/draco/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        this.modelUrl,
        (gltf) => {
          this.scene.add(gltf.scene);
          this.loading = false; // 隐藏加载进度条
        },
        (xhr) => {
          this.progress = ((xhr.loaded / xhr.total) * 100).toFixed(2); // 更新进度百分比
          //   if (this.progress === Infinity) {
          //     this.value = 0;
          //   }
        },
        (error) => {
          console.error("模型加载出错:", error);
          this.loading = false; // 加载出错时隐藏进度条
        }
      );
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update(); // 更新OrbitControls
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style scoped lang="less">
.model-container {
  width: 100%;
  height: calc(100vh - 1.5rem);
  overflow: hidden;
  position: relative;
  .content {
    width: 100%;
    height: 100%;
  }
  .progress-bar-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    text-align: center;
    color: #fff;
    .progress-bar {
      height: 8px;
      background: #6599ca;
      border-radius: 5px;
      transition: width 0.2s ease;
    }
    .progress-text {
      margin-top: 10px;
      font-size: 14px;
    }
  }
}
</style>
