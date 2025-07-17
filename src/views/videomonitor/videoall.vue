<template>
    <div style="padding-top: 20px; padding: 10px; margin-top: 0.25rem" class="base_list highlight introduction">
        <!-- <div class="videotitle">{{ this.curr_area_video.name }}视频列表</div> -->
        <!-- <allSplit
        v-if="iChannelIDList.length"
        :loginIp="camerasInfo[0].hkData.nvrAddress"
        :port="camerasInfo[0].hkData.port"
        :username="camerasInfo[0].hkData.userName"
        :password="camerasInfo[0].hkData.passWord"
        :iChannelIDList="iChannelIDList"
      ></allSplit> -->
        <allSplit v-if="iChannelIDList.length" :loginIp="'200.150.100.252'" :port="'80'" :username="'admin'"
            :password="'ZG20241019'" :iChannelIDList="iChannelIDList"></allSplit>
        <div style="width: 50%; text-align: center; position: fixed; bottom: 0.1rem">
            <Navbar></Navbar>
        </div>
    </div>
</template>

<script>
import Navbar from "../components/Navbar";
import { queryVideoDevice } from "@/api/watch/video/videodevice.js";
import { getHKData, getRTSPData } from "@/utils/hkconfig";
// import VideoBox from "./components/VideoBox.vue";
import allSplit from "./components/all_split.vue";
export default {
    components: { Navbar, allSplit },
    data() {
        return {
            cameras: [],
            camerasInfo: [],
            curr_area_video: {},
            loading: false,
            iChannelIDList: [],
        };
    },
    methods: {
        async getVideoinfo(newVal) {
            if (!newVal) {
                console.error("curr_videoinfo 为空");
                return;
            }

            this.curr_area_video = JSON.parse(newVal);

            for (const item of this.curr_area_video.children) {
                const pathParts = item.path.split("/");
                if (pathParts.length > 0) {
                    const siteId = pathParts[pathParts.length - 1];
                    try {
                        const res = await queryVideoDevice({
                            pageNum1: 1,
                            pageSize: 10000,
                            siteId: siteId,
                        });

                        if (res.code == 200) {
                            this.updateVideoDvices(res.rows);
                        } else {
                            this.$message({
                                type: "warning",
                                message: "登录已过期,自动重新登录",
                                showClose: true,
                            });
                            setTimeout(() => {
                                this.$router.push("/");
                            }, 2000);
                            return false;
                        }
                    } catch (error) {
                        console.error(`查询 video device 失败: ${error.message}`);
                    }
                }
            }
            this.cameras.find(item => console.log(item.hkData.nvrAddress))
            // this.loginIp = this.cameras.find(item =>item.hkdData.nvrAddress.indexOf('192') < 0)

            this.cameras = this.filterData(this.cameras)
            console.log('aaaa', this.cameras);

            console.log('vvv', this.loginIp);
            this.cameras.map((item, index) => {
                item.loadingtime = index * 3500; // 根据 index 递增
                this.iChannelIDList.push(item.hkData.channelID);
            });

            this.camerasInfo = JSON.parse(JSON.stringify(this.cameras));
            // console.log(this.camerasInfo);

        },
        filterData(array) {
            const uniqueArray = array.reduce((acc, current) => {
                if (!acc.has(current.hkData.channelID)) {
                    acc.set(current.hkData.channelID, current);
                }
                return acc;
            }, new Map());

            // 将 Map 转换回数组
            const result = Array.from(uniqueArray.values());
            return result
            // console.log(result);
        },
        updateVideoDvices(rows) {
            let camera = {};
            rows.forEach((item, index) => {
                const videoTitle = item.name; // 标题为设备的名称
                const parameterString = item.parameterString; // 得到参数字符串
                const protocol = item.protocol; // 当前设备的通讯协议
                camera = { id: item.id + "", siteId: item.siteId }; // 得到了设备id和站点id的信息
                // camera.loadingtime = (index + 1) * 4000; // 根据 index 递增 loadingtime
                try {
                    const parameterdata = JSON.parse(parameterString);
                    if (parameterdata) {
                        camera.protocol = protocol; // 设置通讯协议
                        if (protocol === "hkvideo") {
                            // 如果海康的视频
                            const hkData = getHKData(parameterdata);
                            camera.hkData = hkData;
                            console.log('camera', camera);
                        } else if (protocol === "rtsp") {
                            const rtspData = getRTSPData(parameterdata);
                            camera.rtspData = rtspData;
                        }
                    }
                    this.cameras.push(camera);
                } catch (e) {
                    console.warn(
                        `parse video device ${videoTitle} 参数字符串出错: ${e.message}`
                    );
                }
            });
        },
    },
    mounted() {
        // // 检查 curr_videoinfo 是否已经存在
        // if (this.curr_videoinfo) {
        //   this.getVideoinfo(this.curr_videoinfo);
        // }
    },
    watch: {
        curr_videoinfo: {
            handler(newVal) {
                if (newVal) {
                    this.cameras = []; // 清空摄像头列表
                    this.camerasInfo = []; // 清空摄像头列表
                    this.iChannelIDList = [];
                    this.getVideoinfo(newVal);
                }
            },
            immediate: true, // 立即执行一次
            deep: true, // 深度监听对象的变化
        },
    },
    computed: {
        curr_videoinfo() {
            return this.$store.state.curr_videoinfo;
        },
    },
};
</script>