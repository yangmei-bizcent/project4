import {aixospatch, aixosput, axiosget, axiospost} from "./config";

const msgpost = (_url, data) => axiospost(`message${_url}`, data);
const msgrput = (_url, data) => aixosput(`message${_url}`, data);
const msgpatch = (_url, data) => aixospatch(`message${_url}`, data);
const msgget = _url => axiosget(`message${_url}`);
//发送短信
export const MsgtemplateApi = () => msgget('/auth/plat/template/list?platMessageType=sys_auth');
export const EditMsgApi = (data) => msgrput('/auth/plat/template/edit',data);
export const getMsgListApi = () => msgget('/auth/plat/sms/list?platMessageType=user_sys');
export const deleteMsgApi = (platMessageSmsId) => msgrput(`/auth/plat/sms/delete?platMessageSmsId=${platMessageSmsId}`);
export const addMsgApi = (tpmsPlatMessageSms) => msgpost(`/auth/plat/sms/add`,tpmsPlatMessageSms);
export const sendMsgApi = (data) => msgrput(`/auth/plat/sms/message`,data);