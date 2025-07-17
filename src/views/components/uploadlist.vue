<template>
  <div style="display: inline-block">
    <el-upload
      style="display: inline-block"
      :action="uploadUrl"
      name="file"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :show-file-list="false"
    >
      <i class="el-icon-upload2 download"></i>
      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        id="show_loading2"
        v-if="loading"
        style="width: 0.3rem"
      />
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png/jpeg文件，且不超过500kb
      </div>
    </el-upload>
    <!-- <i class="el-icon-upload2 el-icon-upload3 download"></i> -->
    <!-- <span style="color: grey"> （文件需小于500kb） </span> -->
  </div>
</template>
<script>
export default {
  props: ["uploadAction", "showloading2", "filelistdata"],
  data() {
    return {
      actionAddress: "",
      ifAction: false,
      uploadUrl: "",
      filelist: [],
      loading: false,
    };
  },
  methods: {
    //  上传成功
    handleSuccess(msg) {
      document.getElementById(this.showloading2).style.display = "none";
      console.log(msg);
      if (msg.code == "200") {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.filelist.push(msg.url);
        this.$emit("imageshow", this.filelist);
      } else {
        if (msg.msg == "File with the same name already exists") {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: "有重复文件名存在!请更改文件名重新上传！",
            duration: 0,
            showClose: true,
            type: "warning",
          });
          this.ifAction = false;
        }
      }
      this.loading = false;
    },
    // 上传文件类型
    async beforeUpload(file) {
      console.log((file.size / 1024 / 1024 / 1024) * 1000000);
      this.loading = true;
      this.uploadUrl = "";
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "png";
      const extension2 = fileName[fileName.length - 1] === "jpg";
      const extension3 = fileName[fileName.length - 1] === "jpeg";
      const isLt2M = (file.size / 1024 / 1024 / 1024) * 1000000;
      console.log(isLt2M);
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传模板只能是png、jpg格式!",
          type: "warning",
        });
        this.ifAction = false;
      } else {
        if (isLt2M > 500) {
          this.$message({
            message: "文件大于500kb！",
            type: "warning",
          });
        } else {
          // this.show_loading=true;
          const confirm = await this.$confirm("确定上传文件？", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "上传",
            cancelButtonText: "取消",
          })
            .then(() => {
              this.uploadUrl = this.uploadAction;
              this.ifAction = true;
              return true;
            })
            .catch(() => {
              return false;
            });
          // console.log(confirm)
          return extension || extension2;
        }
      }
    },
    handleError(error) {
      console.log(error);
      console.log(this.showloading2x);
      if (error && String(error).indexOf("<!DOCTYPE html>") < 0) {
        this.$message({
          message: "上传失败",
          type: "warning",
          duration: 0,
          showClose: true,
        });
      }
      document.getElementById(this.showloading2).style.display = "none";
      this.ifAction = false;
    },
  },
  mounted() {
    this.filelist = this.filelistdata
      ? JSON.parse(JSON.stringify(this.filelistdata))
      : [];
    // document.getElementsByClassName("el-upload-list")[0].style.display = "none";
  },
  computed: {
    files() {
      return this.filelistdata;
    },
  },
  watch: {
    files() {
      this.filelist = this.filelistdata
        ? JSON.parse(JSON.stringify(this.filelistdata))
        : [];
    },
  },
};
</script>
<style>
.el-message {
  overflow: auto;
  max-height: 350px;
}
.el-icon-upload3 {
  color: rgb(192, 192, 192);
  cursor: auto;
}
</style>
