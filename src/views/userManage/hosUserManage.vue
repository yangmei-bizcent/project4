<template>
  <div class="page-container hos-user-manage">
    <el-row class="margin15X textAlignRight">
      <!-- <el-button size="small" type="primary" @click="toMsgManage">系统发送短信管理</el-button> -->
      <el-button size="small" type="info" @click="batchSendMsg">批量发送短信</el-button>
    </el-row>
    <el-table :data="hosUserData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border stripe tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="Tabloading">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" prop="seq" width="60" align="center">
      </el-table-column>
      <el-table-column prop="name" label="机构名称" width="130" align="center"></el-table-column>
      <el-table-column prop="projectCategory" label="机构类别" align="center"></el-table-column>
      <el-table-column prop="linkmanName" label="认证人" align="center"></el-table-column>
      <el-table-column prop="linkmanPhone" label="认证人联系方式" align="center" width="150"></el-table-column>
      <!-- <el-table-column prop="commonPackage" label="大众版套餐" align="center"></el-table-column>
      <el-table-column prop="yihuPackage" label="医护版套餐" align="center"></el-table-column> -->
      <el-table-column prop="modifiedon" label="注册时间" align="center" width="130" :formatter="dateFormater"></el-table-column>
      <el-table-column prop="oprate" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <section>
            <el-button type="text" @click="toDetail(scope.row)">
              <i class="el-icon-search"></i> 查看
            </el-button>
            <el-button type="text" @click="sendMsg(scope.row)">
              <i class="el-icon-ts-release"></i> 发送短信
            </el-button>
          </section>
        </template>
      </el-table-column>
    </el-table>
    <div class="block textAlignRight margintop30" v-if="total>0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import fecha from 'fecha';
export default {
  data() {
    return {
      total: 5,
      pageSize: 10,
      currentPage: 1,
      Tabloading: true,
      hosUserData: [],
      multipleSelected: [] // 所选中的行数据
    };
  },
  async created() {
    await this.getOrgList();
  },
  mounted() {},
  methods: {
    dateFormater: function(row, column, cellValue) {   
      return cellValue
        ? fecha.format(new Date(cellValue.replace(/-/g,"/")), "YYYY-MM-DD HH:mm")
        : "";
    },
    getOrgList() {
      this.$store
        .dispatch({
          type: "getPlatformHospitalByPass"
        })
        .then(res => {
          this.Tabloading = false;
          if (res.data != null) {
            this.hosUserData = res.data;
            this.total = res.data.length;
          }

          console.log(res);
        });
    },
    indexMethod(index) {
      return index + 1;
    },
    // 查看详情
    toDetail(res) {
      console.log(res);
      this.$router.push({
        path: "/userManage/hosUserDetail",
        query: {
          orgzId: res.platformHospitalId
        }
      });
    },
    // 发送短信
    sendMsg(row) {
      console.log(row);
      let arr = [row];
      localStorage.removeItem("addresseeArr");
      localStorage.setItem("addresseeArr", JSON.stringify([row]));
      sessionStorage.setItem("Allinfo", JSON.stringify(arr));
      this.$router.push({
        path: "/userManage/sendMsg"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelected = val;
    },
    // START 表格分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrgList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrgList();
    },
    // END 表格分页
    // 系统发送短信管理
    toMsgManage() {
      this.$router.push({
        path: "/userManage/msgManage"
      });
    },
    // 批量发送短信
    batchSendMsg() {
      var self = this;
      if (self.multipleSelected.length > 0) {
        // console.log("批量发送已选", JSON.stringify(self.multipleSelected));
        sessionStorage.setItem(
          "Allinfo",
          JSON.stringify(self.multipleSelected)
        );
        localStorage.removeItem("addresseeArr");
        localStorage.setItem(
          "addresseeArr",
          JSON.stringify(self.multipleSelected)
        );
        self.$router.push({
          path: "/userManage/sendMsg"
        });
      } else {
        self.$alert("请先选择机构", "提示");
      }
    }
  }
};
</script>

<style lang="scss">
.hos-user-manage {
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
