<template>
  <header class="page-title marginbottom20">
    <span>
      <slot></slot>
    </span>
    <el-button
      class="page-title-btn"
      v-if="hasBtn"
      @click="$emit('click', $event)"
      :type="options.btnType">
      <i v-if="options.hasIcon" class="btn-icon"></i>
      {{ options.btnText }}
    </el-button>
  </header>
</template>

<script>
export default {
  props: {
    /**
     * @btnType 按钮类型
     * @btnText 按钮内文字
     * @hasIcon 按钮内是否有图标
     */
    options: Object,
    //是否有按钮
    hasBtn: Boolean
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  border-bottom: 1px #E6E6E6 solid;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #425B77;
  letter-spacing: 0.2px;
  span {
    display: inline-flex;
    line-height: 44px;
  }
}
.page-title-btn {
  float: right;
  padding: 9px 12px;
}
.btn-icon {
  width: 12px;
  height: 10px;
  background: url('~@/assets/img/back.png') center no-repeat;
}
</style>
