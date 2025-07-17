<template>
    <div class="content">
        <!-- head -->

        <Head></Head>
        <!-- mainContent -->
        <div class="mainbox">
            <el-row>
                <el-col :span="6">
                    <!--  一、基本信息  -->
                    <div class="leftside" v-show="activeNum == 0">
                        <!-- 1.1、柱状图部分 -->
                        <div class="part1">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;margin-top: 0.35rem;
                ">
                                <div class="alltitle">秦邮概况</div>
                            </div>
                            <div style="
                  width: 22.4vw;
                  height: 100%;
                  padding-top: 0.01rem;
                  z-index: 2;
                ">
                                <div v-for="(item, index) in navlink" :key="item.title" class="quickNavLink">
                                    <router-link :to="item.path">
                                        {{ item.title }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <!-- 1.2、饼图部分 -->
                        <div class="part2">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                ">
                                <div style="
                    float: right;
                    color: rgb(255, 255, 255, 0.7);
                    font-size: 0.15rem;
                    border-radius: 0.05rem;
                    width: 0.5rem;
                    height: 0.21rem;
                    line-height: 0.18rem;
                    border: 0.02rem #1bb3d9 solid;
                  ">
                                    &nbsp;{{ thisyear }}&nbsp;
                                </div>
                                <div class="alltitle">设备占比</div>
                            </div>
                            <el-row style="
                  width: 100%;
                  height: 20vh;
                  display: flex;
                  align-items: center;
                  margin-top: 0.1rem;
                ">
                                <!-- 饼图 -->
                                <el-col :span="12">
                                    <!--                  <div class="circular"></div>-->
                                    <div id="pie" style="width: 100%; height: 20vh"></div>
                                    <!--                  <div class="circular1">-->
                                    <!--                    <img src="../../assets/images/user.png"-->
                                    <!--                         style="width: 0.55rem; height: 0.55rem; margin: 0.1rem 0.12rem"/>-->
                                    <!--                  </div>-->
                                </el-col>
                                <!-- 饼图label -->
                                <el-col :span="10">
                                    <div class="pielabel" style="width: 100%">
                                        <!-- 学生 -->
                                        <div class="labelbox" style="
                        width: 100%;
                        border-top: 0.02rem rgb(24, 185, 177, 1) solid;
                        display: flex;
                      ">
                                            <div style="
                          background-color: rgb(24, 185, 177, 1);
                          height: 0.35rem;
                          width: 0.9rem;
                          color: white;
                          text-align: center;
                          line-height: 0.34rem;
                          margin-top: 0.07rem;
                          font-size: 0.19rem;
                          min-width: 50px;
                        ">
                                                设备台数
                                            </div>
                                            <div style="
                          color: #fff;
                          font-size: 0.2rem;
                          margin-top: 0.05rem;
                          text-align: right;
                          line-height: 0.4rem;
                          width: 45%;
                        ">
                                                {{ thisStu }}台
                                                <!-- <div style="color: rgb(24, 185, 177)">
                                                    {{
                                                        Math.round(
                                                            (thisStu / (thisStu + thisTeather)) * 100
                                                        )
                                                    }}%
                                                </div> -->
                                            </div>
                                        </div>
                                        <!-- 教师 -->
                                        <div class="labelbox" style="
                        width: 100%;
                        margin-top: 0.1rem;
                        border-bottom: 0.02rem rgb(98, 73, 185, 1) solid;
                        display: flex;
                      ">
                                            <!-- <div style="
                          background-color: rgb(98, 73, 185, 1);
                          width: 0.9rem;
                          color: white;
                          text-align: center;
                          line-height: 0.3rem;
                          font-size: 0.19rem;
                        ">
                                                监控台数
                                            </div> -->
                                            <!-- <div style="
                          color: #fff;
                          font-size: 0.15rem;
                          margin-top: -0.07rem;
                          font-weight: bold;
                          text-align: right;
                          width: 45%;
                        ">
                                                {{ thisTeather }}人
                                                <div style="color: rgb(98, 73, 185)">
                                                    {{
                                                        Math.round(
                                                            (thisTeather / (thisStu + thisTeather)) * 100
                                                        )
                                                    }}%
                                                </div>
                                            </div> -->
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 1.3、面积图部分 -->
                        <div class="part3">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.27rem;
                ">
                                <div style="
                    float: right;
                    color: rgb(255, 255, 255, 0.7);
                    font-size: 0.15rem;
                    border-radius: 0.05rem;
                    width: 0.7rem;
                    height: 0.21rem;
                    line-height: 0.17rem;
                    border: 0.02rem #1bb3d9 solid;
                    text-align: center;
                  ">
                                    &nbsp;{{ thismajor }}&nbsp;
                                </div>
                                <div class="alltitle">安防概况</div>
                            </div>
                            <div id="category" style="width: 100%; height: 28vh"></div>
                        </div>
                    </div>
                    <!--  二、师资力量  -->
                    <div class="leftside" v-show="activeNum == 1">
                        <!-- 2.1、学历部分 -->
                        <div class="part1">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">设备信息</div>
                            </div>
                            <div style="width: 22.4vw; height: 25vh">
                                <el-row>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype1">{{ postgraduate }}</div>
                                            <img src="../../assets/images/bluebg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.42rem">
                                                安全报警
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype2">{{ undergraduate }}</div>
                                            <img src="../../assets/images/redbg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.42rem">
                                                能源报警
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype3">{{ juniorgraduate }}</div>
                                            <img src="../../assets/images/greenbg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.42rem">
                                                其他报警
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- 2.2、出勤部分 -->
                        <div class="part2" style="margin-top: -0.7rem">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">出勤概况</div>
                            </div>
                            <div>
                                <!-- 图例 -->
                                <el-row>
                                    <el-col :span="12">
                                        <div class="circular2"></div>
                                        <div id="pie2" style="
                        width: 16vw;
                        height: 20vh;
                        margin: 0.1rem 0 0 -0.63rem;
                        position: absolute;
                      "></div>
                                        <div class="circular3">
                                            <img src="../../assets/images/kaoqing.png" style="
                          width: 0.65rem;
                          height: 0.65rem;
                          margin: 0.24rem 0.25rem;
                        " />
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div style="
                        width: 2.67rem;
                        height: 2rem;
                        margin: -0.1rem 0 0 2rem;
                      ">
                                            <div style="
                          margin: 0.1rem;
                          float: left;
                          text-align: center;
                          margin-left: 0.4rem;
                        ">
                                                <div style="
                            float: left;
                            width: 0.7rem;
                            height: 0.3rem;
                            margin: 0.1rem 0;
                          " :class="showindex == 0 ? 'activeindex' : 'nomalindex'">
                                                    本月
                                                </div>
                                                <div style="
                            float: left;
                            width: 0.7rem;
                            height: 0.3rem;
                            margin: 0.1rem 0;
                          " :class="showindex == 1 ? 'activeindex' : 'nomalindex'">
                                                    本季
                                                </div>
                                                <div style="
                            float: left;
                            width: 0.7rem;
                            height: 0.3rem;
                            margin: 0.1rem 0;
                          " :class="showindex == 2 ? 'activeindex' : 'nomalindex'">
                                                    本年
                                                </div>
                                            </div>
                                            <div style="
                          width: 1.6rem;
                          height: 1.37rem;
                          float: left;
                          margin-top: 0.01rem;
                          border-top: 0.02rem #03ffb1 solid;
                          border-bottom: 0.02rem #ff5a66 solid;
                          margin-left: 0.4rem;
                        ">
                                                <div style="margin-top: 0.06rem">
                                                    <div style="
                              margin-bottom: 0.15rem;
                              width: 0.5rem;
                              height: 0.3rem;
                              background-color: rgb(3, 255, 177, 0.69);
                              color: #fff;
                              text-align: center;
                              line-height: 0.27rem;
                            ">
                                                        满勤
                                                    </div>
                                                    <div style="
                              color: #03ffb1;
                              float: right;
                              margin-top: -0.48rem;
                              text-align: right;
                            ">
                                                        {{ this.thisFullAttendance }}台
                                                        <div style="color: #03ffb1; margin-top: -0.05rem">
                                                            {{
                                                                Math.round(
                                                                    (thisFullAttendance /
                                                                        (thisFullAttendance +
                                                                            thisLate +
                                                                            thisLeaveEarly)) *
                                                                    100
                                                                )
                                                            }}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style="
                              margin-bottom: 0.15rem;
                              width: 0.5rem;
                              height: 0.3rem;
                              background-color: #f8b700;
                              color: #fff;
                              text-align: center;
                              line-height: 0.27rem;
                            ">
                                                        迟到
                                                    </div>
                                                    <div style="
                              color: #fede7f;
                              float: right;
                              margin-top: -0.48rem;
                              text-align: right;
                            ">
                                                        {{ this.thisLate }}人
                                                        <div style="color: #fede7f; margin-top: -0.05rem">
                                                            {{
                                                                Math.round(
                                                                    (thisLate /
                                                                        (thisFullAttendance +
                                                                            thisLate +
                                                                            thisLeaveEarly)) *
                                                                    100
                                                                )
                                                            }}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style="
                              width: 0.5rem;
                              height: 0.3rem;
                              background-color: #ff5a66;
                              color: #fff;
                              text-align: center;
                              line-height: 0.28rem;
                            ">
                                                        早退
                                                    </div>
                                                    <div style="
                              color: #ff5a66;
                              float: right;
                              margin-top: -0.34rem;
                              text-align: right;
                            ">
                                                        {{ this.thisLeaveEarly }}人
                                                        <div style="color: #ff5a66; margin-top: -0.05rem">
                                                            {{
                                                                Math.round(
                                                                    (thisLeaveEarly /
                                                                        (thisFullAttendance +
                                                                            thisLate +
                                                                            thisLeaveEarly)) *
                                                                    100
                                                                )
                                                            }}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <!-- 动态表格 -->
                                <div>
                                    <ScrollTable></ScrollTable>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 招生信息 -->
                    <div class="leftside" v-show="activeNum == 2">
                        <!-- 男女比例 -->
                        <div class="part1">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">男女比例</div>
                            </div>
                            <div style="width: 12vw; height: 19vh; margin: 2% 0">
                                <!-- 饼图 -->
                                <el-row :span="8">
                                    <div class="circular"></div>
                                    <div id="pie3" style="
                      width: 12vw;
                      height: 19vh;
                      margin: -0.05rem 0 0 -0.25rem;
                      position: absolute;
                    "></div>
                                    <div class="circular1">
                                        <img src="../../assets/images/user.png" style="
                        width: 0.55rem;
                        height: 0.55rem;
                        margin: 0.1rem 0.12rem;
                      " />
                                    </div>
                                </el-row>
                                <!-- 饼图label -->
                                <el-row :span="16">
                                    <div class="pielabel" style="
                      width: 70%;
                      height: 100%;
                      position: absolute;
                      margin: 0.25rem 0 0 2.2rem;
                    ">
                                        <!-- 男生 -->
                                        <div class="labelbox" style="
                        width: 100%;
                        height: 100%;
                        margin: 0.03rem 0 0 0;
                        border-top: 0.02rem rgb(24, 185, 177, 1) solid;
                      ">
                                            <div style="
                          float: left;
                          background-color: rgb(24, 185, 177, 1);
                          height: 0.35rem;
                          width: 0.9rem;
                          color: white;
                          text-align: center;
                          line-height: 0.3rem;
                          margin-top: 0.07rem;
                          font-size: 0.19rem;
                        ">
                                                男生人数
                                            </div>
                                            <div style="
                          float: left;
                          color: rgb(24, 185, 177);
                          font-size: 0.01rem;
                          margin-top: 0.01rem;
                          font-weight: bold;
                          text-align: right;
                          width: 45%;
                        ">
                                                {{ men }}人
                                                <div style="color: rgb(24, 185, 177)">
                                                    {{ Math.round((men / (men + women)) * 100) }}%
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 女生 -->
                                        <div class="labelbox" style="
                        width: 100%;
                        height: 0.45rem;
                        margin: 0.7rem 0 2rem 0;
                        border-bottom: 0.02rem rgb(98, 73, 185, 1) solid;
                      ">
                                            <div style="
                          float: left;
                          background-color: rgb(98, 73, 185, 1);
                          height: 0.35rem;
                          width: 0.9rem;
                          color: white;
                          text-align: center;
                          line-height: 0.3rem;
                          font-size: 0.19rem;
                        ">
                                                女生人数
                                            </div>
                                            <div style="
                          float: left;
                          color: rgb(98, 73, 185);
                          font-size: 0.01rem;
                          margin-top: -0.07rem;
                          font-weight: bold;
                          text-align: right;
                          width: 45%;
                        ">
                                                {{ women }}人
                                                <div style="color: rgb(98, 73, 185)">
                                                    {{ Math.round((women / (women + men)) * 100) }}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-row>
                            </div>
                        </div>
                        <!-- 年纪人数  -->
                        <div class="part2">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">年纪人数</div>
                            </div>
                            <div id="bar" style="width: 22.4vw; height: 25vh"></div>
                        </div>
                        <!-- 生源分布  -->
                        <div class="part3">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">生源分布</div>
                            </div>
                            <div style="width: 22.4vw; height: 32vh; overflow: hidden">
                                <img src="../../assets/images/mapbottom.png" style="
                    width: 6.5rem;
                    height: 2.8rem;
                    margin: 1.3rem 0 0 -1.2rem;
                    z-index: -1;
                  " />
                                <img src="../../assets/images/map.png" style="
                    width: 2.6rem;
                    height: 2.3rem;
                    margin: -5.9rem 0 0 0.76rem;
                  " />
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="">&emsp;</div>
                    <!-- <ModelViewer /> -->

                    <!-- <div style="height:10rem;" class="navLink">
            <div style="width:8.35rem;height: 100%;background-color:rgb(63,146,248,.2);margin-left: 0.72rem;">
              <el-row style="text-align:center">
              <div v-for="(item,index) in navlink" :key="index" :data="navlink">
                <el-col :span="8">
                  <div :class="activeNum == index ? 'itemactive':'itemnomal'" @click="select(index)">{{item.title}}</div>
                  <div v-if="activeNum == index" style="height: 0.02rem;background-color:#FEDE7F;margin-top: -0.02rem;width: 0.61rem;
                  margin-left: 1.09rem;">&emsp;</div>
                </el-col>
              </div>
              </el-row>
            </div>
          </div> -->
                    <!-- <mapVue></mapVue> -->
                    <div style="
              width: 50%;
              text-align: center;
              position: fixed;
              bottom: 0.2rem;
            ">
                        <Navbar></Navbar>
                    </div>
                </el-col>
                <el-col :span="6">
                    <!-- 基本信息 -->
                    <div class="rightside" v-show="activeNum == 0">
                        <!-- school介绍部分 -->
                        <div class="part4">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">公司介绍</div>
                            </div>
                            <div class="part4_box">
                                <el-row style="height: 100%;padding: 0.5rem 0 0 0.2rem;">
                                    <el-col :span="10" style="height: 100%;
                  ">
                                        <img src="../../assets/images/school.jpg" style="
                        width: 1.7rem;
                        height: calc(100% - 0.5rem);
                      " />
                                    </el-col>
                                    <el-col :span="14" style="height: 100%">
                                        <div style="
                        color: rgb(255, 255, 255, 0.8);
                        height: calc(100% - 0.5rem);
                        width: 100%;
                        overflow-y: auto;
                      ">
                                            &emsp;&emsp;扬州市秦邮特种金属材料有限公司是隶属于江苏沿海钢铁集团有限公司六大生产基地之一。江苏沿海钢铁集团有限公司由总裁陈家榕先生等知名企业家创建于2011年，集团总部设在新亚欧大陆桥经济走廊的东方桥头堡、充满生机和魅力的海滨城市——连云港。经过13年的快速发展,沿海钢铁集团已成长为华东地区最具竞争力的建筑钢材产业集群，经国家发改委、工信部确认的产能达1800万吨，拥有固定资产800多亿元。2023年生产钢材超1600万吨，实现销售收入超650亿元、利税总额逾25亿元。
                                            扬州市秦邮特种金属材料有限公司成立于2009年，由沿海集团出资收购重组而成。仅用16个月优质高效的完成了年产300万吨高强优特钢技改工程建设。公司区域优势明显，东接京沪高速，西临京杭大运河。目前公司具备年产300万吨优特建筑钢材生产能力，是一家集烧结、炼铁、炼钢、轧钢、球团、石灰、质检、制氧、物流、余热余气发电、渣处理为一体的资源节约型、环境友好型企业，企业工艺流程完备、技术装备先进，管理制度规范、企业文化优秀。产品远销上海、浙江、安徽、湖北、重庆等，并被港珠澳大桥、京沪高铁等国家重点工程选用，深受用户好评。
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- liquid部分 -->
                        <div class="part5">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.27rem;
                ">
                                <div class="alltitle">监控统计</div>
                                <el-row style="height: 100%">
                                    <el-col :span="6">
                                        <div id="liquidEchart"></div>
                                    </el-col>
                                    <el-col :span="18">
                                        <div id="studntDetails" style="width: 17vw; height: 20vh"></div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- showTeacher部分 -->
                        <div class="part6">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">员工风采</div>
                            </div>
                            <el-row :gutter="35">
                                <!--              <el-row>-->
                                <div v-for="item in teatherList" :key="item.index" :data="teatherList">
                                    <el-col :span="8">
                                        <div class="showTeacher">
                                            <img src="../../assets/images/teacher.png" style="
                          width: 1rem;
                          height: 0.75rem;
                          margin-top: 0.15rem;
                        " />
                                        </div>
                                        <div style="
                        margin-top: -0.7rem;
                        text-align: center;
                        height: 0.75rem;
                      ">
                                            <div style="color: white; font-size: 0.15rem">
                                                {{ item.name }}
                                            </div>
                                            <div style="
                          color: white;
                          font-weight: 100;
                          font-size: 0.125rem;
                        ">
                                                {{ item.position }}
                                            </div>
                                            <div style="
                          color: white;
                          font-weight: 100;
                          font-size: 0.125rem;
                        ">
                                                {{ item.rank }}
                                            </div>
                                        </div>
                                    </el-col>
                                </div>
                            </el-row>
                        </div>
                    </div>
                    <!-- 师资力量 -->
                    <div class="rightside" v-show="activeNum == 1">
                        <!-- 教师数量 -->
                        <div class="part4">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">教师数量</div>
                            </div>
                            <div style="width: 22.4vw; height: 25vh">
                                <el-row>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype1" style="margin-left: 0.51rem">
                                                {{ internship }}
                                            </div>
                                            <img src="../../assets/images/bluebg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.5rem">
                                                实习教师
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype2">{{ backbone }}</div>
                                            <img src="../../assets/images/redbg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.5rem">
                                                骨干教师
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div>
                                            <div class="teachertype3">{{ superteacher }}</div>
                                            <img src="../../assets/images/greenbg.png" style="
                          width: 1.2rem;
                          height: 1.1rem;
                          margin: -0.45rem 0 0 0.2rem;
                        " />
                                            <div style="color: #fff; margin-left: 0.5rem">
                                                特级教师
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!-- 教师获奖信息 -->
                        <div class="part5">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                  margin-top: -0.7rem;
                ">
                                <div class="alltitle" style="width: 1.3rem">教师获奖信息</div>
                            </div>
                            <div style="margin-top: 0.18rem">
                                <div v-for="item in awardList" :key="item.index" :data="awardList">
                                    <div style="
                      height: 1.16rem;
                      width: 22.4vw;
                      border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                      margin-bottom: 0.2rem;
                    ">
                                        <el-row>
                                            <el-col :span="8">
                                                <img src="../../assets/images/teacher.png"
                                                    style="width: 1.3rem; height: 1rem" />
                                            </el-col>
                                            <el-col :span="16">
                                                <div>
                                                    <div>
                                                        <span style="color: #fff">姓名：{{ item.name }}</span>
                                                        <span style="color: #fff">&emsp;年龄：{{ item.age }}</span>
                                                        <span style="color: #fff">&emsp;职称：{{ item.title }}</span>
                                                    </div>
                                                    <br />
                                                    <div style="
                              color: #fff;
                              height: 0.53rem;
                              width: 3rem;
                              word-wrap: break-word;
                              overflow: auto;
                            ">
                                                        获得荣誉：{{ item.award }}
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 招生信息 -->
                    <div class="rightside" v-show="activeNum == 2">
                        <!-- 招生列表 -->
                        <div class="part4">
                            <div style="
                  width: 22.4vw;
                  border-bottom: 0.01rem rgb(27, 179, 217, 0.38) solid;
                  height: 0.265rem;
                ">
                                <div class="alltitle">招生列表</div>
                                <div style="margin-top: 0.15rem">
                                    <div v-for="item in studentList" :key="item.index" :data="studentList">
                                        <div class="studentList">
                                            &emsp;&emsp;{{ item.name }}&emsp;{{ item.area }}&emsp;{{
                                                item.gender
                                            }}&emsp;{{ item.nation }} &emsp;{{ item.college }}&emsp;{{
                                                item.stuclass
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- navBar -->
        <!-- <div>
      <Navbar></Navbar>
    </div> -->
    </div>
</template>
<script>
import Navbar from "../components/Navbar";
import Head from "../components/head";
import $ from "jquery";
import "echarts-liquidfill";
import ScrollTable from "./components/ScrollTable";
import { echartGetFontSize } from "@/utils/rem";

import mapVue from "../basic/map.vue";
// import ModelViewer from "./ModelViewer.vue";
export default {
    components: { Navbar, Head, ScrollTable, mapVue },
    data() {
        return {
            loading: false,
            stu: [699, 805, 1022, 2133, 3143, 4153, 5167],
            thisStu: "1001",
            thisTeather: "717",
            teather: [300, 450, 550, 660, 860, 970, 1690],
            year: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
            thisyear: "2024",
            area: [
                [2050, 2600, 2622, 2832, 2461, 2686, 2701],
                [1130, 1420, 1200, 1180, 1434, 1689, 1214],
                [2203, 1622, 2232, 2442, 2050, 2256, 1860],
                [1318, 1538, 1816, 2326, 2614, 2714, 2826],
                [2116, 2110, 2110, 2138, 2110, 2114, 2118],
                [2428, 2012, 2632, 2835, 2617, 2720, 2530],
            ],
            major: ["部门1", "部门2", "部门3", "部门4", "部门5", "部门6"],
            thismajor: "部门1",
            teatherList: [
                { name: "圣鑫", rank: "高级工程师", position: "安全部部长" },
                { name: "圣鑫", rank: "高级工程师", position: "安全部部长" },
                { name: "圣鑫", rank: "高级工程师", position: "安全部部长" },
                // {name: "圣鑫", rank: "高级工程师", position: "安全部部长"},
                // {name: "圣鑫", rank: "高级工程师", position: "安全部部长"},
                // {name: "圣鑫", rank: "高级工程师", position: "安全部部长"},
            ],
            chartsLiquid: "", // 初始化图表
            activeNum: 0,
            navlink: [
                { title: "企业基础信息", path: "/basicinfo/introduction" },
                { title: "企业自动化系统建设", path: "/basicinfo/autocompany" },
                { title: "企业专项信息", path: "/basicinfo/personalrecord" },
                {
                    title: "设施设备信息",
                    path: "/basicinfo/deviceinfo/devicetallbottle",
                },
                { title: "企业日常数据", path: "/basicinfo/companydaily/checkout" },
            ],
            // 师资力量
            postgraduate: 32, //研究生
            undergraduate: 64, //本科生
            juniorgraduate: 12, //大专生
            fullAttendance: [1567, 1132, 667], //满勤人数(月、季、年)
            late: [121, 201, 330], //迟到人数
            leaveEarly: [50, 100, 200], //早退人数
            thisFullAttendance: "",
            thisLate: "",
            thisLeaveEarly: "",
            showindex: 0, //三种情况展示
            internship: 200, //实习老师数量
            backbone: 56, //骨干教师
            superteacher: 34, //特级教师
            awardList: [
                {
                    name: "李老师",
                    age: "26",
                    title: "特级教师",
                    award: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                },
                {
                    name: "李老师",
                    age: "26",
                    title: "特级教师",
                    award: "XXXXXXXXXXXXXXXXXXXXXX",
                },
                {
                    name: "李老师",
                    age: "26",
                    title: "特级教师",
                    award: "XXXXXXXXXXXXXXXXXXXXXX",
                },
                {
                    name: "李老师",
                    age: "26",
                    title: "特级教师",
                    award: "XXXXXXXXXXXXXXXXXXXXXX",
                },
            ],
            // 招生信息
            men: 4567,
            women: 5467,
            menList: [300, 450, 550, 660, 860, 970, 1690],
            womenList: [699, 805, 1022, 2133, 3143, 4153, 5167],
            studentList: [
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
                {
                    name: "阿湫",
                    area: "四川",
                    gender: "男",
                    nation: "汉",
                    college: "制造学院",
                    stuclass: "制造2201",
                },
            ],
        };
    },
    created() {
        setTimeout(() => {
            // this.loading = false;
        }, 1000);
        this.loading = true;
    },
    computed: {},
    mounted() {
        //基本信息
        // this.getEchartData(); //左侧柱状图
        this.getPieData(); //左侧饼图
        this.getCategory(); //左侧面积图
        this.initLiquidEchart(); //右侧水波图
        this.getStudent(); //右侧柱状图
        //师资力量
        this.getPieData2();
        //招生信息
        this.getPieData3();
        this.getBarData(); //左侧柱状图
    },
    methods: {
        select(index) {
            this.activeNum = index;
        },
        // 基本信息
        getEchartData() {
            // console.log(this.$echarts)
            let myChart = this.$echarts.init(document.getElementById("chart"));
            var option = {
                // legend: {},
                // tooltip: {},
                dataZoom: [
                    {
                        // 第一个 dataZoom 组件
                        type: "inside",
                        xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
                        startValue: 0, // 数据窗口范围的起始数值index
                        endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
                    },
                ],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        lineStyle: {
                            color: "#dddc6b",
                        },
                    },
                },
                legend: {
                    left: 10,
                    top: 15,
                    itemWidth: 12,
                    itemHeight: 8,
                    data: ["用量", "消耗"],
                    textStyle: {
                        color: "rgba(255,255,255,1)",
                        fontSize: 10,
                    },
                },
                // 图例位置
                grid: {
                    left: "1%",
                    top: "15%",
                    right: "0%",
                    bottom: "13%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: { color: "#1BB3D9" },
                    },
                    // boundaryGap:'0px'
                },
                yAxis: {
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: "学生",
                        type: "bar",
                        data: [99, 105, 122, 133, 143, 153, 167],
                        smooth: true,
                        symbol: "circle",
                        barWidth: 15, //粗细设置
                        barGap: "100%", //间隔设置
                        lineStyle: {
                            normal: {
                                color: "#0184d5",
                                width: "2px",
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: "rgb(1,132,213,1)",
                                // color: "#0184d5",
                                borderColor: "rgba(221, 220, 107, .1)",
                                borderWidth: "12px",
                                // color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                //   offset: 0,
                                //   color: 'rgb(2,12,18,0.5)' // 0% 处的颜色
                                // },{
                                //   offset: 1,
                                //   color: "rgb(32,226,233,0.5)" // 100% 处的颜色
                                // }], false)
                            },
                        },
                        label: {
                            show: true, //是否显示数值
                            position: "top", //显示位置
                            fontSize: "8",
                        },
                    },
                    {
                        name: "老师",
                        type: "bar",
                        data: [66, 73, 85, 99, 113, 125, 130],
                        smooth: true,
                        symbol: "circle",
                        barWidth: 15, //粗细设置
                        barGap: "80%", //间隔设置
                        symbolSize: "5px",
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                color: "#00d887",
                                width: "2px",
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: "rgb(0,216,135,1)",
                                // color: "#00d887",
                                borderColor: "rgba(221, 220, 107, .1)",
                                borderWidth: "12px",
                                // color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                //   offset: 0,
                                //   color: 'rgb(255,255,255,0.5)' // 0% 处的颜色
                                // },{
                                //   offset: 1,
                                //   color: "rgb(255,60,60,0.5)" // 100% 处的颜色
                                // }], false)
                            },
                        },
                        label: {
                            show: true, //是否显示
                            position: "top", //显示位置
                            fontSize: "8",
                        },
                    },
                ],
                textStyle: {
                    color: "#fff", // 标题颜色
                },
            };
            option && myChart.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart.resize();
                },
                false
            );
            setInterval(() => {
                if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
                    option.dataZoom[0].endValue = 4;
                    option.dataZoom[0].startValue = 0;
                } else {
                    option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
                    option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
                }
                myChart.setOption(option);
            }, 3000);
        },
        getPieData() {
            // 初始化 ECharts 实例
            let myChart1 = this.$echarts.init(document.getElementById("pie"));
            var option;

            // 定义数据集
            const data = [
                { value: 2, name: "高炉" },
                { value: 2, name: "转炉" },
                { value: 2, name: "煤气柜" },
                { value: 4, name: "连铸机" },
                { value: 7, name: "吊运熔融金属起重机" },
                { value: 98, name: "熔融金属罐体" },
                { value: 73, name: "煤气设施（管道）眼镜阀组合式隔断装置" },
                { value: 94, name: "正压煤气管道水封式煤气排水器" },
                { value: 717, name: "固定式一氧化碳报警器" },
            ];

            // 设置初始选项
            option = {
                tooltip: {
                    trigger: "item",
                    position: "right", // 提示框位置设置为在图内显示
                    formatter: "{b}</br>: {c} ({d}%)", // 自定义提示框格式
                    textStyle: {
                        fontSize: 12, // 设置提示框文本的字体大小
                    },
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left'
                // },
                series: [
                    {
                        name: "设备数量",
                        type: "pie",
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: "12",
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: data,
                        color: [
                            "rgb(27,241,236)",
                            "rgb(134,90,249)",
                            "rgb(255,183,77)",
                            "rgb(255,77,77)",
                            "rgb(77,255,77)",
                            "rgb(77,183,255)",
                            "rgb(255,77,255)",
                            "rgb(183,77,255)",
                            "#399bff",
                        ],
                    },
                ],
            };

            // 应用配置项
            option && myChart1.setOption(option);

            // 监听窗口大小变化以调整图表大小
            window.addEventListener(
                "resize",
                () => {
                    myChart1.resize();
                },
                false
            );

            // 如果需要定时更新数据，可以在这里设置定时器
            // 注意：根据你的描述，这段代码可能不再适用，除非你有动态更新的需求
            /*
                  let index = 0;
                  setInterval(() => {
                    // 更新逻辑...
                    myChart1.setOption(option);
                  }, 3000);
                  */
        },
        getCategory() {
            let myChart2 = this.$echarts.init(document.getElementById("category"));
            var option;

            option = {
                grid: {
                    //设置图表四周留白间距
                    top: "25%",
                    right: "1%",
                    bottom: "18%",
                    left: "11%",
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    // data: ["2018", "2019", "2020", "2021", "2022"],
                    data: this.year,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: { color: "#9B9D9D" },
                    },
                    axisLabel: {
                        rotate: 20,
                        // fontSize: 10
                        fontSize: echartGetFontSize(14),
                    },
                },
                yAxis: {
                    type: "value",
                    name: "数量（次）",
                    // nameGap: '25',
                    nameTextStyle: {
                        padding: [0, 0, echartGetFontSize(12), -echartGetFontSize(12)], // 上右下左与原位置距离
                        fontSize: echartGetFontSize(14),
                    },
                    max: 3000, //最大刻度值
                    interval: 500, //刻度值间隔值
                    splitLine: {
                        lineStyle: {
                            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
                            color: "rgb(255,255,255,0.1)", //网格线颜色
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        fontSize: echartGetFontSize(14),
                    },
                },
                series: [
                    {
                        data: [600, 1500, 1000, 1700, 1400, 1900, 2000],
                        type: "line",
                        lineStyle: {
                            width: 2, //外边线宽度
                            color: "rgb(50,77,183)", //外边线颜色
                        },
                        areaStyle: {
                            //区域填充渐变颜色
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "rgba(50,77,183,0.8)", // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(50,77,183,0)", // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: "#0184d5",
                                borderColor: "rgba(221, 220, 107, .1)",
                                borderWidth: 8,
                            },
                        },
                    },
                ],
                textStyle: {
                    color: "#fff", // 标题颜色
                },
            };
            option && myChart2.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart2.resize();
                },
                false
            );
            // console.log('option',option)
            // console.log("area", this.area);
            let index = 0;
            setInterval(() => {
                if (index == this.area.length - 1) {
                    index = 0;
                    option.series[0].data = this.area[index];
                    this.thismajor = this.major[index];
                } else {
                    index += 1;
                    option.series[0].data = this.area[index];
                    this.thismajor = this.major[index];
                }
                myChart2.setOption(option);
            }, 3000);
        },
        initLiquidEchart() {
            var liquid = this.$echarts.init(document.getElementById("liquidEchart"));
            liquid.setOption({
                series: [
                    {
                        type: "liquidFill", //类型
                        label: {
                            normal: {
                                formatter: "上线监控总数\n5台",
                                textStyle: {
                                    // fontSize: 13,
                                    fontSize: echartGetFontSize(14),
                                    color: "rgb(255,255,255,0.7)",
                                },
                            },
                        },
                        data: [0.7, 0.5, 0.4], //数据是个数组 数组的每一项的值是0-1
                        outline: {
                            //show: true , //是否显示轮廓 布尔值
                            borderDistance: 0, //外部轮廓与图表的距离 数字
                            itemStyle: {
                                //borderColor:'rgba(255,0,0,0.09)', //边框的颜色
                                borderWidth: 0, //边框的宽度
                                //shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                                //shadowColor: '#000' //外部轮廓的阴影颜色
                            },
                        },
                        backgroundStyle: {
                            color: "rgba(69,96,130,0.5)", //图表的背景颜色
                            //borderWidth: '10',//图表的边框宽度
                            //borderColor: '#000',//图表的边框颜色
                            itemStyle: {
                                shadowBlur: 100, //设置无用
                                shadowColor: "#f60", //设置无用
                                opacity: 1, //设置无用
                            },
                        },
                        itemStyle: {
                            opacity: 0.5, //波浪的透明度
                            shadowBlur: 10, //波浪的阴影范围
                            shadowColor: "rgb(33,116,186,0.5)", //阴影颜色
                        },
                        emphasis: {
                            itemStyle: {
                                opacity: 1, //鼠标经过波浪颜色的透明度
                            },
                        },
                        color: ["rgb(179,229,252)", "rgb(6,147,227)", "rgb(187,222,251)"], //水波的颜色 对应的是data里面值
                        shape: "circle", //水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
                        center: ["50%", "50%"], //图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值
                        radius: "80%", //图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据
                        amplitude: 3, //振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
                        waveLength: "50%", //波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
                        phase: 0, //波的相位弧度 默认情况下是自动
                        period: (value, index) => {
                            //控制波的移动速度 可以是函数 也可以是数字 两个参数  value 是data数据里面的值 index 是data值的索引
                            return index * 2000;
                        },
                        direction: "left", //波移动的速度 两个参数  left 从右往左 right 从左往右
                        waveAnimation: true, //控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值
                        animationEasing: "linear", //初始动画
                        animationEasingUpdate: "quarticInOut", //数据更新的动画效果
                        animationDuration: 3000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
                        animationDurationUpdate: 300, //数据更新动画的时长
                    },
                ],
                //backgroundColor: 'rgba(255,0,0,0.1)'容器背景颜色
            });
        },
        getStudent() {
            let myChart3 = this.$echarts.init(
                document.getElementById("studntDetails")
            );
            let t = this;
            var option;
            option = {
                // tooltip: {},
                // legend: {},
                grid: {
                    top: "10%",
                    left: "6%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "value",
                    boundaryGap: [0, 0.01],
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                yAxis: [
                    {
                        type: "category",
                        data: ["炼铁厂", "炼钢厂", "石灰厂", "渣厂"],
                        inverse: true, //数组翻转显示
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: "#fff",
                            // fontSize: 10,
                            fontSize: echartGetFontSize(14),
                        },
                    },
                    {
                        type: "category",
                        data: [4, 1, 0, 0],
                        inverse: true, //数组翻转显示
                        axisTick: {
                            alignWithLabel: true,
                            show: false,
                        },
                        axisLabel: {
                            color: "#fff",
                            // fontSize: 10,
                            fontSize: echartGetFontSize(14),
                        },
                        axisLine: {
                            show: false, //不显示y轴的线
                        },
                        position: "right",
                    },
                ],
                series: [
                    {
                        name: "", //背景
                        type: "bar",
                        yAxisIndex: 0,
                        // data: [4, 1, 0, 0],
                        label: {
                            show: false,
                        },
                        itemStyle: {
                            color: "rgb(111,109,109,.2)",
                        },
                        barWidth: "40%", //设置宽度
                    },
                    {
                        name: "",
                        type: "bar",
                        yAxisIndex: 1,
                        data: [4, 1, 0, 0],
                        label: {
                            show: false,
                        },
                        barWidth: "40%",
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    // console.log(params);
                                    var colorList = [
                                        ["#124F77", "#1A959C"],
                                        ["#F63737", "#F6B937"],
                                        ["#77A1F7", "#9377F7"],
                                        ["#F7778C", "#F777C8"],
                                    ];
                                    var colorItem = colorList[params.dataIndex];
                                    return new t.$echarts.graphic.LinearGradient(
                                        0,
                                        0,
                                        1,
                                        0,
                                        [
                                            {
                                                offset: 0,
                                                color: colorItem[0],
                                            },
                                            {
                                                offset: 1,
                                                color: colorItem[1],
                                            },
                                        ],
                                        false
                                    );
                                },
                            },
                        },
                    },
                ],
            };
            option && myChart3.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart3.resize();
                },
                false
            );
        },
        // 师资力量
        getPieData2() {
            let myChart4 = this.$echarts.init(document.getElementById("pie2"));
            var option;
            option = {
                series: [
                    {
                        name: " ",
                        type: "pie",
                        radius: ["73%", "85%"],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: "20",
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: 1567, name: "满勤" },
                            { value: 121, name: "迟到" },
                            { value: 500, name: "早退" },
                        ],
                        color: ["#03FFB1", "#F8B700", "#FF5A66"],
                    },
                ],
            };
            option && myChart4.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart4.resize();
                },
                false
            );
            let index = 0;
            setInterval(() => {
                if (index == this.late.length - 1) {
                    index = 0;
                    option.series[0].data[0].value = this.fullAttendance[index];
                    option.series[0].data[0].name = "满勤";
                    option.series[0].data[1].value = this.late[index];
                    option.series[0].data[1].name = "迟到";
                    option.series[0].data[2].value = this.leaveEarly[index];
                    option.series[0].data[2].name = "早退";
                    this.showindex = index;
                    this.thisFullAttendance = this.fullAttendance[index];
                    this.thisLate = this.late[index];
                    this.thisLeaveEarly = this.leaveEarly[index];
                } else {
                    index += 1;
                    option.series[0].data[0].value = this.fullAttendance[index];
                    option.series[0].data[0].name = "满勤";
                    option.series[0].data[1].value = this.late[index];
                    option.series[0].data[1].name = "迟到";
                    option.series[0].data[2].value = this.leaveEarly[index];
                    option.series[0].data[2].name = "早退";
                    this.showindex = index;
                    this.thisFullAttendance = this.fullAttendance[index];
                    this.thisLate = this.late[index];
                    this.thisLeaveEarly = this.leaveEarly[index];
                }
                myChart4.setOption(option);
            }, 3000);
        },
        // 招生信息
        getPieData3() {
            let myChart5 = this.$echarts.init(document.getElementById("pie3"));
            var option;
            option = {
                series: [
                    {
                        name: " ",
                        type: "pie",
                        radius: ["55%", "65%"],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: "20",
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: this.men, name: "男生" },
                            { value: this.women, name: "女生" },
                        ],
                        color: ["rgb(27,241,236)", "rgb(134,90,249)"],
                    },
                ],
            };
            option && myChart5.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart5.resize();
                },
                false
            );
        },
        getBarData() {
            let myChart6 = this.$echarts.init(document.getElementById("bar"));
            var option = {
                color: ["#20E2E9", "#00d887"],
                dataZoom: [
                    {
                        type: "inside",
                        xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
                        startValue: 0, // 数据窗口范围的起始数值index
                        endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
                    },
                ],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        lineStyle: {
                            color: "#dddc6b",
                        },
                    },
                },
                legend: {
                    left: 10,
                    top: 15,
                    itemWidth: 12,
                    itemHeight: 8,
                    data: ["男生", "女生"],
                    textStyle: {
                        color: "rgba(255,255,255,1)",
                        fontSize: 10,
                    },
                },
                // 图例位置
                grid: {
                    left: "1%",
                    top: "15%",
                    right: "0%",
                    bottom: "13%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: { color: "#1BB3D9" },
                    },
                    // boundaryGap:'0px'
                },
                yAxis: {
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: "男生",
                        type: "bar",
                        data: this.menList,
                        smooth: true,
                        symbol: "circle",
                        barWidth: 15, //粗细设置
                        barGap: "100%", //间隔设置
                        lineStyle: {
                            normal: {
                                color: "#20E2E9",
                                width: "2px",
                            },
                        },
                        itemStyle: {
                            normal: {
                                // color: "rgb(1,132,213,1)",
                                // color: "#0184d5",
                                borderColor: "rgba(221, 220, 107, .1)",
                                borderWidth: "12px",
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgb(27, 207, 217, 0.1)", // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: "rgb(32, 226, 233, 1)", // 100% 处的颜色
                                        },
                                    ],
                                    false
                                ),
                            },
                        },
                        label: {
                            show: true, //是否显示数值
                            position: "top", //显示位置
                            fontSize: "8",
                        },
                    },
                    {
                        name: "女生",
                        type: "bar",
                        data: this.womenList,
                        smooth: true,
                        symbol: "circle",
                        barWidth: 15, //粗细设置
                        barGap: "80%", //间隔设置
                        symbolSize: "5px",
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                color: "#00d887",
                                width: "2px",
                            },
                        },
                        itemStyle: {
                            normal: {
                                // color: "rgb(0,216,135,1)",
                                // color: "#00d887",
                                borderColor: "rgba(221, 220, 107, .1)",
                                borderWidth: "12px",
                                color: new this.$echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgb(137, 88, 255, 0)", // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: "rgb(137, 88, 255, 1)", // 100% 处的颜色
                                        },
                                    ],
                                    false
                                ),
                            },
                        },
                        label: {
                            show: true, //是否显示
                            position: "top", //显示位置
                            fontSize: "8",
                        },
                    },
                ],
                textStyle: {
                    color: "#fff", // 标题颜色
                },
            };
            option && myChart6.setOption(option);
            window.addEventListener(
                "resize",
                () => {
                    myChart6.resize();
                },
                false
            );
            setInterval(() => {
                if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
                    option.dataZoom[0].endValue = 4;
                    option.dataZoom[0].startValue = 0;
                } else {
                    option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
                    option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
                }
                myChart6.setOption(option);
            }, 3000);
        },
    },
};
</script>

