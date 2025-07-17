<template>
    <div>
        <!-- loading动画 -->
        <div class="loading">
            <div class="loadbox">
                <img src="../../assets/images/loading.gif" /> 页面加载中...
            </div>
        </div>
        <div class="head">
            <div class="notice">欢迎浏览秦邮企业安全风险预警系统!</div>
            <h1>秦邮安全风险预警系统</h1>
            <div class="weather">
                <div class="date">
                    <weather></weather>
                    {{ date + " " + time }}
                </div>
            </div>
            <systemmanage></systemmanage>
            <!-- <el-tooltip class="item" content="退出系统" placement="top-start">
                <i class="el-icon-download" @click="logout" style="
            font-size: 0.3rem;
            color: white;
            position: absolute;
            right: 0.1rem;
            top: 0.1rem;
            rotate: -90deg;
            cursor: pointer;
          "></i>
            </el-tooltip> -->

            <!-- <img src="../../assets/images/image (3).jpg" style="width: 1rem;background: transparent"/> -->
            <!-- <el-icon type="login"></el-icon> -->
        </div>
    </div>
</template>
<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
import weather from "../home/weather.vue";
import systemmanage from "./systemmanage.vue";
// import { getWether } from "../../api/wether/wether";
import $ from "jquery";
import { getInfo } from "@/api/login";

export default {
    data() {
        return {
            date: "",
            time: "",
            wea: "",
            tem: "",
            wea_img: "",
        };
    },
    components: { weather, systemmanage },
    created() {
        // this.getAuthInfo()
        this.getTimes();
        // this.getTimesInterval();
    },
    mounted() {
        $(window).ready(function () {
            $(".loading").fadeOut();
        });
    },
    methods: {
 
        //获取时间
        getTimes() {
            setInterval(this.getTimesInterval, 1000);
        },
        getTimesInterval: function () {
            let _this = this;
            let year = new Date().getFullYear(); //获取当前时间的年份
            let month = new Date().getMonth() + 1; //获取当前时间的月份
            let day = new Date().getDate(); //获取当前时间的天数
            let hours = new Date().getHours(); //获取当前时间的小时
            let minutes = new Date().getMinutes(); //获取当前时间的分数
            let seconds = new Date().getSeconds(); //获取当前时间的秒数
            //当小于 10 的是时候，在前面加 0
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            //拼接格式化当前时间
            _this.date = year + "-" + month + "-" + day;
            _this.time = hours + ":" + minutes + ":" + seconds;
        },
        // // 获取天气
        // getWeaAndTem() {
        //     const dataList = {
        //         appid: "55297681", // 账号ID
        //         appsecret: "PZcXgN1m", // 账号密钥
        //         city: "南充", // 城市名称,不要带市和区
        //         version: "v61",
        //     };
        //     getWether(dataList).then((res) => {
        //         this.wea = res.data.wea;
        //         this.tem = res.data.tem;
        //         this.wea_img = res.data.wea_img;
        //     });
        // },
    },
};
</script>
<style>
.loading {
    position: fixed;
    left: 0;
    top: 0;
    font-size: 18px;
    z-index: 100000000;
    width: 100%;
    height: 100%;
    background: #1a1a1c;
    text-align: center;
}

.loadbox {
    position: absolute;
    width: 160px;
    height: 150px;
    color: #aaa;
    left: 50%;
    top: 50%;
    margin-top: -100px;
    margin-left: -75px;
}

.loadbox img {
    margin: 10px auto;
    display: block;
    width: 40px;
}

.head {
    height: 66px;
    background: url(../../assets/images/head3.png) no-repeat center center;
    background-size: 110% 110%;
    z-index: 100;
    animation: showhead 1s;
    margin-top: -10px;
}

@keyframes showhead {
    from {
        top: -200rem;
    }

    to {
        top: 0;
    }
}

.head h1 {
    font-weight: bold;
    text-align: center;
    background-image: linear-gradient(#fff,
            rgb(229, 245, 252),
            rgb(113, 196, 235),
            rgb(17, 159, 215));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    /*需要文字透明*/
    font-size: 30px;
    line-height: 75px;
    letter-spacing: 10px;
    height: 66px;
}

.head h1 img {
    width: 1.5rem;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.2rem;
}

.weather {
    position: absolute;
    right: 0.3rem;
    top: 0;
    line-height: 0.5rem;
}

.weather .date {
    font-size: 0.2rem;
    color: white;
    margin-right: 20px;
}

.weather img {
    width: 0.37rem;
    display: inline-block;
    vertical-align: middle;
}

.weather span {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.18rem;
    padding-right: 0.1rem;
}

.notice {
    position: absolute;
    left: 0.3rem;
    line-height: 56px;
    color: #3dcbef;
    font-size: 0.2rem;
}
</style>
