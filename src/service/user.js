import {aixospatch, aixosput, axiosget, axiospost} from "./config";

const userpost = (_url, data) => axiospost(`user${_url}`, data);
const userput = (_url, data) => aixosput(`user${_url}`, data);
const userpatch = (_url, data) => aixospatch(`user${_url}`, data);
const userget = _url => axiosget(`user${_url}`);

/**
 * 用户登陆
 * @param data
 */
export const authSignInApi = (data) => userpost('/release/sign_in', data);

/**
 * 获取特殊短信通知
 * @param {*} smsId 短信配置id(1: 用户注册短信发送; 2: 提交机构审核短信发送)
 */
export const SMSConfigListApi = () => userget('/sms/config_list');

/**
 * 编辑特殊短信通知
 * @param {*} data 
 */
export const SMSConfigUpdateApi = (data) => userpost('/sms/config_update', data);

