<template>
    <div class="content">
        <!-- head -->
        <Head></Head>
        <!-- maincontent -->
        <div class="mainbox">
            <el-row>
                <el-col :span=6>
                    <div class="leftside">
                    </div>
                </el-col>
                <el-col :span=12>
                    <div style="height:8.15rem;">&emsp;</div>
                    <div style="width: 100%;text-align: center; ">
                    <Navbar></Navbar>
                    </div>
                </el-col>
                <el-col :span=6>
                    <div class="rightside">
                   
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import Navbar from "../components/Navbar";
import Head from '../components/head';
export default{
    components: { Navbar , Head },
    data(){
        return{
          
        }
    },
    methods:{

    }
}
</script>
<style>
.leftside{
  height: 8.7rem;
  background: url(../../assets/images/left.png) no-repeat center center ;
  background-size: 100% 100%;
  margin-left: 0.1rem;
  margin-top: -0.15rem;
}
.rightside{
  height: 8.7rem;
  background: url(../../assets/images/right.png) no-repeat center center ;
  background-size: 100% 100%;
  margin-right: 0.1rem;
  margin-top: -0.15rem;
}
</style>