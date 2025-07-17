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
      :auto-upload="false"
      :http-request="customRequest"
      :on-change="testOnchange"
      ref="upload"
      :headers="myHeaders"
    >
      <i class="el-icon-upload2 download" slot="trigger"></i>

      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        id="show_loading2"
        v-if="loading"
        style="width: 0.3rem"
      />
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <!-- <i class="el-icon-upload2 el-icon-upload3 download"></i> -->
    <!-- <span style="color: grey"> （文件需小于500kb） </span> -->
  </div>
</template>
<script>
import { getToken, setToken } from "@/utils/auth";

import reportapi from "@/api/reportapi";
export default {
  props: ["uploadAction", "showloading2", "mp4", "referType"],
  data() {
    return {
      actionAddress: "",
      ifAction: false,
      uploadUrl: "",
      loading: false,
      extraparams: {
        relativeId: "",
        referType: this.referType,
        file: "",
      },
      authtoken: getToken("Report-Token"),
      myHeaders: {
        token: "",
      },
    };
  },
  methods: {
    // 文件状态改变
    testOnchange(file, fileList) {
      console.log(file);
      this.$confirm("确定上传文件？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "上传",
        cancelButtonText: "取消",
      })
        .then(() => {
          //   this.uploadUrl = this.uploadAction;
          reportapi.getReportId().then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.extraparams.relativeId = res.data.data;
              this.$refs.upload.submit();
            } else {
              this.$message.error("获取图片Id失败！请稍后重试！");
            }
          });
          document.getElementById(this.showloading2).style.display = "block";
          this.ifAction = true;
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    // this.$refs.upload.submit();调用
    // customRequest(file, fileList) {
    //   console.log(file, fileList);
    //   let that = this;

    //   const formdata = new FormData();
    //   formdata.append("file", file.file);
    //   formdata.append("relativeId", that.extraparams.relativeId);
    //   formdata.append("referType", that.extraparams.referType);
    //   reportapi.uploadFile(formdata).then((res) => {
    //     console.log(res.data);
    //     if (res.data.code == "2000") {
    //       this.$message.success("文件上传成功", res.data.data);
    //       // 1857316348720320512
    //       this.$emit("imgrelativeId", that.extraparams.relativeId);
    //     }
    //   });
    // },
    customRequest(file, fileList) {
      console.log(file, fileList);
      let that = this;

      const formdata = new FormData();
      formdata.append("file", file.file);
      formdata.append("relativeId", that.extraparams.relativeId);
      formdata.append("referType", that.extraparams.referType);
      reportapi.uploadFile(formdata).then((res) => {
        console.log(res.data);
        if (res.data.code == "2000") {
          this.$message.success("文件上传成功", res.data.data);
          // 1857316348720320512
          this.$emit("imgrelativeId", that.extraparams.relativeId);
        }
      });
    },
    //  上传成功
    handleSuccess(msg) {
      document.getElementById(this.showloading2).style.display = "none";
      console.log(msg);
      if (msg.code == "200") {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.$emit("imageshow", msg.url);
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
      // console.log(file.size);
      // console.log((file.size / 1024 / 1024 / 1024) * 1000000);
      // console.log((file.size / 1024 / 1024 / 1024)*1000);
      this.loading = true;

      this.uploadUrl = "";
      var fileName = new Array();
      fileName = file.name.split(".");
      // let video=["AVI","MOV","MKV","avi","mov","mkv"]
      const extension = !this.mp4
        ? ["png", "jpg"].indexOf(fileName[fileName.length - 1]) >= 0
        : ["png", "jpg", "avi", "mov", "mkv"].indexOf(
            fileName[fileName.length - 1]
          ) >= 0;
      const isLt2M = (file.size / 1024 / 1024 / 1024) * 1000000;
      const isLt2M2 = (file.size / 1024 / 1024 / 1024) * 1000;
      if (!extension) {
        this.$message({
          message: "上传模板只能是png、jpg格式!",
          type: "warning",
        });
        this.ifAction = false;
      } else {
        if (
          isLt2M > 500 &&
          ["png", "jpg", "jpeg"].indexOf(fileName[fileName.length - 1]) >= 0
        ) {
          this.$message({
            message: "文件大于500kb！",
            type: "warning",
          });
        } else if (isLt2M2 > 10) {
          this.$message({
            message: "文件大于10MB！",
            type: "warning",
          });
        } else {
          //   // this.show_loading=true;
          //   const confirm = await this.$confirm("确定上传文件？", "提示", {
          //     distinguishCancelAndClose: true,
          //     confirmButtonText: "上传",
          //     cancelButtonText: "取消",
          //   })
          //     .then(() => {
          //       //   this.uploadUrl = this.uploadAction;
          //       reportapi.getReportId().then((res) => {
          //         console.log(res);
          //         if (res.data.code == 200) {
          //           this.extraparams.relativeId = res.data.data;
          //           this.uploadUrl =
          //             "http://49.77.204.3:10088/prod-api/web/ironWarn/store/upload";
          //           //   console.log(this.uploadAction);
          //           console.log(this.extraparams);
          //         } else {
          //           this.$message.error("获取图片Id失败！请稍后重试！");
          //         }
          //       });
          //       document.getElementById(this.showloading2).style.display =
          //         "block";
          //       this.ifAction = true;
          //       return true;
          //     })
          //     .catch(() => {
          //       return false;
          //     });
          //   // console.log(confirm)
          //   return extension;
        }
      }
    },

    handleError(error) {
      console.log(error);
      //   console.log(this.showloading2x);
      if (error) {
        this.$message({
          message: "上传失败",
          type: "warning",
          duration: 0,
          showClose: true,
        });
      }
      document.getElementById(this.showloading2).style.display = "none";
      this.ifAction = false;
      this.loading = false;
    },
    reportimage() {
      console.log(this.extraparams);
    },
  },
  mounted() {
    reportapi.getReportToken().then((res) => {
      this.myHeaders.token = res.data.data;
    });
    // document.getElementsByClassName("el-upload-list")[0].style.display = "none";
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
