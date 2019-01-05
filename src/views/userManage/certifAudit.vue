<template>
  <div class="page-container certif-audit">
    <el-tabs v-model="activeName" type="card" class="ts-tabdown" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first"></el-tab-pane>
      <el-tab-pane label="已审核" name="second"></el-tab-pane>
    </el-tabs>
    <div class="certif-title">
      <span>认证审核
        <span v-if="audited" class="audit-result">审核通过：
          <span class="audited">{{passNum}}</span> 条&nbsp;&nbsp;&nbsp;&nbsp;审核不通过：
          <span class="unaudited">{{checked.length - passNum}}</span> 条
        </span>
      </span>
      <el-input class="search" placeholder="请输入机构名称" v-model="searchContent" size="small">
        <template slot="append">
          <i class="el-icon-search" @click="search"></i>
        </template>
      </el-input>
    </div>
    <el-table
      :data="certifAuditData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border stripe tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="content" label="审核内容"></el-table-column> -->
      <el-table-column prop="name" label="机构名称"></el-table-column>
      <el-table-column prop="projectCategory" label="机构类别"></el-table-column>
      <el-table-column prop="linkmanName" label="提交人"></el-table-column>
      <el-table-column prop="modifiedon" label="提交审核时间" :formatter="dateFormater"></el-table-column>
      <el-table-column prop="auditTime" v-if="audited" label="审核时间"  :formatter="dateFormater"></el-table-column>
      <el-table-column v-if="audited" prop="auditPostil" label="审核结果">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row, false)">
            <i class="el-icon-ts-pass" v-if="scope.row.auditStatus === checkedSuccessCode"></i>
            <i class="el-icon-ts-X" v-else></i>
            {{ scope.row.auditStatus === checkedSuccessCode ? '审核通过' : '审核未通过' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-else prop="oprate" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row, true)">
            <i class="el-icon-search"></i> 查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block textAlignRight margintop30" v-if="total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import axios from "axios";
import fecha from 'fecha';
export default {
  async created() {
    await this.$store.dispatch({
      type: 'getAlllatformHospital',
      key: this.searchContent
    }).then((res) => {
      this.filterItems(res.data);
      this.initPageTotal();
    });
  },

  data() {
    return {
      certifAuditData: [],
      checkPending: [],
      checked: [],
      passNum: 0,
      checkPendingCode: '10',
      checkingCode: '20',
      checkedSuccessCode: '40',
      checkedFailCode: '30',
      activeName: "first",
      audited: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectVal: "",
      content:"认证信息",
      searchOpt: [
        { value: "0", label: "待审核" },
        { value: "1", label: "已审核" }
      ],
      multipleSelected: [],
      auditedCount: 2,
      unauditedCount: 4,
      searchContent: ""
    };
  },
  computed: {
    ...mapGetters({
      token: "token",
      applyState: "applyState" // 申请单状态：待审核0，已审核1
    })
  },
  mounted() {
    this.audited = this.applyState == 0 ? false : true;
    this.activeName = this.applyState == 0 ? "first" : "second";
  },
  methods: {
    dateFormater: function(row, column, cellValue){
        return cellValue ? fecha.format(new Date(cellValue.replace(/-/g,"/")), 'YYYY-MM-DD HH:mm') : '';
      },
    filterItems (list) {
      this.checkPending = [];
      this.checked = [];
      this.passNum = 0;
      for(let item of list) {
        if (item.auditStatus == this.checkPendingCode || item.auditStatus == this.checkingCode) {
          this.checkPending.push(item);
        } else {
          if (item.auditStatus == this.checkedSuccessCode) {
            ++this.passNum;
          }
          this.checked.push(item);
        }
      }

      
      this.certifAuditData = this.applyState == 0 ? this.checkPending : this.checked;
    },
    initPageTotal () {
      this.total = this.applyState == 0 ? this.checkPending.length : this.checked.length;
    },
    handleClick(tab, event) {
      if(event.target.getAttribute('id') === 'tab-first') {
        this.certifAuditData = this.checkPending;
        this.total = this.checkPending.length;
        this.currentPage = 1;
        this.audited = false;
      } else if (event.target.getAttribute('id') === 'tab-second') {
        this.certifAuditData = this.checked;
        this.total = this.checked.length;
        this.currentPage = 1;
        this.audited = true;
      }
      this.changeApplyStatus()
    },
    ...mapActions(["set_applyState"]),
    search() {
      this.$store.dispatch({
        type: 'searchPlatformHospitalByName',
        key: this.searchContent
      }).then(res => {
        if (res.status == 200) {
          this.filterItems(res.data);
          this.currentPage = 1;
          this.initPageTotal();
        }
      }).catch(error => {
        this.filterItems([]);
        this.currentPage = 1;
        this.initPageTotal();
      });
    },
    changeApplyStatus() {
      var self = this;
      let currentApplyState = this.audited ? '1' : '0'
      self.set_applyState(currentApplyState);
    },
    getcertifAuditData() {
      var self = this;
      axios
        .get("http://localhost:9090/static/datas/certifAudit.json")
        .then(function(response) {
          if (response.status == 200) {
            self.certifAuditData = response.data.certifAuditData;
            self.total = response.data.total;
            let auditedArr = response.data.certifAuditData.filter(
              item => item.auditResult === "审核通过"
            );
            self.auditedCount = auditedArr.length;
            self.unauditedCount =
              response.data.certifAuditData.length - auditedArr.length;
          } else {
            self.$alert(response.data.msg, "提示");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toDetail(rowData, isDispatch) {
      if (isDispatch) {
        this.set_applyState('0');
        this.$store.dispatch({
          type: 'getOrgPlatformHospital',
          data: rowData
        }).then(res => {
          if (res.status == 200) {
            this.$router.push({
              path: "/userManage/certifAuditDetail",
              query: {
                orgzId: rowData.platformHospitalId
              }
            });
          }
        })
      } else {
        this.set_applyState('1');
        this.$router.push({
          path: "/userManage/certifAuditDetail",
          query: {
            orgzId: rowData.platformHospitalId
          }
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelected = val;
    },
    // START 表格分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
    // END 表格分页
  },
  watch: {
    applyState () {
      this.searchContent = '';
      this.search();
    }
  }
};
</script>

<style lang="scss">
.certif-audit {
  .certif-title {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    margin-bottom: 20px;
    // padding-left: 13px;
    border-bottom: 1px solid #e6e6e6;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #425b77;
    letter-spacing: 0.2px;
    .el-button {
      width: 88px;
      height: 34px;
      font-size: 14px;
    }

    .audit-result {
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      margin-left: 20px;
      .audited {
        color: #68bf67;
      }
      .unaudited {
        color: #df6761;
      }
    }

    .search.el-input {
      width: 260px;
      i {
        cursor: pointer;
      }
    }
  }
  .el-table {
    thead.has-gutter {
      tr th {
        color: #425b77;
        letter-spacing: 0;
      }
    }
  }

  .el-pagination {
    .el-pagination__total,
    .el-pagination__sizes {
      float: left;
    }
  }
}
</style>


