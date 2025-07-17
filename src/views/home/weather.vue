<template>
    <span>{{ weather.temperature }} °C {{ weather.weather }} {{ weather.windDirection }}风：{{ weather.windPower }}级 {{
        weather.pressure }}</span>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
    name: "map-view",
    mounted() {
        this.initAMap();
        this.timer = setInterval(() => {
            this.getCityWeather()
        }, 300000);
    },

    data() {
        return {
            weather: {},
            timer: null
        }
    },
    methods: {
        initAMap() {
            window._AMapSecurityConfig = {
                securityJsCode: "0880215613b23afb6984e5798737c355",
            };
            AMapLoader.load({
                key: "e2286ba58bd9621be85e31415c7e03d6", // 申请好的Web端开发者Key，首次调用 load 时必填
            })
                .then((AMap) => {
                    this.getCityWeather()
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        // 获取天气
        getCityWeather() {
            //加载天气查询插件
            var that = this
            AMap.plugin('AMap.Weather', function () {
                //创建天气查询实例
                let weather = new AMap.Weather();
                //执行实时天气信息查询
                weather.getLive('高邮市', function (err, data) {
                    // console.log(err, data);
                    if (data.info == 'OK') {
                        that.weather = data
                    }
                });

            });
        },
    },
};
</script>
<style scoped></style>