<template>
    <div>
        <div class="Navbar">
            <div class="navlink">
                <div v-for="item in barList" :key="item.index" :data="barList">
                    <router-link :to="{ path: item.url }" v-if="activeIndex != '/'">
                        <div :class="activeIndex.indexOf(item.url) >= 0 && item.url != '/'
                            ? 'active'
                            : 'nomal'
                            " @click="handleLink(item.url)">
                            {{ item.title }}
                            <img v-if="activeIndex.indexOf(item.url) >= 0 && item.url != '/'"
                                src="../../assets/images/bottomline.png" class="bottomline" />
                        </div>
                    </router-link>
                    <router-link :to="{ path: item.url, params: { id: item } }" v-else>
                        <div :class="activeIndex.indexOf(item.url) >= 0 ? 'active' : 'nomal'"
                            @click="handleLink(item.url, item.title)">
                            {{ item.title }}
                            <img v-if="activeIndex.indexOf(item.url) >= 0" src="../../assets/images/bottomline.png"
                                class="bottomline" />
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Navbar",
    data() {
        return {
            barList: [
                { title: "首页", url: "/index" },
                { title: "基础信息", url: "/basicinfo" },
                // {title:'安全监测',url:'/monitor'},
                { title: "感知数据", url: "/datashow" },
                { title: "视频监控", url: "/videomonit" },
                // {title:'综合分析',url:'/assetAnalysis'},
            ],
        };
    },
    methods: {
        handleLink(url, title) {
            // console.log(title)
            if (this.$route.path !== url) {
                this.$router.push({ path: url, query: { title: title } });
            }
        },
    },
    computed: {
        activeIndex() {

            return this.$route.path;
        },
    },
    watch: {
        activeIndex() {

            // if (this.activeIndex.indexOf('/videoall')>=0) {

            // }
        },
    },
    mounted() { },
};
</script>
<style></style>
