<template>
    <div>
        <!-- <span>{{ curr_clickdata }}</span> -->
        <div>
            <el-button :type="default_info == '实时数据刷新中...' ? 'primary' : 'info'" @click="startTimer"
                icon="el-icon-video-play">查看实时</el-button>

            <el-button :type="default_info == '' ? 'primary' : 'info'" @click="filterdata"
                icon="el-icon-search">自定义筛选</el-button>
        </div>
        <div v-if="default_info == '实时数据刷新中...'">
            <el-button type="text" @click="stoptime" icon="el-icon-video-pause">停止</el-button>
        </div>
        <div style="margin:0.1rem 0rem 0.1rem" v-if="default_info">
            <span>{{ default_info }}
                <span v-if="default_info == '实时数据刷新中...'">，已刷新{{ time_value }}s</span>
            </span>
        </div>
        <div v-if="!default_info" style="margin-top: 0.1rem;">
            <div>
                <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始时间"
                    size="small" end-placeholder="结束时间" @change="changetime">
                </el-date-picker>
            </div>
            <div style="margin: 0.1rem 0;">
                <el-input-number v-model="interval" class="chartinput" label="请选择时间搜索间隔"
                    size="small"></el-input-number>秒
                (例：若输入10，则按10s间隔返回数据)
            </div>
            <div>
                <el-input-number v-model="num" class="chartinput" label="请输入显示条目数限制" size="small"></el-input-number>
                (例：若输入100，则返回该时间段内前100条数据)
                <el-button type="primary" @click="searchdata" icon="el-icon-search" style="float: right;">查询</el-button>

            </div>

        </div>
        <div :id="chartId" class="echarts-container" v-loading="loading"></div>

    </div>
</template>

<script>
import * as echarts from 'echarts';
import { querySingleCurve, queryCurve } from "@/api/watch/devicecurve";
import moment from 'moment'

