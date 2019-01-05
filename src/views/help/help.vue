<template>
  <div class="help">
    <div class="cover" v-show="isLoading">
      <img src="../../assets/img/loading.gif" />
    </div>
    <el-container>
      <el-aside width="242px">
        <el-row class="helpMenu">
          <div class="helpMenuTitle">目录管理</div>
          <el-col>
            <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
              background-color="#fff" text-color="#333333" active-text-color="#16953C">
              <div v-for="(n,index) in helpMenuList" :key="index">
                <!-- 一级目录无二级菜单 -->
                <el-menu-item v-if="n.sonHelpMenuList.length == 0" :index="index.toString()" @click="openFirstMenuList(index)">
                  <div class="liName">
                    <i class="el-icon-message"></i>
                    <span>{{n.name}}</span>
                  </div>
                  <i class="suffixBtn el-icon-caret-bottom">
                    <div class="menuSetting">
                      <p @click.stop="openAddDialog()">添加目录</p>
                      <p @click.stop="openAddDialog(n.helpCenterMenuId)">添加子目录</p>
                      <p @click.stop="openEditDialog(n)">修改名称</p>
                      <p @click.stop="deleteThisMenu(n)">删除</p>
                    </div>
                  </i>
                </el-menu-item>
                <!-- 一级目录有二级菜单 -->
                <el-submenu v-if="n.sonHelpMenuList.length != 0" :index="index.toString()">
                  <template slot="title">
                    <div class="liName">
                      <i class="el-icon-message"></i>
                      <span>{{n.name}}</span>
                    </div>
                    <i class="suffixBtn el-icon-caret-bottom">
                      <div class="menuSetting">
                        <p @click.stop="openAddDialog()">添加目录</p>
                        <p @click.stop="openAddDialog(n.helpCenterMenuId)">添加子目录</p>
                        <p @click.stop="openEditDialog(n)">修改名称</p>
                        <p @click.stop="deleteThisMenu(n)">删除</p>
                      </div>
                    </i>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item :index="index.toString()+'-'+a.toString()" v-for="(item,a) in n.sonHelpMenuList" :key="index.toString()+'-'+a.toString()"
                      @click="openHelpList(item.helpCenterMenuId,index,a)">
                      <div class="liName">
                        <i class="el-icon-message"></i>
                        <span>{{item.name}}</span>
                      </div>
                      <i class="suffixBtn el-icon-caret-bottom">
                        <div class="menuSetting">
                          <p @click.stop="openEditDialog(item)">修改名称</p>
                          <p @click.stop="deleteThisMenu(item)">删除</p>
                        </div>
                      </i>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </div>
            </el-menu>
          </el-col>
          <el-button class="helpMuneAdd" v-show="helpMenuList.length==0" @click="openAddDialog()"><i class="el-icon-plus"></i>&nbsp;&nbsp;新增</el-button>
        </el-row>
      </el-aside>
      <el-main>
        <div class="helpContain">
          <div class="helpUpload" v-show="helpQuestions">
            <div class="helpUploadTitle">帮助中心内容发布</div>
            <div v-show="helpMenuList.length!=0">
              <div class="helpEdit">
                <el-button type="success" @click="editHelpInfo()">新增</el-button>
                <el-button :disabled="!isSelect" @click="moreDelete(helpList[0].helpCenterMenuId)">批量删除</el-button>
                <el-select v-model="selectValue" placeholder="请选择" @change="selectHelpList(selectValue)">
                  <el-option v-for="item in options" :key="item.selectValue" :label="item.label" :value="item.selectValue">
                  </el-option>
                </el-select>
              </div>
              <el-table ref="multipleTable" :data="helpList" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" border stripe>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="title" label="主题" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="状态" show-overflow-tooltip width="100">
                  <template slot-scope="scope">
                    <span v-show="scope.row.status=='0'">已发布</span>
                    <span v-show="scope.row.status!='0'">未发布</span>
                    <u class="point" :class="{pointRed:scope.row.status!=0}"></u>
                  </template>
                </el-table-column>
                <el-table-column prop="sortBy" label="排序" width="60">
                </el-table-column>
                <el-table-column prop="clicks" label="点击量" width="80">
                  <template slot-scope="scope">
                    <section>{{scope.row.clicks?scope.row.clicks:0}}</section>
                  </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="发布时间" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <section>{{scope.row.status=='0'?scope.row.submitTime:'未发布'}}</section>
                  </template>
                </el-table-column>
                <el-table-column prop="modifiedon" label="修改时间" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="operation" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" @click="editHelpInfo(scope.row.helpCenterInfoId)"><i class="
                      el-icon-edit-outline"></i>修改</el-button>
                    <el-button type="text" @click="deleteThisHelpInfo(scope.row.helpCenterInfoId,scope.row.helpCenterMenuId)"><i
                        class="el-icon-delete"></i>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]"
                :page-size="10" :current-page.sync="currentPage" layout="total, sizes, prev, pager, next, jumper"
                :total="listNum?listNum:0">
              </el-pagination>
            </div>
          </div>
          <div class="helpInfo" v-show="!helpQuestions">
            <div class="helpUploadTitle"><span v-show="isNew">新增</span><span v-show="!isNew">修改</span></div>
            <el-form label-width="100px">
              <el-form-item label="栏目" prop="item" class="halfForm"><span>{{helpOne.parentMenuName}}</span><span v-show="helpOne.sonMenuName">
                  > </span><span v-show="helpOne.sonMenuName">{{helpOne.sonMenuName}}</span></el-form-item>
              <el-form-item label="定时发布" prop="publishTime" class="halfForm">
                <el-date-picker v-model="helpOne.releaseTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="12:00:00" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <p style="color:#999;">请输入40字以内标题</p>
              <el-form-item label="标题" prop="title">
                <el-input v-model="helpOne.title" :maxlength="40"></el-input>
              </el-form-item>
            </el-form>
            <p style="color:#333;">上传图片大小每张不超过1M</p>
            <div id="WangEditor" class="WangEditor"></div>
            <el-button type="success" @click="saveHelpInfo()">保存</el-button>
            <el-button v-if="helpOne.status != '0'" type="primary" @click="uploadHelpInfo()">发布</el-button>
            <el-button v-if="helpOne.status == '0'" @click="underHelpInfo()">下架</el-button>
          </div>
        </div>
      </el-main>
      <el-dialog title="新增目录" :visible.sync="dialogVisible" width="400">
        <div class="demo-input-suffix">
          目录名称：
          <el-input autofocus placeholder="请输入目录名称" :maxlength="20" v-model="firstMenuName" @keyup.native="menuNameRule(firstMenuName)"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFirstMenu()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改目录名称" :visible.sync="editDialogVisible" width="400">
        <div class="demo-input-suffix">
          目录名称：
          <el-input autofocus placeholder="请输入目录名称" :maxlength="20" v-model="editMenuName" @keyup.native="menuNameRule(editMenuName)"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editThisMenuName()">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
  import {
    exportRootUrl
  } from "../../service/baseuri.js"
  import {
    axiosget,
    axiospost,
    aixospatch
  } from "../../service/config.js"
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  import WangEditor from 'wangeditor';
  export default {
    data() {
      return {
        isMainMenuSelected: false,
        helpQuestions: true,
        selectValue: '',
        multipleSelection: [],
        helpMenuList: [],
        helpList: [],
        helpOne: {},
        defaultActive: '',
        dialogVisible: false,
        editDialogVisible: false,
        isNew: true,
        isLoading: true,
        firstMenuName: '',
        editMenuName: '',
        menuIdSave: '',
        itemSave: {},
        addMenuOne: {},
        deleteMenuList: {},
        deleteHelpList: {},
        firstNum: null,
        secondNum: null,
        isSelect: false,
        listNum: 0,
        pageShowNum: 10,
        currentPage: 1,
        options: [{
          selectValue: '0',
          label: '已发布'
        }, {
          selectValue: '1',
          label: '未发布'
        }, {
          selectValue: '2',
          label: '全部'
        }],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },
      };
    },
    async created() {
      await axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
        this.helpMenuList = res.data;
        this.isLoading = false;
      })
      if (this.helpMenuList[0].sonHelpMenuList.length == 0) {
        this.defaultActive = '0';
        this.helpList = this.helpMenuList[0].parentHelpInfoPage.list;
        this.helpOne.helpCenterMenuId = this.helpMenuList[0].helpCenterMenuId;
        this.listNum = this.helpMenuList[0].allHelpInfoPage.total;
      } else {
        this.defaultActive = '0-0';
        this.helpOne.helpCenterMenuId = this.helpMenuList[0].sonHelpMenuList[0].helpCenterMenuId;
        axiosget(
          `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpMenuList[0].sonHelpMenuList[0].helpCenterMenuId}`
        ).then(res => {
          this.helpList = res.data.list;
          this.listNum = res.data.total;
        });
      }
    },
    computed: {},
    mounted() {
      let that = this;
      this.editor = new WangEditor('#WangEditor'); //这个地方传入div元素的id 需要加#号
      //   配置 onchange 事件
      this.editor.change = function () {
        // 这里是change 不是官方文档中的 onchange
      }
      //上传图片配置start
      // 隐藏“网络图片”tab
      this.editor.customConfig.showLinkImg = false;
      // 配置服务器端地址
      this.editor.customConfig.uploadImgServer = `${exportRootUrl}/application/plat/auth/images/upload`;
      this.editor.customConfig.showLinkImg = false;
      this.editor.customConfig.uploadImgHeaders = {
        'Authorization': localStorage.getItem('token'),
        'Accept': 'application/json'
      };
      this.editor.customConfig.uploadImgHooks = {
        customInsert(insertImg, result, editor) {
          insertImg(result.url);
        }
      };
      this.editor.customConfig.uploadFileName = 'file';
      //上传图片配置end
      this.editor.customConfig.zIndex = 0
      this.editor.create() // 生成编辑器
      //   this.editor.txt.html('<p>输入内容...</p>') //注意：这个地方是txt  不是官方文档中的$txt
    },
    methods: {
      openAddDialog(menuId) {
        this.dialogVisible = true;
        this.firstMenuName = '';
        if (menuId) {
          this.menuIdSave = menuId;
          return;
        } else {
          this.menuIdSave = '';
        }
      },
      openEditDialog(item) {
        this.editDialogVisible = true;
        this.editMenuName = item.name;
        this.itemSave.helpCenterMenuId = item.helpCenterMenuId;
      },
      menuNameRule(value) {
        if (!value) {
          return;
        } else if (!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(value)) {
          this.$message.error('请检查目录名称格式，限中文或字母');
        }
      },
      addFirstMenu() {
        if (!this.firstMenuName) {
          this.$message.error('请输入目录名称');
          return;
        } else {
          this.addMenuOne.name = this.firstMenuName;
          this.addMenuOne.parentMenuId = this.menuIdSave;
          axiospost(`/application/helpCenter/admin/addHelpCenterMenu`, this.addMenuOne).then(res => {
            let success = res.msg;
            axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
              this.helpMenuList = res.data
            })
          });
          //   this.$message.error(this.success);
          console.log(this.success)
          this.dialogVisible = false;
        }
      },
      editThisMenuName() {
        if (!this.editMenuName) {
          this.$message.error('请输入目录名称');
          return;
        } else {
          this.itemSave.name = this.editMenuName;
          axiospost(`/application/helpCenter/admin/modifyHelpCenterMenu`, this.itemSave).then(res => {
            let success = res.msg;
            axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
              this.helpMenuList = res.data
            })
          });
          this.editDialogVisible = false;
        }
      },
      deleteThisMenu(item) {
        this.deleteMenuList.helpCenterMenuId = item.helpCenterMenuId;
        this.deleteMenuList.parentMenuId = item.parentMenuId;
        this.$confirm('确认删除目录？')
          .then(_ => {
            aixospatch(`/application/helpCenter/admin/delHelpCenterMenu`, this.deleteMenuList).then(res => {
              let success = res.msg;
              axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
                this.helpMenuList = res.data
              })
            });
            if (this.helpMenuList[0].sonHelpMenuList.length == 0) {
              this.defaultActive = '0';
              this.helpList = this.helpMenuList[0].parentHelpInfoPage.list;
            } else {
              this.defaultActive = '0-0';
              this.helpList = this.helpMenuList[0].sonHelpMenuList[0].sonHelpInfoList;
            }
          })
          .catch(_ => {});
      },
      deleteThisHelpInfo(helpCenterInfoId, helpCenterMenuId) {
        this.deleteHelpList.helpCenterInfoId = helpCenterInfoId;
        this.$confirm('确认删除此帮助信息？')
          .then(_ => {
            aixospatch(`/application/helpCenter/admin/delHelpCenterInfo`, this.deleteHelpList).then(res => {
              let success = res.msg;
              axiosget(`/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${helpCenterMenuId}`).then(
                res => {
                  this.helpList = res.data.list;
                  this.listNum = res.data.total;
                });
              axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
                this.helpMenuList = res.data
              })
            });
          })
          .catch(_ => {});
      },
      moreDelete(helpCenterMenuId) {
        this.$confirm('确认删除这些帮助信息？')
          .then(_ => {
            aixospatch(`/application/helpCenter/admin/delBatchHelpCenterInfo`, this.multipleSelection).then(res => {
              let success = res.msg;
              axiosget(`/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${helpCenterMenuId}`).then(
                res => {
                  this.helpList = res.data.list;
                  this.listNum = res.data.total;
                });
              axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
                this.helpMenuList = res.data
              })
            });
          })
          .catch(_ => {});
      },
      openFirstMenuList(index) {
        this.currentPage = 1;
        this.selectValue = '';
        this.firstNum = index;
        this.secondNum = null;
        this.helpList = this.helpMenuList[index].allHelpInfoPage.list;
        this.listNum = this.helpMenuList[index].allHelpInfoPage.total;
        this.helpOne.helpCenterMenuId = this.helpMenuList[index].helpCenterMenuId;
        this.helpOne.title = '';
        this.helpOne.releaseTime = '';
        this.editor.txt.html('');
        this.helpOne.status = '';
        this.helpQuestions = true;
      },
      openHelpList(helpMenuId, index, a) {
        this.currentPage = 1;
        this.selectValue = '';
        this.firstNum = index;
        this.secondNum = a;
        this.helpOne.title = '';
        this.helpOne.releaseTime = '';
        this.editor.txt.html('');
        this.helpOne.status = '';
        axiosget(`/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${helpMenuId}`).then(res => {
          this.helpList = res.data.list;
          this.listNum = res.data.total;
          this.helpQuestions = true;
        });
        if (a || a == 0) {
          this.helpOne.helpCenterMenuId = this.helpMenuList[index].sonHelpMenuList[a].helpCenterMenuId;
        } else {
          this.helpOne.helpCenterMenuId = this.helpMenuList[index].helpCenterMenuId;
        }
      },
      editHelpInfo(helpCenterInfoId) {
        this.helpQuestions = false;
        if (helpCenterInfoId) {
          axiosget(`/application/helpCenter/admin/getHelpCenterInfoById?helpCenterInfoId=${helpCenterInfoId}`).then(res => {
            this.helpOne = res.data;
            this.editor.txt.html(this.helpOne.richContent);
            this.isNew = false;
          })
        } else {
          this.isNew = true;
        }
      },
      handleOpen(key) {
        this.currentPage = 1;
        this.selectValue = '';
        this.firstNum = key;
        this.secondNum = null;
        this.helpList = this.helpMenuList[key].allHelpInfoPage.list;
        this.helpOne.helpCenterMenuId = this.helpMenuList[key].helpCenterMenuId;
        this.listNum = this.helpMenuList[key].allHelpInfoPage.total;
        this.helpOne.title = '';
        this.helpOne.releaseTime = '';
        this.editor.txt.html('');
        this.helpOne.status = '';
        this.helpQuestions = true;
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length == 0) {
          this.isSelect = false;
        } else {
          this.isSelect = true;
        }
      },
      //每页显示${val} 条
      handleSizeChange(val) {
        this.pageShowNum = val;
        axiosget(
          `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}&status=${this.selectValue}&pageNo=1&pageSize=${val}`
        ).then(
          res => {
            this.helpList = res.data.list;
            this.listNum = res.data.total;
          });
        axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
          this.helpMenuList = res.data
        })
      },
      //当前页: ${val}
      handleCurrentChange(val) {
        axiosget(
          `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}&status=${this.selectValue}&pageNo=${val}&pageSize=${this.pageShowNum}`
        ).then(
          res => {
            this.helpList = res.data.list;
            this.listNum = res.data.total;
          });
        axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
          this.helpMenuList = res.data
        })
      },
      async saveHelpInfo() {
        if (!this.helpOne.title || !this.editor.txt.text()) {
          this.$message.error('请检查是否完整输入标题及文本内容！');
          return;
        }
        this.helpOne.textContent = this.editor.txt.text();
        this.helpOne.richContent = this.editor.txt.html();
        console.log(this.editor.txt.html().length)
        console.log(this.helpOne.releaseTime)
        console.log(this.helpOne.releaseTime.length)
        if (!this.helpOne.status) {
          this.helpOne.status = '1';
          await aixospatch(`/application/helpCenter/admin/modifyHelpCenterInfo`, this.helpOne).then(res => {
            let success = res.msg;
            axiosget(
              `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}`
            ).then(
              res => {
                this.helpList = res.data.list;
                this.listNum = res.data.total;
              });
            axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
              this.helpMenuList = res.data
            })
            this.helpQuestions = true;
            this.helpOne.title = '';
            this.helpOne.releaseTime = '';
            this.editor.txt.html('');
            this.helpOne.status = '';
          });
        } else {
          if (this.helpOne.releaseTime) {
            this.helpOne.status = '1';
          }
          await aixospatch(`/application/helpCenter/admin/modifyHelpCenterInfo`, this.helpOne).then(res => {
            let success = res.msg;
            axiosget(
              `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}`
            ).then(
              res => {
                this.helpList = res.data.list;
                this.listNum = res.data.total;
              });
            axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
              this.helpMenuList = res.data
            })
            this.helpQuestions = true;
            this.helpOne.title = '';
            this.helpOne.releaseTime = '';
            this.editor.txt.html('');
            this.helpOne.status = '';
          });
        }
      },
      async uploadHelpInfo() {
        if (!this.helpOne.title || !this.editor.txt.text()) {
          this.$message.error('请检查是否完整输入标题及文本内容！');
          return;
        }
        this.helpOne.textContent = this.editor.txt.text();
        this.helpOne.richContent = this.editor.txt.html();
        if (this.helpOne.releaseTime) {
          this.helpOne.status = '1';
        } else {
          this.helpOne.status = '0';
        }
        await aixospatch(`/application/helpCenter/admin/modifyHelpCenterInfo`, this.helpOne).then(res => {
          let success = res.msg;
          axiosget(
              `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}`)
            .then(
              res => {
                this.helpList = res.data.list;
                this.listNum = res.data.total;
              });
          axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
            this.helpMenuList = res.data
          })
          this.helpQuestions = true;
          this.helpOne.title = '';
          this.helpOne.releaseTime = '';
          this.editor.txt.html('');
          this.helpOne.status = '';
        });
      },
      async underHelpInfo() {
        if (!this.helpOne.title || !this.editor.txt.text()) {
          this.$message.error('请检查是否完整输入标题及文本内容！');
          return;
        }
        this.helpOne.textContent = this.editor.txt.text();
        this.helpOne.richContent = this.editor.txt.html();
        this.helpOne.status = '1';
        await aixospatch(`/application/helpCenter/admin/modifyHelpCenterInfo`, this.helpOne).then(res => {
          let success = res.msg;
          axiosget(
              `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}`)
            .then(
              res => {
                this.helpList = res.data.list;
                this.listNum = res.data.total;
              });
          axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
            this.helpMenuList = res.data
          })
          this.helpQuestions = true;
          this.helpOne.title = '';
          this.helpOne.releaseTime = '';
          this.editor.txt.html('');
          this.helpOne.status = '';
        });
      },
      selectHelpList(num) {
        axiosget(
          `/application/helpCenter/admin/getHelpInfoByMenuIdAndPage?menuId=${this.helpOne.helpCenterMenuId}&status=${num}&pageNo=1&pageSize=10`
        ).then(
          res => {
            this.helpList = res.data.list;
            this.listNum = res.data.total;
          });
        axiosget(`/application/helpCenter/admin/getHelpCenterParentMenu`).then(res => {
          this.helpMenuList = res.data
        })
      }
    }
  };

</script>

<style lang="scss" rel="stylesheet/stylus">
  @import "/help.scss";

</style>
