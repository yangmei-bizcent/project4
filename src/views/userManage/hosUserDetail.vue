<template>
   <div class="page-container page-hosuserdetail">
       <div class="detail-title"><span>查看详情</span><el-button size="small" @click="$router.push('/userManage/hosUserManage')"><img src="../../assets/img/back.png"/>返回</el-button></div>
       <el-form label-position="right" label-width="110px">
            <el-form-item label="机构名称">
                <div>{{orgInfo.name}}</div>
            </el-form-item>
            <el-form-item label="机构类别">
                <div>{{orgInfo.projectCategory}}</div>
            </el-form-item>
            <el-form-item label="机构地址">
                <div>{{orgInfo.province}} {{orgInfo.city}} {{orgInfo.area}} {{orgInfo.address}}</div>
            </el-form-item>
            <el-form-item label="组织机构代码">
                <div>{{orgInfo.authCode}}</div>
            </el-form-item>
            <el-form-item label="组织机构代码证明证件">
                <div class="flex-align-start flex-wrap">
                    <div 
                        v-for="(item, index) in orgcodeUrl" 
                        :key="index"
                        class="paddingX5 padding5X relative marginright15 height150" 
                        @mouseover="showLargeImgTool('largeProveImgTool', index)" 
                        @mouseleave="hideLargeImgTool('largeProveImgTool', index)">
                        <div  
                            class="absolute textAlignCenter cursorPointer displayNone largeImgTool largeProveImgTool" 
                            @click="showLargeImg(item.url)">
                            <i class="el-icon-zoom-in color-white"></i>
                        </div>
                        <img :src="item.url" alt="组织机构代码证明证件" class="height100">
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="医疗机构执业许可证登记号">
                <div>{{orgInfo.licenceNumber}}</div>
            </el-form-item>
            <el-form-item label="医疗机构执业许可证">
                <div class="flex-align-start flex-wrap">
                    <div 
                        v-for="(item, index) in orglicenceUrl" 
                        :key="index"
                        class="paddingX5 padding5X relative marginright15 height150" 
                        @mouseover="showLargeImgTool('largeLicenseImgTool', index)" 
                        @mouseleave="hideLargeImgTool('largeLicenseImgTool', index)">
                        <div  
                            class="absolute textAlignCenter cursorPointer displayNone largeImgTool largeLicenseImgTool" 
                            @click="showLargeImg(item.url)">
                            <i class="el-icon-zoom-in color-white"></i>
                        </div>
                        <img :src="item.url" alt="组织机构代码证" class="height100">
                    </div>
                </div>
            </el-form-item>

            <el-dialog title="查看大图" :visible.sync="imgDlgVisible">
                <div class="textAlignCenter">
                    <img :src="LargeImgSrc" width="70%" height="70%">
                </div>
            </el-dialog>
        </el-form>
   </div> 
</template>

<script>
export default {
    data() {
        return {
            imgDlgVisible: false,
            LargeImgSrc: '',    // 大图src
            orgInfo:"",
            orgcodeUrl:"",
            orglicenceUrl:""
        }
    },
    created(){
        let loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.5)',
                target: 'page-hosuserdetail'
            });
        this.$store.dispatch({
            type:'getPlatformHospitalByPhId',
            phid:this.$route.query.orgzId
        }).then((res)=>{
            loading.close();
            if(res.data!=null){
                this.orgInfo=res.data;
                this.orgcodeUrl=JSON.parse(res.data.codeUrl);
                this.orglicenceUrl=JSON.parse(res.data.licenceUrl);
            }
            // console.log(res);
        })
    },
    methods: {
        // 鼠标放上去时 显示放大镜
        showLargeImgTool(overlayClassname, index) {
            document.getElementsByClassName(overlayClassname)[index].style.display = 'block';
        },
        hideLargeImgTool(overlayClassname, index) {
            document.getElementsByClassName(overlayClassname)[index].style.display = 'none';
        },
        showLargeImg(src) {
            this.imgDlgVisible = true;
            this.LargeImgSrc = src;
        },
    },
}
</script>

<style lang="scss">
    .page-hosuserdetail {
        padding: 15px 28px;
        .height100 {
            height: 100%;
        }
        .height150 {
            height: 150px;
        }
        .largeImgTool {
            width: 100%;
            height: 150px;
            line-height: 150px;
            left: 0;
            top: 0px;
            background-color: rgba(0,0,0,0.4);
            i {
                font-size: 28px;
            }
        }

        .detail-title {
            display: flex;
            justify-content: space-between;
            height: 44px;
            line-height: 44px;
            margin-bottom: 20px;
            // padding-left: 13px;
            border-bottom: 1px solid #E6E6E6;
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #425B77;
            letter-spacing: 0.2px;
            .el-button {
                width: 69px;
                height: 34px;
                padding: 9px 10px;
                img {
                    padding-right: 8px;
                }
            }
        }

        .el-form-item__label {
            color: #425B77;
            letter-spacing: 0.2px;
            padding-right: 20px;
            line-height: 20px;
        }

        .el-form-item__content {
            line-height: 20px;
        }
    }
</style>



