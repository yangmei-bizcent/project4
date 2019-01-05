import store from '@/store/index'
import {
  lazyload
} from '@/util'

const routes = [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录-管理后台-掌上医院开放平台'
    },
    component: lazyload('login')
  },
  {
    path: '/userManage',
    redirect: '/userManage/hosUserManage',
    component: lazyload('layout'),
    children: [
      {
        path: 'hosUserManage',
        name: 'hosUserManage',
        meta: {
          title: '医院用户管理-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/hosUserManage')
      },
       {
        path: 'hosUserDetail',
        name: 'hosUserDetail',
        meta: {
          title: '医院用户详情-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/hosUserDetail')
      },
      {
        path: 'sendMsg',
        name: 'sendMsg',
        meta: {
          title: '发送短信-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/sendMsg')
      }, {
        path: 'certifAudit',
        name: 'certifAudit',
        meta: {
          title: '认证审核-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/certifAudit')
      }, {
        path: 'certifAuditDetail',
        name: 'certifAuditDetail',
        meta: {
          title: '认证审核详情-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/certifAuditDetail')
      }
    ]
  }, 
  {
    path: '/baseConfig',
    redirect: '/msgMange/msgConfig',
    component: lazyload('layout'),
    children: [
      {
        path: 'msgConfig',
        name: 'msgConfig',
        meta: {
          title: '短信网关配置-管理后台-掌上医院开放平台'
        },
        component: lazyload('msgMange/msgConfig')
      },
      {
        path: 'baseHosUserManage',
        name: 'baseHosUserManage',
        meta: {
          title: '医院用户管理-管理后台-掌上医院开放平台'
        },
        component: lazyload('baseConfig/baseHosUserManage')
      },
      {
        path: 'msgManage',
        name: 'msgManage',
        meta: {
          title: '系统发送短信管理-管理后台-掌上医院开放平台'
        },
        component: lazyload('userManage/msgManage')
      }, 
     
      {
          path: 'editMsgConfig',
          name: 'editMsgConfig',
          meta: {
            title: '修改短信配置-管理后台-掌上医院开放平台'
          },
          component: lazyload('msgMange/editMsgConfig')
        },
     
    ]
  },
  {
    path: '/help',
    redirect: '/help/help',
    component: lazyload('layout'),
    children: [{
      path: 'help',
      name: 'help',
      meta: {
        title: '帮助中心'
      },
      component: lazyload('help/help')
    }]
  }, {
    path: '/applicationManage',
    redirect: '/applicationManage/typeManage',
    component: lazyload('layout'),
    children: [{
      path: 'typeManage',
      name: 'typeManage',
      meta: {
        title: '分类管理-管理后台-掌上医院开放平台'
      },
      component: lazyload('applicationManage/typeManage')
    }, {
      path: 'applicationConfig',
      name: 'applicationConfig',
      meta: {
        title: '应用配置-管理后台-掌上医院开放平台'
      },
      component: lazyload('applicationManage/applicationConfig')
    }, {
      path: 'applicationConfig/addApplication',
      name: 'addApplication',
      meta: {
        title: '新建应用-管理后台-掌上医院开放平台'
      },
      component: lazyload('applicationManage/addApplication')
    }, {
      path: 'applicationConfig/editAndPublishAppConf',
      name: 'editAndPublishAppConf',
      meta: {
        title: '编辑与发布应用配置-管理后台-掌上医院开放平台'
      },
      component: lazyload('applicationManage/editAndPublishAppConf')
    }]
  }, 

]

export {
  routes
}