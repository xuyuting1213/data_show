<template>
    <div class="menu">
        <headmenu></headmenu>

        <el-container style="height: 100vh">
            <!-- <el-header>
          <div class="head headContainer">
            <h1>秦邮安全风险预警系统</h1>
          </div>
        </el-header> -->

            <el-container>
                <el-aside class="ele_aside" style="position: relative">
                    <el-tooltip class="item" content="返回首页" placement="top-start">
                        <div style="
                color: white;
                position: absolute;
                right: 0.7rem;
                top: 0rem;
                cursor: pointer;
                color: #5bc0de;
                font-weight: bold;
              " @click="backIndex">
                            <i class="el-icon-d-arrow-left" style=" font-weight: bold"></i>
                            <span> 首页 </span>
                        </div>
                    </el-tooltip>
                    <el-menu :default-active="activeSubMenu" class="sidebar-menu">
                        <template v-for="item in subMenuItems">
                            <el-menu-item v-if="!item.children || !item.children.length"
                                :key="item.index ? item.index : item.path" :index="item.index ? item.index : item.path"
                                class="sub_menu" @click="
                                    handleLeftMenuSelect(item.index ? item.index : item.path)
                                    ">
                                {{ item.name }}
                            </el-menu-item>

                            <el-submenu v-if="item.children && item.children.length" :key="item.index"
                                :index="item.index">
                                <template #title>
                                    <div @click="videoClick(item)" class="menu_subtitle" :style="{
                                        background:
                                            curr_videoname == item.name ? '#335984c9' : '',
                                    }"> {{ item.name }}
                                    </div>
                                </template>
                                <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path"
                                    v-if="!subItem.children || !subItem.children.length" class="sub_menu"
                                    @click="handleLeftMenuSelect(subItem.path)">
                                    {{ subItem.name }}
                                </el-menu-item>

                                <el-submenu v-else :key="subItem.index" :index="subItem.index"
                                    style="margin-left: 0.15rem;">
                                    <template #title>
                                        <div @click="videoClick(subItem)" class="menu_subtitle" :style="{
                                            background:
                                                curr_videoname == subItem.name ? '#335984c9' : '',
                                        }"> {{ subItem.name }}
                                        </div>
                                    </template>
                                    <el-menu-item v-for="subItems in subItem.children" :key="subItems.path"
                                        :index="subItems.path" class="sub_menu"
                                        @click="handleLeftMenuSelect(subItems.path)">
                                        {{ subItems.name }}
                                    </el-menu-item>
                                </el-submenu>
                            </el-submenu>
                        </template>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import headmenu from "../components/head.vue";
import Navbar from "../components/Navbar.vue";
import { queryVideoSite } from "../../api/watch/video/videosite";
import { getInfo } from "@/api/login";