<style>
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

body {
    background: #01082775 url(../../assets/images/bg1.jpg) center;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: #666;
    font-size: 0.1rem;
    overflow: hidden;
}

.content {
    /* background: #010827 url(../../assets/images/bg1.jpg) center; */
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: #666;
    font-size: 0.1rem;
    overflow: hidden;
    height: 100vh;
}

a {
    text-decoration: none;
    color: #399bff;
}

a.active,
a:focus {
    outline: none !important;
    text-decoration: none;
}

a:hover {
    color: #06c;
    text-decoration: none !important;
}


.alltitle {
    width: 1rem;
    background-color: #055a8b;
    margin: 0.15rem 0 0.05rem 0;
    border-left: rgb(27, 233, 231) 0.03rem solid;
    font-size: 0.17rem;
    color: rgb(255, 255, 255, 1);
    text-align: center;
}

.leftside {
    height: calc(100vh - 72px);
    background: url(../../assets/images/left.png) no-repeat center center;
    background-size: 100% 100%;
    margin-left: 10px;
    /* margin-top: -0.15rem; */
    position: relative;
    animation: showLeft 1s;
}

@keyframes showLeft {
    from {
        left: -100rem;
    }

    to {
        left: 0;
    }
}

.rightside {
    height: calc(100vh - 72px);
    background: url(../../assets/images/right.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    animation: showRight 1s;
}

@keyframes showRight {
    from {
        right: -100rem;
    }

    to {
        right: 0;
    }
}

.showTeacher {
    /*  background: url(../../assets/images/userbg.png) no-repeat center center;
    background-size: 101% 100%;
    !* background-color: rgb(42, 78, 121, 0.6); *!
    width: 1.2rem;
    height: 1.7rem;
    margin: 0.1rem 0 0 0;
    text-align: center;*/
}

.itemactive {
    color: #fede7f;
    line-height: 0.4rem;
    cursor: pointer;
    /* 将鼠标更改为点击样式 */
}

.itemnomal {
    color: #fff;
    line-height: 0.4rem;
    cursor: pointer;
}

.navLink {
    position: relative;
    animation: showNav 1.77s;
}

@keyframes showNav {
    from {
        bottom: -200rem;
    }

    to {
        bottom: 0;
    }
}

.teachertype1 {
    font-weight: bold;
    background-image: linear-gradient(#fff, #fff, rgb(167, 222, 245), #44b2f5);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    /*需要文字透明*/
    font-size: 0.3rem;
    margin: 0.3rem 0 0 0.6rem;
    float: left;
}

.teachertype2 {
    font-weight: bold;
    background-image: linear-gradient(#fff, #fff, rgb(245, 215, 167), #ff9763);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    /*需要文字透明*/
    font-size: 0.3rem;
    margin: 0.3rem 0 0 0.6rem;
    float: left;
}

.teachertype3 {
    font-weight: bold;
    background-image: linear-gradient(#fff, #fff, rgb(167, 245, 185), #30bc37);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    /*需要文字透明*/
    font-size: 0.3rem;
    margin: 0.3rem 0 0 0.6rem;
    float: left;
}

.circular2 {
    position: absolute;
    border-radius: 50%;
    background-image: radial-gradient(rgb(255, 255, 255, 0) 60%,
            rgb(88, 188, 249, 0.9));
    width: 1.9rem;
    height: 1.9rem;
    margin: 2.92% 0 0 0.6%;
}

.circular3 {
    position: absolute;
    border-radius: 50%;
    background-image: radial-gradient(rgb(255, 255, 255, 0) 55%,
            rgb(88, 188, 249, 0.9));
    width: 1.15rem;
    height: 1.15rem;
    margin: 10.7% 0 0 8.8%;
}

.activeindex {
    color: #1bb3d9;
    background: url(../../assets/images/selectbg.png) no-repeat center center;
    background-size: 107% 120%;
    line-height: 0.29rem;
}

.nomalindex {
    color: #fff;
    line-height: 0.29rem;
}

.studentList {
    color: #a9d8ff;
    background: url(../../assets/images/studentList.png) no-repeat center center;
    background-size: 100% 100%;
    margin: 0.1rem 0;
    height: 0.26rem;
    line-height: 0.26rem;
}
</style>
