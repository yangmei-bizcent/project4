import {
    getAlllatformHospitalApi,adminWatchPlatformHospitalApi,getPlatformHospitalByPhIdApi,
    getSmsListApi,
    adminPatchPlatformHospitalApi,searchPlatformHospitalByNameApi,getPlatformHospitalByPassApi,
    sendMsgFailInfoApi,sendMsgSuccInfoApi
  } from "../../service/application";
  
  const state = {
    platformHospitals:'' ,
    watchPlatformHospital:"",
    PlatformHospitalByPhId:{},
    smsList: ""
  };
  const getters = {
    platformHospitals:state =>{
        return status.platformHospitals;
    },
    watchPlatformHospital:state=>state.watchPlatformHospital,
    PlatformHospitalByPhId:state=>state.PlatformHospitalByPhId
   
  }
  const mutations = {
/**
  * 获取所有的机构信息
  * @param state
  * @param payload
  * @returns {Promise<any>}
  */
    getAlllatformHospital(state,payload){
        return state.platformHospitals=payload.res.data
    },
    getOrgPlatformHospital(state,payload){
      return state.watchPlatformHospital=payload.res.data
    },
    getPlatformHospitalByPhId(state,payload){
      return state.PlatformHospitalByPhId=payload.res.data
    },

    getSmsList(state, payload) {
      return state.smsList = payload.res.data
    }
  
  };
  const actions = {
/**
 * 获取所有的机构信息
 * @param commit
 * @param payload
 * @returns {Promise<any>}
 */
getAlllatformHospital({commit},payload){
    return new Promise((resolve,reject) => {
        getAlllatformHospitalApi().then(d =>{
            commit({type:'getAlllatformHospital',res:d});
            resolve(d);
        })
    })
},
getOrgPlatformHospital({commit},payload){
  return new Promise((resolve,reject)=>{
    adminWatchPlatformHospitalApi(payload.data).then(d=>{
      commit({type:'getOrgPlatformHospital',res:d});
      resolve(d);
    })
  })
},
getPlatformHospitalByPhId({commit},payload){
  return new Promise((resolve,reject)=>{
    getPlatformHospitalByPhIdApi(payload.phid).then(d=>{
      commit({type:'getPlatformHospitalByPhId',res:d});
      resolve(d);
    })
  })
    },

    getSmsList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getSmsListApi(payload.currentPageNo, payload.pageSize).then(d => {
          commit({ type: 'getSmsList', res: d })
          resolve(d)
        })
      })
    },
    
adminPatchPlatformHospital({commit},payload){
  return new Promise((resolve,reject)=>{
    adminPatchPlatformHospitalApi(payload.data).then(d=>{
      resolve(d);
    })
  })
},
searchPlatformHospitalByName({commit},payload){
  return new Promise((resolve,reject)=>{
    searchPlatformHospitalByNameApi(payload.key).then(d=>{
      resolve(d);
    })
  })
},
getPlatformHospitalByPass({commit},payload){
  return new Promise((resolve,reject)=>{
    getPlatformHospitalByPassApi().then(d=>{
      resolve(d);
    })
  })
},

sendMsgFailInfo({commit},payload){
  return new Promise((resolve,reject)=>{
    sendMsgFailInfoApi(payload.data).then(d=>{
      resolve(d);
    })
  })
},
sendMsgSuccInfo({commit},payload){
  return new Promise((resolve,reject)=>{
    sendMsgSuccInfoApi(payload.data).then(d=>{
      resolve(d);
    })
  })
},
  };
  export default {
    state,
    getters,
    actions,
    mutations
  }
  