export default {
    name: 'LineChart',
    props: {
        chartId: {
            type: String,
            required: true
        },
        // chartData: {
        //     type: Object,
        //     required: true
        // },
        curr_clickdata: {
            type: Object,
            required: false
        },
    },
    data() {
        return {
            chartInstance: null,
            timer_chart: null,
            chartData: {
                xData: [],
                yData: [],
                seriesName: ''
            },
            // default_info: "默认显示近一小时的CO的数据",paramRemark channelName
            default_info: `默认显示近一小时 ${this.curr_clickdata.channelName ? 'CO' : this.curr_clickdata.paramRemark} 的数据`,
            value1: [moment().subtract(1, 'hours'), moment()],
            interval: 0,
            num: 3600,
            starttime: moment().subtract(1, 'hours'),
            endtime: moment(),
            loading: true,
            time_value: 0
        };
    },
    mounted() {
        // this.initChart();
        this.getOneLine('init');
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    },
    methods: {
        stoptime() {
            this.default_info = `默认显示近一小时 ${this.curr_clickdata.paramRemark} 的数据`
            this.disableTimerchart()
        },
        changetime(value) {
            // console.log(value);
            this.value1 = [moment(value[0]), moment(value[1])]
        },
        searchdata() {
            console.log(this.value1);
            console.log(this.interval);
            console.log(this.num);
            this.getOneLine();

        },
        filterdata() {
            this.disableTimerchart()
            this.default_info = ""
            this.chartData.xData = []
            this.chartData.yData = []
            this.updateChart()
        },
        disableTimerchart() {
            // console.log("hhh", this.timer);
            if (this.timer_chart != null) {
                this.time_value = 0
                clearInterval(this.timer_chart);
                this.timer_chart = null;
            }
        },
        startTimer() {
            this.loading = true

            this.interval = 0
            this.num = 3600
            if (this.timer_chart) clearInterval(this.timer_chart); // 清除已有定时器
            this.default_info = "实时数据刷新中..."
            this.timer_chart = setInterval(async () => {
                this.value1 = [moment().subtract(1, 'hours'), moment()]
                this.time_value = this.time_value + 2
                await this.getOneLine();
            }, 2000); // 每隔5秒获取一次新数据
        },
        stopTimer() {
            if (this.timer_chart) {
                clearInterval(this.timer_chart);
                this.timer_chart = null;
            }
        },
        async getOneLine(value) {
            this.starttime = this.value1[0].format('YYYY-MM-DD HH:mm:ss');
            this.endtime = this.value1[1].format('YYYY-MM-DD HH:mm:ss');
            var qp1 = { "paramId": this.curr_clickdata.paramId, startTime: this.starttime, endTime: this.endtime, interval: this.interval, limit: this.num };

            try {
                let resp1 = await querySingleCurve(qp1);
                if (value == 'init') {
                    this.initChart();
                }
                this.updateChartData(resp1.data);

                // 更新图表数据，而不是直接push到数组中
            } catch (error) {
                console.error('Failed to fetch new line data:', error);
                this.loading = false
                this.$message.error("查询出错！")
            }
        },
        updateChartData(newData) {
            // 清空旧的数据
            this.chartData.xData = [];
            this.chartData.yData = [];

            // 添加新数据
            newData.forEach(item => {
                this.chartData.xData.push(item.ts);
                this.chartData.yData.push(item.val);
            });
            this.updateChart();
            // 如果需要保持一定数量的数据点，可以在这里进行裁剪
        },

        initChart() {
            const chartDom = document.getElementById(this.chartId);
            this.chartInstance = echarts.init(chartDom);
            this.setOptions();
        },
        setOptions() {
            this.chartData = {
                title: {
                    // text: this.chartData.title 
                    text: ""
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return `时间:${params[0].name}</br>CO:<span style="color:#28a745"> ${params[0].value}</span>`;
                    }
                },
                grid: {
                    top: '1.5%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.chartData.xData || [],
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' // X 轴线条颜色为白色
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#ffffff' // X 轴刻度颜色为白色
                        }
                    },
                    axisLabel: {
                        color: '#ffffff' // X 轴标签颜色为白色
                    }
                },
                yAxis: {
                    min: 'dataMin',
                    max: 'dataMax',
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff' // Y 轴线条颜色为白色
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#ffffff' // Y 轴刻度颜色为白色
                        }
                    },
                    axisLabel: {
                        color: '#ffffff' // Y 轴标签颜色为白色
                    },
                    splitLine: {
                        show: false // 不显示 Y 轴的分割线（横线）
                    }
                },
                series: [
                    {
                        name: this.chartData.seriesName || '数据',
                        type: 'line',
                        data: this.chartData.yData || [],
                        itemStyle: {
                            color: 'red' // 绿色：点的颜色
                        },
                        lineStyle: {
                            color: '#28a745', // 绿色：折线的颜色
                            width: 1 // 折线宽度
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside', // 内置型 dataZoom，可以通过鼠标滚轮和触摸移动进行缩放和平移
                        start: 0,       // 数据窗口范围的起始百分比
                        end: 10000        // 数据窗口范围的结束百分比
                    },
                    {
                        type: 'slider', // 显示一个滑动条类型的 dataZoom
                        show: true,     // 显示滑动条
                        start: 0,       // 滑动条数据窗口范围的起始百分比
                        end: 100,       // 滑动条数据窗口范围的结束百分比
                        bottom: 0,     // 设置滑动条的位置在底部，距离底部 10px
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3v-1.2c0-5,4-9.1,8.8-9.4C19.6,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.2h6.6V19.6z',
                        handleSize: '80%', // 滑动条手柄的大小
                        height: 15,         // 滑动条的高度
                        borderColor: '#ccc', // 滑动条边框颜色
                        backgroundColor: '#e2e2e2', // 滑动条背景颜色
                        fillerColor: '#28a745', // 滑动条填充颜色
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }
                ]
            };
            this.chartInstance.setOption(this.chartData);
            this.loading = false
        },
        updateChart() {
            if (this.chartInstance) {
                this.setOptions();
            }
        }
    },
};
</script>

<style scoped>
.echarts-container {
    width: 100%;
    height: 400px;
}
</style>