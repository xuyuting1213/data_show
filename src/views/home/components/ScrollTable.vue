<template>
    <div class="content">
      <ul class="tabletitle">
        <li style="width: 12%;">序号</li>
        <li style="width: 24%;">姓名</li>
        <li style="width: 37.5%;">时间</li>
        <li style="width: 25%;">状态</li>
      </ul>
        <vue-seamless-scroll :data="List" :class-option="classOption" class="scrollarea">
            <ul class="tr-cont" >
                <li  v-for="(item,index) in List"  :key="index">
                    <span class="tr-cont-li" style="width: 10%;">{{index+1}}</span>
                    <span class="tr-cont-li" style="width: 25%;">{{item.name}}</span>
                    <span class="tr-cont-li" style="width: 35%;">{{item.time}}</span>
                    <span v-if="item.state == '满勤'" class="tr-cont-li" style="width: 25%;color:#03FFB1;">{{item.state}}</span>
                    <span v-if="item.state == '迟到'" class="tr-cont-li" style="width: 25%;color:#FF5A66;">{{item.state}}</span>
                    <span v-if="item.state == '早退'" class="tr-cont-li" style="width: 25%;color:#F8B700;">{{item.state}}</span>
                </li>
            </ul>
        </vue-seamless-scroll>
    </div>
</template>
<script>
export default{
    name:'ScrollTable',
    data(){
        return{
           List:[
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'迟到'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'迟到'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'早退'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'迟到'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
                {'name':'李老师','time':'2022.5.6 9:20','state':'满勤'},
            ],
        }
    },
    methods:{

    },
    computed:{
      classOption() {
        return {
          step: .7, // 数值越大速度滚动越快
          limitMoveNum: this.List.length, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          singleHeight: 38, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 3000, // 单步运动停止的时间(默认值1000ms)
        };
      },
    },
}
</script>
<style>
.tabletitle{
  background:rgb(29,140,230,.2);
  font-weight:bold;
  list-style:none;
  padding:0;
  margin:0.2rem 0 0 0;
  width:96%;
  height:0.4rem;
  line-height:0.4rem;
  font-size: 0.1rem;
  text-align: center;
}
.tabletitle li{
  white-space:nowrap;
  display:block;
  width:21%;
  float:left;
  text-indent:0.2em;
  color:#fff;
}

.tr-cont{
    font-size: 0.1rem;
    list-style:none;
    padding:0px;
    margin:0px;
    width:100%;
    height:0.01rem;
    line-height:0.45rem;
}
.tr-cont-li{
  text-align: center;
  display:block;
  width:21%;
  float:left;
  text-indent:0.2em;
  color: #fff;
  border-bottom:rgb(255,255,255,.2) 0.02rem solid;
}
.scrollarea{
    height:2.8rem !important;
    overflow:hidden !important;
}
 
</style>