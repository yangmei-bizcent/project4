<template>
  <div class="page-container type-manage has-table-page">
    <page-title :hasBtn="false">分类管理</page-title>
    <el-button
      type="info"
      class="btn-4-letters add-type-btn"
      @click="addType">新建分类</el-button>

    <!-- 表格 -->
    <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" border stripe style="width: 100%">
      <el-table-column prop="sortBy" label="排序"></el-table-column>
      <el-table-column prop="businessTypeName" label="分类名"></el-table-column>
      <el-table-column label="分类图标">
        <template slot-scope="scope">
          <img :src="scope.row.businessTypeUrl" class="type-icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="createdon" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editType(scope.row)"><i class="el-icon-edit-outline"></i> 修改</el-button>
          <el-button
            type="text"
            @click="deleteType(scope.row.businessTypeId)"><i class="el-icon-delete"></i> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20]"
      :page-size="pageSize"
      layout="total, sizes, ->, prev, pager, next, jumper"
      :total="totalPage">      
    </el-pagination>

    <!-- 新增&修改弹窗 -->
    <el-dialog :title="dialogType === 1 ? '新增' : '修改'" :visible.sync="dialogVisible" width="437px">
      <el-form :model="typeForm" ref="typeForm" :rules="rules" label-width="80px">
        <el-form-item label="分类名" prop="businessTypeName">
          <el-input v-model="typeForm.businessTypeName" placeholder="4个汉字或8个字母以内"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="businessTypeUrl">
          <el-upload
            action=""
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="imgUrlRequest">
            <el-button size="small" type="default" class="upload-btn">上传图片</el-button>
            <span class="upload-tip" slot="tip">图标大小在500KB以内</span>
          </el-upload>
          <img
            class="upload-img"
            v-show="typeForm.businessTypeUrl"
            :src="typeForm.businessTypeUrl"/>
        </el-form-item>
        <el-form-item label="排序" prop="sortBy">
          <el-input v-model="typeForm.sortBy" placeholder="数字越大越靠前"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          class="btn-2-letters">取消</el-button>
        <el-button
          type="primary"
          @click="addOrEditType('typeForm', dialogType)"
          class="btn-2-letters">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { axiosget, axiospost } from '@/service/config';
import pageTitle from '@/components/pageTitle';
const applicationget = url => axiosget(`application/manage/${url}`);
const applicationpost = (url, data) => axiospost(`application/${url}`, data);
export default {
  data () {
    let lettersLength = (rule, value, callback) => {
      function getByteLength(str) {
        return str.replace(/[^\x00-\xff]/g,"aa").length;
      }
      if (getByteLength(value) > 8) {
        callback(new Error('不得超过4个汉字或8个字母'));
      } else {
        callback();
      }
    };
    return {
      tableData: [],//表格数据
      currentPage: 1,//当前页
      pageSize: 10,//一页显示数量
      totalPage: 0,//总页数
      dialogVisible: false,
      typeForm: {
        businessTypeName: '',
        businessTypeUrl: '',
        sortBy: ''
      },
      dialogType: 1,//弹窗类型 1：新增 2：修改
      rules: {
        businessTypeName: [
          { required: true, message: '请填写分类名', trigger: 'blur' },
          { validator: lettersLength, trigger: 'blur' }
        ],
        businessTypeUrl: [
          { required: true, message: '请上传分类图标' }
        ],
        sortBy: [
          { required: true, message: '请填写排序', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initList();
  },
  methods: {
    //初始化列表
    initList () {
      applicationget('businessTypeList').then(res => {
        this.tableData = res.data;
        this.totalPage = res.data.length;
      }).catch(err => {
        console.log(err);
      });
    },
    //点击新增按钮
    addType () {
      this.dialogType = 1;
      this.typeForm = {
        businessTypeName: '',
        businessTypeUrl: '',
        sortBy: ''
      };
      this.dialogVisible = true;
    },
    //点击修改按钮
    editType (data) {
      this.dialogType = 2;
      this.typeForm = Object.assign({}, data);
      this.dialogVisible = true;
    },
    //确认新增或修改
    addOrEditType (formName, dialogType) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (dialogType === 1) {
            applicationpost('manage/addBusinessType', this.typeForm).then(res => {
              if (typeof res.data === 'string') {
                this.dialogVisible = false;
                this.$message.success('新建成功');
                this.initList();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch(err => {
              console.log(err);
              this.dialogVisible = false;
              this.$message.error('新建失败');
            });
          } else if (dialogType === 2) {
            applicationpost('manage/editBusinessType', this.typeForm).then(res => {
              if (typeof res.data === 'string') {
                this.dialogVisible = false;
                this.$message.success('修改成功');
                this.initList();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch(err => {
              console.log(err);
              this.dialogVisible = false;
              this.$message.error('修改失败');
            });
          }
        } else {
          return false;
        }
      });
    },
    //点击删除按钮
    deleteType (businessTypeId) {
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        applicationget(`delBusinessType?businessTypeId=${businessTypeId}`).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功');
            this.initList();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('删除失败');
        });
      }).catch(() => {});
    },
    //图片上传
    imgUrlRequest (e) {
      const file = new FormData();
      file.append('file', e.file);
      applicationpost('plat/auth/images/upload', file).then(res => {
        this.typeForm.businessTypeUrl = res.data.url;
        this.$refs['typeForm'].clearValidate();
        this.$message.success('图片上传成功');
      }).catch(err => {
        console.log(err);
        this.$message.error('图片上传失败');
      });
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isPng = file.type === 'image/png';
      const isLt1M = file.size / 1024 < 500;
      if (!isLt1M) {
        this.$message.error('上传的图片大小不能超过500KB');
      }
      if (!isJPG && !isPng) {
        this.$message.error('上传的图片格式只能为jpg或png');
      }
      return (isJPG || isPng) && isLt1M;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  },
  watch: {
    dialogVisible () {
      if (this.dialogVisible === false) {
        this.$refs['typeForm'].clearValidate();
      }
    }
  },
  components: { pageTitle }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px 24px;
}
.add-type-btn {
  margin-bottom: 20px;
}
.type-icon {
  width: 26px;
  height: 26px;
  display: block;
}
.upload-btn {
  padding: 7px;
}
.upload-tip {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.2px;
  margin-left: 18px;
}
.upload-img {
  width: 70px;
  height: 70px;
  display: block;
  margin-top: 5px;
}
.page {
  margin: 20px 0 50px;
}
</style>

<style lang="scss">
@import './applicationManage';
.type-manage {
  .el-dialog__header {
    padding: 17px 20px 16px 26px;
    .el-dialog__title {
      color: #425B77;
    }
  }
  .el-dialog__body {
    padding: 17px 80px 0 20px;
    border-top: 1px solid #CCC;
    border-bottom: 1px solid #CCC;
    .el-form .el-form-item__label:before {
      content: '';
      margin-right: 0;
    }
  }
  .el-dialog__footer {
    padding: 14px 13px 14px 20px;
  }
}
</style>
