<template>
  <div class="page-container application-config has-table-page">
    <div class="page-title-wrap">
      <span class="page-title">应用配置</span>
      <hr>
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="应用名称">
          <el-input v-model="searchForm.applicationName" placeholder="请输入应用名称" class="application-name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.applicationType" clearable placeholder="请选择应用分类" class="application-type">
            <el-option
              v-for="(item, index) of typeItems"
              :key="index"
              :label="item.businessTypeName"
              :value="item.businessTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.isGrounding" clearable placeholder="发布状态" class="is-grounding">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" class="btn-2-letters">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button type="info" class="add-application-btn btn-4-letters" @click="addApplication">新建应用</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column label="图标">
        <template slot-scope="scope">
          <img :src="scope.row.headerImg" class="application-icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="applicationName" label="应用名称"></el-table-column>
      <el-table-column prop="applicationBusType" label="应用分类"></el-table-column>
      <el-table-column label="发布状态">
        <template slot-scope="scope">
          {{ scope.row.isGrounding === '0' ? '未发布' : '已发布' }}<span class="sign" :class="scope.row.isGrounding === '0' ? 'unpublished' : 'published'"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editAndPublish(scope.row)"><i class="el-icon-edit-outline"></i> 编辑与发布</el-button>
          <el-button
            type="text"
            v-if="scope.row.isGrounding === '0' ? true : false"
            @click="deleteApp(scope.row.applicationId)"><i class="el-icon-delete"></i> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, ->, prev, pager, next, jumper"
      :total="totalPage">      
    </el-pagination>
  </div>
</template>

<script>
import { axiosget, axiospost } from '@/service/config';
import pageTitle from '@/components/pageTitle';
const applicationget = url => axiosget(`application/manage/${url}`);
export default {
  data () {
    return {
      typeItems: [],//应用分类选项
      searchForm: {//搜索表单
        applicationName: '',
        applicationType: '',
        isGrounding: ''
      },
      applicationName: '',
      applicationType: '',
      isGrounding: '',
      tableData: [],//表格数据
      currentPage: 1,//当前页
      pageSize: 10,//一页显示数量
      totalPage: 0,//总页数
    }
  },
  created () {
    let currentPage = sessionStorage.getItem('page');
    let pageSize = sessionStorage.getItem('size');
    if (currentPage) {
      this.currentPage = Number(currentPage);
    }
    if (pageSize) {
      this.pageSize = Number(pageSize);
    }
    //获取应用分类选项列表
    applicationget(`businessTypeList`).then(res => {
      this.typeItems = res.data;
    }).catch(err => {
      console.log(err);
    });
    //获取表格数据
    this.getTableData();
  },
  methods: {
    //新增应用
    addApplication () {
      this.$router.push({ name: 'addApplication' });
    },
    //编辑与发布
    editAndPublish (data) {
      sessionStorage.setItem('applicationId', data.applicationId);
      this.$router.push({ name: 'editAndPublishAppConf' });
    },
    //点击搜索按钮
    search () {
      for (let param of Object.keys(this.searchForm)) {
        this[param] = this.searchForm[param];
      }
      this.getTableData();
    },
    //获取表格数据
    getTableData () {
      applicationget(`appManageSearchList?pageNo=${this.currentPage}&pageSize=${this.pageSize}&applicationName=${this.applicationName}&applicationBusType=${this.applicationType}&groundingStatus=${this.isGrounding}`)
        .then(res => {
          this.tableData = this.formatAppBusType(res.data.list);
          this.totalPage = res.data.total;
        }).catch(err => {
          console.log(err);
        });
    },
    //删除应用
    deleteApp (applicationId) {
      this.$confirm('确定要删除该应用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        applicationget(`delApp?applicationId=${applicationId}`).then(res => {
          if (res.data === '操作成功') {
            this.$message.success('删除成功');
            this.getTableData();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('删除失败');
        });
      }).catch(() => {});
    },
    //格式化应用分类
    formatAppBusType (res) {
      let result = [];
      for (let data of res) {
        let tempArray = [];
        for (let item of data.busTypes) {
          tempArray.push(item.businessTypeName);
        }
        data.applicationBusType = tempArray.join('，');
        result.push(data);
      }
      return result;
    },
    handleSizeChange(val) {
      sessionStorage.setItem('size', val);
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      sessionStorage.setItem('page', val);
      this.currentPage = val;
      this.getTableData();
    }
  },
  components: { pageTitle }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px 24px;
}
.page-title-wrap {
  background: rgba(42,63,84,0.04);
  padding: 18px 24px 16px;
  hr {
    margin: 17px 0 17px;
  }
  .application-name {
    width: 200px;
  }
  .application-type {
    width: 172px;
  }
  .is-grounding {
    width: 140px;
  }
}
.page-title {
  font-size: 18px;
  color: #425B77;
}
.search-form {
  display: inline;
}
.add-application-btn {
  margin: 20px 0;
}
.application-icon {
  width: 26px;
  height: 26px;
  display: block;
}
.sign {
  display: inline-block;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  vertical-align: middle;
  margin-left: 5px;
}
.unpublished {
  background: #DB524B;
}
.published {
  background: #58B957;
}
.page {
  margin: 20px 0 70px;
}
</style>

<style lang="scss">
@import './applicationManage';
.application-config {
  .page-title-wrap {
    .el-form-item__label {
      letter-spacing: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