export default {
    components: { headmenu, Navbar },
    data() {
        return {
            activeRoute: "/basicinfo", // 默认选中的顶部菜单
            activeSubMenu: "/basicinfo/introduction",
            topMenuItems: [
                { name: "首页", path: "/" },
                { name: "基础信息", path: "/basicinfo" },
                { name: " ", path: " " },
                { name: "感知数据", path: "/datashow" },
                { name: "视频监控", path: "/videomonit" },
            ],
            subMenuItems: [],
            currentitle: "",
            allMenu: {
                基础信息: [
                    {
                        name: "企业基础信息",
                        index: "/basicinfo/introduction",
                    },
                    {
                        name: "企业自动化系统建设",
                        index: "/basicinfo/autocompany",
                    },
                    {
                        name: "企业专项信息",
                        index: "/basicinfo/personalrecord",
                    },
                    {
                        name: "设施设备信息",
                        index: "/deviceinfo",
                        children: [
                            { name: "高炉", path: "/basicinfo/deviceinfo/devicetallbottle" },
                            {
                                name: "转炉",
                                path: "/basicinfo/deviceinfo/devicerotatebottle",
                            },
                            { name: "煤气柜", path: "/basicinfo/deviceinfo/gasbox" },
                            {
                                name: "连铸机",
                                path: "/basicinfo/deviceinfo/devicecontinuous",
                            },
                            {
                                name: "吊运熔融金属起重机",
                                path: "/basicinfo/deviceinfo/deviceHangmachine",
                            },
                            {
                                name: "熔融金属罐体",
                                path: "/basicinfo/deviceinfo/devicemoltentanl",
                            },

                            {
                                name: "煤气设施（管道）眼镜阀组合式隔断装置",
                                path: "/basicinfo/deviceinfo/glassgasdevice",
                            },
                            {
                                name: "正压煤气管道水封式煤气排水器",
                                path: "/basicinfo/deviceinfo/gasdrainerdevice",
                            },

                            {
                                name: "固定式一氧化碳报警器",
                                path: "/basicinfo/deviceinfo/deviceCowarnning",
                            },
                            {
                                name: "炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施",
                                path: "/basicinfo/deviceinfo/deviceEmergencyfac",
                            },
                            {
                                name: "高炉生产过程炉顶放散阀联锁放散压力设定",
                                path: "/basicinfo/deviceinfo/devicereliefset",
                            },
                        ],
                    },
                    {
                        name: "企业日常数据",
                        index: "/companydaily",
                        children: [
                            { name: "点检记录", path: "/basicinfo/companydaily/checkout" },
                            {
                                name: "定期检验/校准记录",
                                path: "/basicinfo/companydaily/regularcheck",
                            },
                            {
                                name: "设备停用记录",
                                path: "/basicinfo/companydaily/stopwork",
                            },
                            {
                                name: "设备报废记录",
                                path: "/basicinfo/companydaily/scrabwork",
                            },
                        ],
                    },
                ],
                视频监控: [
                    {
                        name: "炼铁厂",
                        index: "/videomonit",
                        children: [
                            { name: "高炉", path: "/videomonit/bottle/bottletall" },
                            // { name: "罐区2", path: "/videomonit/bottle" },
                            // { name: "罐区3", path: "/videomonit/bottle" },
                        ],
                    },
                    {
                        name: "炼钢厂",
                        index: "/control",
                        children: [
                            { name: "转炉", path: "/services/consulting" },
                            { name: "连铸", path: "/services/development" },
                            // { name: "中控3", path: "/services/development" },
                        ],
                    },
                    {
                        name: "石灰厂",
                        index: "/car",
                        children: [
                            { name: "气柜车间", path: "/services/consulting" },
                            // { name: "装车站2", path: "/services/development" },
                            // { name: "装车站3", path: "/services/development" },
                        ],
                    },
                    {
                        name: "制氧厂",
                        index: "/exprience",
                        children: [{ name: "氧气球罐", path: "/services/consulting" }],
                    },
                ],
                感知数据: [
                    {
                        name: "感知数据",
                        index: "/datashow",
                        children: [
                            { name: "高炉", path: "/datashow/highbottleshow" },
                            {
                                name: "1#转炉",
                                path: "/datashow/rotatebottleshow",
                            },
                            {
                                name: "2#转炉",
                                path: "/datashow/rotatebottleshowtwo",
                            },
                            {
                                name: "煤气柜",
                                path: "/datashow/gasboxshow",
                            },
                            {
                                name: "液氧储槽",
                                path: "/datashow/oxgenshow",
                            },
                            // { name: "煤气柜", path: "/datashow/gasshow" },
                            {
                                name: "固定式一氧化碳报警器",
                                path: "/datashow/cowarning",
                            },
                        ],
                    },
                    {
                        name: "报警信息",
                        index: "/datashow/warning",
                        // children: [
                        //   { name: "报警信息1", path: "/services/consulting" },
                        //   // { name: "连铸", path: "/services/development" },
                        //   // { name: "中控3", path: "/services/development" },
                        // ],
                    },
                ],
            },
            curr_videoname: "",
        };
    },
    methods: {
        backIndex() {
            this.$router.push("/index");
        },
        videoClick(item) {
            // console.log(item);

            // if (
            //     item.index.indexOf("videoall") >= 0 &&
            //     this.$route.path !== item.index
            // ) {
            //     this.curr_videoname = item.name;
            //     console.log(item);
            //     this.$router.push("/videoall");
            //     this.$store.commit("curr_video", JSON.stringify(item));
            // }
        },
        handleLeftMenuSelect(path) {
            //   console.log(path);
            this.curr_videoname = "";

            if (this.$route.path !== path) {
                this.activeSubMenu = path;
                this.$router.push(path);
            }
        },
        buildTree(data) {
            // 创建一个以 id 为键的对象映射
            const map = {};
            data.forEach(item => {
                map[item.id] = { ...item, children: [] };
            });

            const tree = [];
            data.forEach(item => {
                if (item.parentId === null || !map[item.parentId]) {
                    // 如果 parentId 是 null 或者不存在于映射中，则认为是顶层节点
                    tree.push(map[item.id]);
                } else {
                    // 否则，添加到对应的父节点的 children 中
                    map[item.parentId].children.push(map[item.id]);
                }
            });

            return tree;
        },
        generateSubMenuitems(data) {
            const subMenuitems = [];
            // console.log(buildTree(res.rows));
            let result = this.buildTree(data)
            result.map((item, index) => {
                subMenuitems[index] = {
                    name: item.plant,
                    // index: `/videoall`,
                    index: item.plant,
                    children: [
                    ],
                }
                subMenuitems[index].children = item.children.map(items => {
                    return {
                        name: items.name,
                        path: `/videomonit/bottle/${items.id}`,
                    }
                })
            });

            subMenuitems.unshift({
                index: '/warningvideo',
                name: '视频报警',
            })
            let new_menu = [subMenuitems[0], {
                name: '视频信息',
                index: '视频信息',
                children: [...subMenuitems.slice(1)]
            }]
            // console.log('meu', new_menu);

            return new_menu;
            // return subMenuitems;

        },
        changeMenu() {
            switch (true) {
                case this.$route.path.indexOf("/basicinfo") >= 0: {
                    this.subMenuItems = this.allMenu["基础信息"];
                    break;
                }

                case this.$route.path.indexOf("/datashow") >= 0: {
                    this.subMenuItems = this.allMenu["感知数据"];
                    break;
                }
            }
            this.activeSubMenu = this.$route.path;
            //   console.log(this.activeSubMenu)
        },
        async getAuthInfo() {
            let res2 = await getInfo()
            console.log('权限', res2);

            if (res2.code == 200) {
                this.$store.commit("systemauthInfo", res2)

                let alarm_auth = res2.pagePermissions.find(item => item.name ==
                    'TbAlarmWorkOrder处理')
                console.log(alarm_auth);

                if (alarm_auth) {
                    this.$store.commit("alertHandle", new Date().getTime())

                }
            } else {
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
        },

    },
    computed: {
        activeIndex() {
            return this.$route.path;
        },
    },
    watch: {
        activeIndex(newvalue, oldvalue) {
            // console.log('aaaaaaa',newvalue, oldvalue);
            this.changeMenu();
            if (
                (newvalue.indexOf("/videomonit") >= 0 &&
                    oldvalue.indexOf("/videomonit") < 0)
                ||
                newvalue.indexOf("/warningvideo") >= 0
                // ||
                // newvalue.indexOf("/videoall") >= 0
            ) {
                queryVideoSite().then((res) => {
                    // console.log(res.rows);
                    this.subMenuItems = this.generateSubMenuitems(res.rows);
                });
            }
        },
    },
    mounted() {
        this.changeMenu();
        // this.getAuthInfo();
        if (
            this.$route.path.indexOf("/videomonit") >= 0
            ||
            this.$route.path.indexOf("/warningvideo") >= 0
            // ||
            // this.$route.path.indexOf("/videoall") >= 0
        ) {
            // this.subMenuItems = this.allMenu["视频监控"];
            //   console.log(queryVideoSite);
            queryVideoSite().then((res) => {
                // console.log(res.rows);
                if (res.code == 200) {
                    this.subMenuItems = this.generateSubMenuitems(res.rows);
                    this.videoClick(this.subMenuItems[0]);
                    // console.log(arr);
                    // console.log(this.subMenuItems);

                    // this.$store.commit("videoData", this.subMenuItems);
                } else {
                    this.$message({
                        type: "warning",
                        message: "登录已过期,自动重新登录",
                        //   duration: 0,
                        showClose: true,
                    });
                    setTimeout(() => {
                        this.$router.push("/");
                    }, 2000);
                }
            });
        }
    },
};
</script>

<style lang="less">
.menu {
    // background: #010827 url(../../assets/images/sysbg.jpg) center;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    overflow: hidden;

    .el-menu {
        background: transparent;
    }

    .el-main {
        z-index: 4;
        padding-left: 0px;
        padding-top: 0px;
        padding-right: 10px;
        height: calc(100% - 26px);
    }

    .el-menu--horizontal>.el-menu-item {
        text-align: center;
        width: 25%;
    }

    .el-header {
        padding: 0px;
        height: 66px !important;
        // background: url(../../assets/images/head3.png) no-repeat center center;
        background-size: 110% 110%;
        // background-position: -1.15rem -0.2rem;
        position: relative;
        z-index: 100;
        animation: showhead 0s !important;
    }

    .el-submenu__title,
    .el-menu-item {
        color: white;

        &:hover {
            color: #409eff;
        }
    }

    .sidebar-menu {
        height: calc(100% - 24px);
        overflow-y: auto;
    }

    .el-submenu .el-menu-item {
        height: 40px;
        line-height: 40px;
        padding: 0px 30px;
        min-width: 200px;

        &:hover {
            background-color: #335984c9 !important;
        }

        &:focus {
            background: transparent;
            color: white;
        }
    }

    .el-menu-item,
    .el-submenu__title {
        &:hover {
            background-color: #335984c9 !important;
        }

        &:focus {
            background: transparent;
            // color: white
        }
    }

    .sidebar-menu {
        border-right: 0px;

        .el-menu-item.is-active {
            background-color: #335984c9 !important;
        }
    }

    .ele_aside {
        width: 367px !important;
        margin: 0px 20px 0 10px;
        // margin-top: 0px;
        height: calc(100vh - 72px);
        background: #07243fa8;
        background: url(../../assets/images/left.png) no-repeat center center;
        background-size: 100% 100%;
        padding: 40px 10px 0 10px;
        // animation: showLeft 1s;
        color: white;
    }

    .el-menu-item,
    .el-submenu__title {
        height: 40px;
        line-height: 40px;
        list-style: none;
    }

    // .head {
    //   height: 100%;
    //   background: url(../../assets/images/head3.png) no-repeat center center;
    //   background-size: 110% 110%;
    //   // background-position: -2rem -1rem;  position: relative;
    //   z-index: 100;
    //   animation: showhead 1s;
    //   margin-top: -10px;
    // }
    .headContainer {
        display: flex;
        justify-content: center;
        font-size: 22px;
        line-height: 66px;
    }

    @keyframes showhead {
        from {
            top: -200rem;
        }

        to {
            top: 0;
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(1 27 38 / 70%);
    /* 半透明黑色遮罩 */
}

.top_menuitem {
    color: #5bcbd5 !important;
    font-size: 18px !important;
    height: 54px !important;
    line-height: 54px !important;
}

.top_menuitem .is-active {
    background-color: #335984c9 !important;
}

.menutitle {
    width: 20%;
}
</style>
