import { aixospatch, aixosput, axiosget, axiospost, axiosdel } from "./config";

const applicationpost = (_url, data) => axiospost(`application${_url}`, data);
const applicationput = (_url, data) => aixosput(`application${_url}`, data);
const applicationpatch = (_url, data) => aixospatch(`application${_url}`, data);
const applicationget = _url => axiosget(`application${_url}`);
const messageget = _url => axiosget(`message${_url}`);
const messagedel = _url => axiospost(`message${_url}`, '');


/**
 * 获取所有机构信息
 */
export const getAlllatformHospitalApi = () => applicationget(`/plat/audit/list`);
export const adminWatchPlatformHospitalApi = (data) => applicationpatch('/plat/adminWatchPlatformHospital', data);
export const getPlatformHospitalByPhIdApi = phid => applicationget(`/plat/getPlatformHospitalByPhId?phid=${phid}`);


/**
 * 网关短信配置
 */
export const getSmsListApi = (currentPageNo, pageSize) => messageget(`/auth/smsPlatGateway/list?currentPageNo=${currentPageNo}pageSize=${pageSize}`)
export const adminPatchPlatformHospitalApi = (data) => applicationpatch('/plat/adminPatchPlatformHospital', data);
export const searchPlatformHospitalByNameApi = key => applicationget(`/plat/searchPlatformHospitalByName?name=${key}`);
export const deleteOne = key => messagedel(`/auth/smsPlatGateway?smsGatewayId=${key}`)

/**
 * 获取通过认证的机构信息
 */
export const getPlatformHospitalByPassApi = () => applicationget(`/plat/getPlatformHospitalByPass`);
export const sendMsgFailInfoApi = (data) => applicationpost('/plat/sendMsgFailInfo', data);
export const sendMsgSuccInfoApi = (data) => applicationpost('/plat/sendMsgSuccInfo', data);