<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content" :style="modalStyle" @mousedown="startDrag">
        <img :src="imageUrl" alt="Expanded Image" />
        <span class="close-btn" @click.stop="close">&times;</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      imageUrl: String,
      visible: Boolean
    },
    data() {
      return {
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
      };
    },
    computed: {
      modalStyle() {
        return {
          transform: `translate(${this.offsetX}px, ${this.offsetY}px)`
        };
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      startDrag(event) {
        this.startX = event.clientX - this.offsetX;
        this.startY = event.clientY - this.offsetY;
  
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.endDrag);
      },
      drag(event) {
        this.offsetX = event.clientX - this.startX;
        this.offsetY = event.clientY - this.startY;
  
        this.$forceUpdate(); // 强制更新视图以反映新的偏移量
      },
      endDrag() {
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.endDrag);
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    position: absolute;
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    cursor: move;
    user-select: none;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  </style>