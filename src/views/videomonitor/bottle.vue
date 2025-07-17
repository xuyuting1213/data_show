<template>
    <div class="introdunction">
        <div class="base_list highlight" style="padding:10px">
            <!-- <el-tabs v-model="activeName" type="card" style="height: 100%">
            <el-tab-pane label="实时" name="first" style="height: 100%"> -->
            <el-radio-group v-model="activeName">
                <el-radio-button label="实时"> </el-radio-button>
                <el-radio-button label="回放"></el-radio-button>
            </el-radio-group>
            <div v-if="activeName == '实时'">
                <el-row>
                    <el-col :span="6" v-for="(camera, index) in cameras" :key="index"
                        style="height: 300px; width: 500px">
                        <VideoBox class="video-player" ref="'videoBox'" :muted="true" :mode="camera.mode"
                            :newId="camera.id" :data="camera" style="height: 300px; width: 500px" />
                    </el-col>
                </el-row>
            </div>

            <div v-if="activeName == '回放'">
                <el-row>
                    <el-col :span="6" v-for="(camera, index) in cameras" :key="index"
                        style="height: 300px; width: 500px">
                        <Backvideo class="video-player" :muted="true" ref="video2" :newId="camera.id" :data="camera"
                            style="height: 300px; width: 500px"></Backvideo>
                    </el-col>
                </el-row>
            </div>
            <div style="width: 50%; text-align: center; position: fixed; bottom: 0.1rem">
                <Navbar></Navbar>
            </div>
        </div>
    </div>
</template>

<script>
import VideoBox from "./components/VideoBox.vue";
import Backvideo from "./components/backvideo.vue";
import { queryVideoDevice } from "@/api/watch/video/videodevice.js";
import { queryVideoSite } from "@/api/watch/video/videosite.js";
import Navbar from "../components/Navbar";
import { getHKData, getRTSPData } from "@/utils/hkconfig";
import axios from "axios";
let array = [];
for (let index = 0; index < 20; index++) {
    array.push({
        title: "转化1-工作服检测转化预警" + index,
        date: "2024-09-30 13:54",
    });
}
export default {
    components: { VideoBox, Backvideo, Navbar },
    data() {
        return {
            activeName: "实时",
            array: array,
            videoSite: 1, //视频站点
            cameras: [
                {
                    //   mode: "preview", //浏览模式
                    //   id: "divGaoluTG", //显示控件的id
                    //   ip: "200.150.100.252",
                    //   userName: "admin",
                    //   passWord: "ZG20241019", //密码
                    //   rtspPort: 554,
                    //   transStream: true, //转码标志
                    //   port: 80, //访问端口
                    //   channelID: 1, //通道
                    //   loadingTime: "3000",
                    //   streamType: 1,
                    //   videoWidth: 800,
                    //   videoHeight: 400,
                    //   title: "高炉铁沟",
                    id: "01",
                    ip: "200.150.100.252",
                    userName: "admin",
                    passWord: "ZG20241019", //密码
                    rtspPort: 554,
                    transStream: false, //转码标志
                    port: 80, //访问端口
                    channelID: 1, //通道
                    loadingTime: "3000",
                    streamType: 1,
                    analogMode: false,
                    videoHeight: 100,
                    title: "camera 01",
                    mode: "preview", //浏览模式
                    videoWidth: 500,
                    videoHeight: 300,
                },
                // {
                //     id: "02",
                //   ip: "200.150.100.252",
                //   userName: "admin",
                //   passWord: "ZG20241019", //密码
                //   rtspPort: 554,
                //   transStream: false, //转码标志
                //   port: 80, //访问端口
                //   channelID: 1, //通道
                //   loadingTime: "3000",
                //   streamType: 1,

                //   videoHeight: 100,
                //   title: "camera 01",
                //   mode: "preview", //浏览模式
                //   videoWidth: 500,
                //   videoHeight: 300,
                // },
            ], //摄像头列表
        };
    },
    methods: {
        updateVideoDvices(rows) {
            var vdList = rows;
            // console.log(rows);
            this.cameras = []; //摄像头列表
            for (var i = 0; i < vdList.length; i++) {
                var videoTitle = vdList[i].name; //标题为设备的名称
                var parameterString = vdList[i].parameterString; //得到桉树字符串
                var protocol = vdList[i].protocol; //当前设备的通讯协议
                this.cameras = []; //摄像头列表
                var camera = { id: vdList[i].id + "", siteId: vdList[i].siteId }; //得到了设备id和站点id的信息
                this.cameras.push(camera);
                try {
                    var parameterdata = JSON.parse(parameterString);
                    console.log("parameter", parameterdata);
                    if (parameterdata) {
                        camera.protocol = protocol; //设置通讯协议
                        if (protocol == "hkvideo") {
                            //如果海康的视频
                            var hkData = getHKData(parameterdata);
                            camera.hkData = hkData;

                        } else if (protocol == "rtsp") {
                            var rtspData = getRTSPData(parameterdata);
                            camera.rtspData = rtspData;
                        }
                    }
                    console.log("read camera:", camera); //更新摄像头的数据
                } catch (e) {
                    console.warn(
                        "parse video device " + videoTitle + " 参数字符串出错:" + e.message
                    );
                }
            }
        },
    },
    mounted() {
        console.log(this.$route.fullPath.split("/"));
        if (this.$route.fullPath.split("/").length) {
            let siteId =
                this.$route.fullPath.split("/")[
                this.$route.fullPath.split("/").length - 1
                ];
            queryVideoDevice({
                pageNum1: 1,
                pageSize: 10000,
                siteId: siteId,
            }).then((res) => {
                console.log("res.rows", res.rows);
                // res.code = 401;
                if (res.code != 200) {
                    this.$message({
                        type: "warning",
                        message: "认证失败,重新登录",
                        //   duration: 0,
                        showClose: true,
                    });
                    setTimeout(() => {
                        this.$router.push("/");
                    }, 2000);
                } else {
                    //更新视频设备信息
                    this.updateVideoDvices(res.rows);
                }
            });
        }
    },
    watch: {
        activeIndex(newvalue, oldvalue) {
            if (newvalue.split("/").length) {
                let siteId = newvalue.split("/")[newvalue.split("/").length - 1];
                queryVideoDevice({
                    pageNum1: 1,
                    pageSize: 10000,
                    siteId: siteId,
                }).then((res) => {
                    console.log(res.rows);
                    if (res.code != 200) {
                        this.$message({
                            type: "warning",
                            message: "认证失败,重新登录",
                            //   duration: 0,
                            showClose: true,
                        });
                        setTimeout(() => {
                            this.$router.push("/");
                        }, 2000);
                    } else {
                        //更新视频设备信息
                        this.updateVideoDvices(res.rows);
                    }
                });
            }
        },
    },
    computed: {
        activeIndex() {
            return this.$route.path;
        },
    },
};
</script>

<style lang="less">
// .warning {
//     width: 367px;
//     height: calc(100vh - 72px);
//     // background: url(../../assets/images/right.png) no-repeat center center;
//     background-size: 100% 100%;
//     position: relative;
//     //   animation: showRight 1s;
//     //   float: right;
// }

.listitem {
    color: white !important;
    padding: 10px 10px 0px 40px;

    &:hover {
        background: #335984c9 !important;
    }

    .title {
        font-size: 14px;
    }

    .date {
        font-size: 12px;
        color: rgb(155, 155, 155);
    }

    .vedio {
        margin-top: 20px;
    }
}
</style>