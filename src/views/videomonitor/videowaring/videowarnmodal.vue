<template>
        <div style="height: 7rem;" v-loading="loading">
                <el-row>
                        <el-col :span="singedata.video ? 8 : 24">
                              <div>点位id_名称：{{ singedata.cameraId }}_{{ singedata.cameraName }}</div>
                                <div>报警类型：{{ singedata.alertType }}
                                    </div>
                                <div>报警时间： {{ singedata.createdAt }}
                                    </div>
                                <img :src="singedata.url" style="width: 100%;margin-top: 0.5rem;max-height:5.5rem"
                    class="hover-zoom" @click="imgdialog = true">
                            </el-col>
                        <el-col :span="singedata.video ? 12 : 24" :offset="1" v-if="!loading && singedata.video">
                                 <hkvideo :data="camera" :newId="'dialog01'" style="height: 400px;width: 500px;">
                                    </hkvideo>
                            </el-col>
                    </el-row>
        <el-dialog :modal="false" title="" :visible.sync="imgdialog" @close="imgdialog = false" fullscreen
            custom-class="imgdialog2" top="1rem" :bodyStyle="bodyStyle">
            <!-- <div style="width: 10rem;height: 10rem;"> -->
            <img :src="singedata.url" style="width: 20rem;height:20rem;" />
            <!-- </div> -->
        </el-dialog>
           
    </div>
</template>

<script>
import hkvideo from '../components/hkvideo.vue';
export default {
    props: ['taskInfo'],

    data() {
        return {
            singedata: {},
            loading: false,
            camera: {},
            imgdialog: false,
            bodyStyle: {
                'overflow': 'auto'
            }
        }
    },
    components: { hkvideo },
    methods: {
        parseRtspUrl() {
            let url = this.singedata.cameraUrl
            try {
                // 正则表达式用于匹配 RTSP URL 的各个部分
                const rtspRegex = /^rtsp:\/\/(?<userName>[^:]+):(?<passWord>[^@]+)@(?<nvrAddress>[^:/]+)(?::(?<rtspPort>\d+))?\/Streaming\/Channels\/(?<channelID>\d{3,4})\?(?<queryParams>.*)$/;

                const match = url.match(rtspRegex);
                if (!match || !match.groups) {
                    throw new Error('Invalid RTSP URL format');
                }

                const { userName, passWord, nvrAddress, rtspPort = '554', channelID, queryParams } = match.groups;

                // 解析查询参数
                const queryParamPairs = {};
                queryParams.split('&').forEach(pair => {
                    const [key, value] = pair.split('=');
                    if (key && value) {
                        queryParamPairs[key] = value;
                    }
                });

                const transStream = queryParamPairs.transportmode === 'unicast';

                // 提取通道号和流类型
                const channelNumber = parseInt(channelID.slice(0, channelID.length - 2), 10); // 前几位作为通道号
                const streamType = parseInt(channelID.slice(-2), 10); // 后两位作为流类型

                // 构建最终对象
                return {
                    analogMode: false,
                    rtspPort: rtspPort,
                    nvrAddress: nvrAddress,
                    userName: userName,
                    passWord: passWord,
                    port: '80', // 默认 HTTP 端口，可以根据实际情况调整
                    channelID: channelNumber, // 通道号
                    transStream: transStream,
                    streamType: streamType // 流类型
                };
            } catch (error) {
                console.error(`Error parsing RTSP URL "${url}":`, error.message);
                throw error; // 重新抛出错误以便外部处理
            }
        },
        // // 使用示例
        // const str = "rtsp://username:password@192.168.20.248:554/Streaming/Channels/1101?transportmode=unicast";
        // const parsedObject = parseRtspUrl(str);
        // console.log(parsedObject);
    },
    mounted() {
        this.loading = true
        this.singedata = this.taskInfo
        console.log(this.singedata)
        // setTimeout(() => {
        // this.singedata = {
        //     "parameter": {
        //         "roiList": []
        //     },
        //     "picture": "picture/20230613/20230613144252_722054_4_21_alarm.jpg",
        //     "srcUrl": "http://192.168.0.106:8081/files/originPicture/20230613/20230613144252_722054_4_21 _src.jpg?serverUUID = 3 f16a3b113234807b81f6f8d0f268232 ",
        //     "resultData": {
        //         "classId": 1,
        //         "score": 0,
        //         "objectList": [{
        //             "classId": 0,
        //             "score": 0.727403,
        //             "scoreList": [
        //                 0.727403,
        //                 0.558674,
        //                 1
        //             ],
        //             "rect": {
        //                 "x": 1285,
        //                 "y": 804,
        //                 "width": 217,
        //                 "height": 265
        //             }
        //         }]
        //     },
        //     "extraInfo": {},
        //     "result": "resultJson/20230613/20230613144252_722054_4_21_result.json?serverUUID = 3f16a3b113234807b81f6f8d0f268232 ",
        //     "video": null,
        //     "other": "",
        //     "alarm": "picture/20230613/20230613144252_722054_4_21_alarm.jpg?serverUUID = 3 f16a3b113234807b81f6f8d0f268232 ",
        //     "src": "originPicture/20230613/20230613144252_722054_4_21_src.jpg?serverUUID = 3 f16a3b113234807b81f6f8d0f268232 ",
        //     "alarmPicData": "",
        //     "alarmPicName": "20230613144252_722054_4_21_alarm.jpg",
        //     "srcPicName": "20230613144252_722054_4_21_src.jpg",
        //     "srcPicData": "",
        //     "imageHeight": 1080,
        //     "alarmUrl": "https://5b0988e595225.cdn.sohucs.com/images/20180206/e0cda08a97574f098f06dccfc51e7821.jpeg",
        //     "taskId": 4,
        //     "cameraId": 21,
        //     "cameraUrl": "rtsp://admin:ZG20241019@200.150.100.252/Streaming/Channels/101?transportmode=unicas",
        //     "cameraName": "10666",
        //     "timestamp": 1686638572,
        //     "imageWidth": 1920,
        //     "algorithmId": 4,
        //     "algorithmName": "行人闯入",
        //     "algorithmNameEn": "CR_PERSON_INVASION",
        //     "cameraDeviceForeignKey": null,
        //     "cameraDeviceType": 1,
        //     "cameraDeviceStreamUrl": "rtsp://admin:ZG20241019@200.150.100.252/Streaming/Channels/101?transportmode=unicast",
        //     "cameraDeviceStatus": 1,
        //     "cameraDeviceGroup": "未分组",
        //     "cameraDeviceGps": "",
        //     "cameraDeviceName": "10666",
        //     "cameraDeviceId": 21,
        //     "dataID": "984f8f7809c611eeb9270242c0a8700d"
        // }
        // this.camera = this.parseRtspUrl()
        // setTimeout(() => {
        this.loading = false

        // }, 1000)
        // console.log('22323', this.camera);
        // }, 1000)
    }

}
</script>

<style></style>