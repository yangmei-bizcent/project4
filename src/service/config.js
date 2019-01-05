import axios from "axios"
import Vuex from 'vuex'
import store from '../store/index.js'
import { Message } from 'element-ui'
import { exportRootUrl, exportLocalUrl } from "./baseuri";

// 添加请求拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    if (localStorage.getItem('token')) {
        config.headers.Authorization = `${localStorage.getItem('token')}`;
    }
    config.headers['X-SERVER-ID'] = '1111';
    return config
    }, function (error) {
    console.log('请求失败')
});
// 添加响应拦截器
axios.interceptors.response.use(function(config) {
    console.log('接收响应', config.data.mes)
    // if(config.status == 401 || config.data.mes == '用户未登录' || config.data.mes == '账号已退出登录') {
    //     var param = {};
    //     param.method = "loginOut";
    //     window.parent.postMessage(JSON.stringify(param), '*');
    // }
    if (config.hasOwnProperty('data') && config.data.hasOwnProperty('code')) {
        console.log(config.data.msg);
        Message(config.data.msg);
        // return;
    }
    return config
}, function(error) {
    // Do something with request error
    console.log('error',error)
    if(error.response){
        errorFn(error);
    }else{
        Message('请求服务器失败！') 
    }
    
    // return Promise.reject(error)
})

export const errorFn = error => {
    // console.log('错误：', error);
    switch (error.response.status) {
        case 400:
            Message('请求错误(400)')
            break
        case 403:
            Message('拒绝访问(403)')
            break
        case 404:
            Message('请求出错(404)')
            break
        case 405:
            Message('拒绝访问(405)')
            break
        case 408:
            Message('请求超时(408)')
            break
        case 500:
            Message('服务器错误(500)')
            break
        case 501:
            Message('服务未实现(501)')
            break
        case 502:
            Message('网络错误(502)')
            break
        case 503:
            Message('服务不可用(503)')
            break
        case 504:
            Message('网络超时(504)')
            break
        case 505:
            Message('HTTP版本不受支持(505)')
            break
        default:
            Message('连接出错')
            break;
    }
}

export const axiosConfig = {
    baseURL: exportRootUrl,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Accept": "application/json",
      //临时
      "X-SERVER-ID": "11111111",
      // "X-BUSINESS-ID": "b01a297-4d15-4068-bc8e-9e159b374238"
    },
    timeout: 10000
  };
  
  
  /**
   * http post 请求
   * @param _url
   * @param obj
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const axiospost = (_url, obj) => {
    return axios.post(_url, obj, axiosConfig)
  };
  
  /**
   * http post 请求
   * @param _url
   * @param obj
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const axiospost_params = (_url, obj, params) => {
    return axios.post(_url, obj, Object.assign(params,axiosConfig))
  };
  
  /**
   * https 全部数据修改
   * @param _url
   * @param obj
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const aixosput = (_url, obj) => {
    return axios.put(_url, obj, axiosConfig)
  };
  
  /**
   *  https 局部数据修改
   * @param _url
   * @param obj
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const aixospatch = (_url, obj) => {
    return axios.patch(_url, obj, axiosConfig)
  };
  
  /**
   * https 获取数据资源
   * @param _url
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const axiosget = (_url) => {
    return axios.get(_url, axiosConfig)
  };
  
  /**
   * https 数据删除
   * @param _url
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  export const axiosdel = (_url, obj) => {
    return axios.delete(_url, axiosConfig)
  };

// export const appointmentConfig = {
//     baseURL: URL_CONFIG.backendBaseUrl,
//     headers: {
//         "Authorization": !localStorage.getItem('token') ? store.state.token : localStorage.getItem('token'), 
//         //所有微服务接口加一个公共HEADER：X-BUSINESS-ID
//         "X-BUSINESS-ID": !localStorage.getItem('xBusinessId') ? store.state.xBusinessId : localStorage.getItem('xBusinessId'), 
//         "Content-Type": "application/json;charset=utf-8",
//         "Accept": "application/json",
//     },
//     timeout: 10000
// }
 

// export const appointmentpost = (_url, obj) => { return axios.post(_url, obj, appointmentConfig).catch(errorFn) }
// export const appointmentget = (_url) => { return axios.get(_url, appointmentConfig).catch(errorFn) }
  