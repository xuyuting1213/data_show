<template>
  <div style="display: inline-block">
    <el-upload
      :action="uploadUrl"
      name="file"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :http-request="customRequest"
      :show-file-list="false"
      accept=".png,.jpg"
    >
      <i class="el-icon-upload2 download"></i>
      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        v-if="loading"
        style="width: 0.3rem"
      />
      <div class="el-upload__tip" slot="tip">
        只能上传 jpg/png/jpeg 文件，且不超过 500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
import axios from "axios";
import reportapi from "@/api/reportapi";
export default {
  props: ["referType"],
  data() {
    return {
      uploadUrl: "/api/function/upload", // 上传接口地址

      // uploadUrl: "/api/function/upload", // 上传接口地址
      loading: false, // 上传状态
      fileId: "", // 从接口获取的文件 ID
      action_flag: false,
    };
  },
  methods: {
    // 上传前处理
    async beforeUpload(file) {
      const allowedExtensions = ["png", "jpg"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // 文件类型校验
      if (!allowedExtensions.includes(fileExtension)) {
        this.$message.warning("只能上传 jpg/png 格式的文件！");
        return false;
      }

      // 文件大小校验（限制 500kb）
      const isLt500KB = file.size / 1024 <= 500;
      if (!isLt500KB) {
        this.$message.warning("文件大小不能超过 500kb！");
        return false;
      }

      // 显示确认框
      try {
        await this.$confirm("确定上传文件？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 请求接口获取文件 ID
        const response = await reportapi.getReportId();
        if (response.data.code === 200) {
          this.fileId = response.data.data; // 假设返回的 ID 在 `data` 字段中
          this.loading = true; // 开启加载动画
          this.action_flag = true;
          return true;
        } else {
          this.$message.error("获取文件 ID 失败：" + response.data.message);
          this.action_flag = false;
          return false;
        }
      } catch (error) {
        this.$message.info("取消上传");
        console.log("不上传");
        this.action_flag = false;

        return false;
      }
    },

    // 自定义上传请求
    customRequest({ file }) {
      if (this.action_flag) {
        const formData = new FormData();

        // 替换文件名为获取的 ID
        const fileExtension = file.name.split(".").pop();
        //   console.log(f);
        const renamedFile = new File(
          [file],
          `${this.fileId}.${fileExtension}`,
          {
            type: file.type,
          }
        );

        // 添加文件和其他参数
        formData.append("file", renamedFile);
        formData.append("relativeId", this.fileId);
        formData.append("referType", this.referType);
        //   formData.append("fileId", this.fileId); // 如果接口需要额外参数
        console.log(formData);
        // 使用 Axios 发送请求
        axios
          .post(this.uploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log(response.data);
            if (response.data.code == 200) {
              this.handleSuccess(response.data);
              this.$emit("imageshow", response.data.url);
            } else {
              this.handleError(response.data.message);
            }
          })
          .catch((error) => {
            this.handleError(error);
          });
      }
    },

    // 上传成功
    handleSuccess(response) {
      this.loading = false;
      this.$message.success("文件上传成功！");
      console.log("文件上传成功：", response);
    },

    // 上传失败
    handleError(error) {
      this.loading = false;
      this.$message.error("文件上传失败：");
      console.error("上传失败：", error);
    },
  },
};
</script>
