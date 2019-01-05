<template>
  <div class="ts-wrapper" :class="{hideSidebar:isCollapse}">
    <ts-sidebar ref="sidebar" :collapsevalue="isCollapse" :routeMenu="routeMenu" :logo="layoutLogo" :simpleLogo="simpleLogo"></ts-sidebar>
    <ts-navbar :userInfo="userInfo" :userMenu="userMenu" :default-active="activeIndex" @sidebarHide="hideside"
      @userItemClick="useritemclick">
      <router-view></router-view>
    </ts-navbar>
  </div>
</template>

<script>
  import layoutLogo from "@/assets/img/layoutLogo.png";
  import simpleLogo from "@/assets/img/simpleLogo.png";
  import {
    generaMenu
  } from "@/util";
  import {
    mapActions
  } from "vuex";
  import userManage from '../assets/img/userManage.png'

  export default {
    data() {
      return {
        isCollapse: false,
        routeMenu: [{
          path: "/userManage",
          // name: "/userManageuserManage",
          meta: {
            title: "用户管理",
            icon: 'ts-info'
          },
          children: [
            {
              path: "hosUserManage",
              meta: {
                title: "医院用户管理"
              }
            },
            {
              path: "certifAudit",
              meta: {
                title: "认证审核"
              }
            }
          ]
        },
        {
          path: "/baseConfig",
          // name: "/userManageuserManage",
          meta: {
            title: "基础配置",
            icon: 'ts-info'
          },
          children: [
            {
                path: "msgConfig",
                meta: {
                  title: "短信网关配置"
                }
              },
            {
              path: "baseHosUserManage",
              meta: {
                title: "特殊短信通知"
              }
            },
            {
              path: "msgManage",
              meta: {
                title: "系统发送短信模板"
              }
            }
          ]
        },
        {
          path: "/applicationManage",
          meta: {
            title: "应用管理",
            icon: "ts-bookok"
          },
          children: [
            {
              path: "typeManage",
              meta: {
                title: "分类管理"
              }
            }, {
              path: "applicationConfig",
              meta: {
                title: "应用配置"
              }
            }
          ]
        }, {
          path: "/help",
          meta: {
            title: "信息发布管理",
            icon: 'ts-info'
          },
          children: [{
              path: "help",
              meta: {
                title: "帮助中心"
              }
            },
          ]
        }],
        userInfo: {
          // userphoto: userphoto,
          username: "浙一医院"
        },
        userMenu: [{
          text: "退出账号"
        }],
        // topMenu: [
        //   {
        //     title: "全部组件",
        //     index: "1"
        //   },
        // ],
        activeIndex: "",
        layoutLogo,
        simpleLogo
      };
    },

    mounted() {
      this.activeIndex = sessionStorage.getItem("activeIndex") || "1";
      // generaMenu(this.routeMenu, this.$store.state.baseRouters);
    },

    methods: {
      ...mapActions(["requestBaseRouter"]),
      hideside(isCollapse) {
        this.isCollapse = isCollapse;
      },
      useritemclick(i) {
        this.$message(`您选择了${i.text}`);
        if (i.text == "退出账号") {
          this.$router.push("/");
        }
      },
      // menuitemclick(i) {
      //   // this.$notify({
      //   //   title: "这是自定义方法",
      //   //   message: `已为您切换至${i.title}`,
      //   //   type: "success"
      //   // })
      //   this.routeMenu = [];
      //   this.requestBaseRouter(i.index);
      //   // generaMenu(this.routeMenu, this.$store.state.baseRouters);
      //   // this.$router.addRoutes(this.routeMenu);

      //   let path;
      //   if (i.index === "1") {
      //     path = this.routeMenu[0].path;
      //   } else {
      //     path = `${this.routeMenu[0].path}/${
      //       this.routeMenu[0].children[0].path
      //     }`;
      //   }
      //   this.$router.push(path);
      // }
    },
    components: {}
  };

</script>

<style lang='scss'>
  .ts-wrapper .sidebar-container .biglogo>img {
    width: auto;
    height: auto;
  }

  .ts-wrapper .sidebar-container .smalllogo>img {
    width: auto;
    height: auto;
  }

</style>