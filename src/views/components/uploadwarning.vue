<template>
    <div style="display: inline-block">
        <el-upload :action="uploadUrl" name="file" :on-success="handleSuccess" :on-error="handleError" v-if="!currturl"
            :before-upload="beforeUpload" :http-request="customRequest" :show-file-list="false" accept=".png,.jpg">
            <i class="el-icon-upload2 download"></i>
            <img src="../../assets/images/loading.gif" class="loadgif" v-if="loading" style="width: 0.3rem" />
            <div class="el-upload__tip" slot="tip">
                只能上传 jpg/png/jpeg 文件，且不超过 500kb
            </div>
        </el-upload>
        <div style="width: 1rem" v-else>
            <img style="width: 1rem; height: 1rem" :src="currturl" />
            <div style="width: 1rem">
                <span style="color: #247cc3; cursor: pointer" @click="cancelImg">取消</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import reportapi from "@/api/reportapi";
import { getToken } from '@/utils/auth';

export default {
    props: ["fileurl"],
    data() {
        return {
            uploadUrl: "http://222.189.207.202:801/mes/watch/alarmworkorder/uploadPic", // 上传接口地址
            loading: false, // 上传状态
            fileId: "", // 从接口获取的文件 ID
            action_flag: false,
            fileList: [],//http://222.189.207.202:801/upload/images/
            currturl: ""
        };
    },
    methods: {
        cancelImg() {
            this.fileList = []
            this.currturl = ""
        },
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

                this.action_flag = true;
                return true;
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
                formData.append("file", file);

                // 将 entity 参数转换为 JSON 字符串并添加到 FormData 中
                // const entityJson = this.uploadparams;
                // formData.append("entity", entityJson); // 确保键名与后端期望的一致

                axios.post(this.uploadUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": getToken('Admin-Token'),
                    },
                })
                    .then((response) => {
                        console.log(response.data);
                        if (response.data.code == '200') {
                            this.fileList = [file]
                            this.handleSuccess(response.data);
                            this.currturl = "http://222.189.207.202:801/upload/" + response.data.data
                        } else if (response.data.code == '401') {
                            this.$message({
                                type: "warning",
                                message: "登录已过期,自动重新登录",
                                //   duration: 0,
                                showClose: true,
                            });
                            this.disableTimer();
                            setTimeout(() => {
                                this.$router.push("/");
                            }, 2000);
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
            this.$emit("uploadFileName", response.data)
        },

        // 上传失败
        handleError(error) {
            this.loading = false;
            this.$message.error("文件上传失败：");
            console.error("上传失败：", error);
        },
    },
    mounted() {
        this.currturl = this.fileurl ? this.fileurl : ""
    }
};
</script>



<!-- <template>
    <div>
        <el-upload action="http://222.189.207.202:801/mes/watch/alarmworkorder/" :limit="1" v-if="fileList.length == 0"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :headers="uploadHeaders"
            :http-request="customRequest">
            <i class="el-icon-upload2 download"></i>
            <img src="../../assets/images/loading.gif" class="loadgif" v-if="loading" style="width: 0.3rem" />
            <div class="el-upload__tip" slot="tip">
                只能上传 jpg/png/jpeg 文件，且不超过 500kb
            </div>
        </el-upload>
        <div style="width: 1rem" v-else>
            <img style="width: 1rem; height: 1rem" src="currturl"/>
            <div style="width: 1rem">
                <span style="color: #247cc3; cursor: pointer" @click="cancelImg">取消</span>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';

export default {
    props: ["operateType", "uploadparams"],

    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            uploadHeaders: {
                Authorization: 'Bearer your-token-here', // 替换为实际的授权 token
            },
            fileList: [],
            loading: false,
            
        };
    },
    methods: {
        cancelImg() {
            this.fileList = []
        },
        // 自定义上传请求
        customRequest({ file, onSuccess, onError }) {
            this.loading = true
            const formData = new FormData();
            formData.append('picFile', file);

            // 假设还需要传 JSON 参数 b
            // const jsonData = this.uploadparams;
            // formData.append('entity', jsonData);

            fetch('http://222.189.207.202:801/mes/watch/alarmworkorder/uploadPic', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: getToken('Admin-Token'), // 替换为实际的授权 token
                },
            })
                .then(response => {
                    console.log(file.name, response);
                    if (response.ok) {
                        onSuccess(response); // 成功回调
                        this.fileList = [file]
                        this.loading = false
                    } else {
                        onError(new Error('上传失败'));
                        this.loading = false

                    }
                })
                .catch(error => {
                    onError(error); // 错误回调
                });
        },

        // 预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        // 删除文件
        handleRemove(file, fileList) {
            console.log('删除的文件:', file, '当前文件列表:', fileList);
            this.fileList = fileList
        },
    },
};
</script> -->