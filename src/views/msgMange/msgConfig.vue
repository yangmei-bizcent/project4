<template>
  <div class="page-container msg-config">
    <div class="detail-title">
      <span>短信网关配置</span>
      <el-button size="small" type="success" @click="$router.push({path: '/userManage/editMsgConfig',query:{type: 'add'}})">新增</el-button>
    </div>
    <el-table stripe border :data="tableData">
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="url"
        label="短信网关地址"
        width="300px">
      </el-table-column>
      <el-table-column
        prop="smsName"
        label="厂商名称">
      </el-table-column>
      <el-table-column
        prop="owner"
        label="拥有单位">
      </el-table-column>
       <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <section>
            <el-button type="text" @click="toAlter(scope.row)">
              <i class="el-icon-ts-pjgl"></i>修改
            </el-button>
            <el-button type="text" @click="deleteItem(scope.row.smsGatewayId)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </section>
        </template>
      </el-table-column>
    </el-table>

    <div class="block textAlignRight margintop30" v-if="total>0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPageNo" :page-sizes="[10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { axiosget } from "../../service/config.js"
import { deleteOne } from '../../service/application.js'
const messageget = (_url, data) => axiosget(`message${_url}`)
export default {
  data() {
    return {
      total: '',
      pageSize: 10,
      currentPageNo: 1,
      tableData: []
    };
  },

  created() {
    this.getSmsList(this.currentPageNo, this.pageSize)
  },

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getSmsList()
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPageNo = val
      this.getSmsList()
    },
    
    getSmsList(currentPageNo, pageSize) {
      messageget(`/auth/smsPlatGateway/list?currentPageNo=${currentPageNo}&pageSize=${pageSize}`).then(res => {
        this.tableData = res.data.list
        this.total = res.data.list.length
      })
    },

    toAlter(row) {
      this.$router.push({
        name: 'editMsgConfig',
        params: {
          body: row
        }
      })
    },

    deleteItem(smsGatewayId) {
      deleteOne(smsGatewayId).then((res) => {
        if(res.status == 200) {
          this.$message.success('删除成功')
          this.getSmsList(this.currentPageNo, this.pageSize)
        } else {
          this.$message.warning('删除失败')
        }
        
      }) 
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.msg-config {
  padding: 15px 24px;
  .detail-title {
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
      width: 69px;
      height: 34px;
      padding: 9px 10px;
      img {
        padding-right: 8px;
      }
    }
  }
}
</style>

<style lang="scss">
.msg-config {
  .detail-title {
    .el-button {
      width: 78px;
      height: 34px;
      background-color: #00ad91;
      color: #ffffff;
      border: 1px solid #00ad91;
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


