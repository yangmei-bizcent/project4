<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import '@/assets/css/global.scss'
  import '@/assets/css/common.scss'
  import '@/assets/css/layout.scss'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters({
        token: 'token',
      })
    },
    mounted() {
      console.log(this.token);
    },
  }

</script>

<style lang="scss">
  html,
  body {
    margin: 0px;
    font-size: 16px;
    user-select: none;
    background-color: #f0f3f5;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0px;
  }

  i {
    display: inline-block;
  }

  a {
    text-decoration: none;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  ul li {
    list-style: none;
  }

  .ts-wrapper .main-container {
    position: relative;
  }

  .ts-main-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    width: 100%;
    overflow: auto;
  }

</style>
