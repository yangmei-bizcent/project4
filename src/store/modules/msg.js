import {MsgtemplateApi,EditMsgApi,getMsgListApi,deleteMsgApi,addMsgApi,sendMsgApi} from '../../service/msg'


const state = {
  msgtemplate:"",
  edimsg:'',
  msglist:'',
  deletemsg:"",
  addmsg:"",
  sendmsg:""
};

const getters = {
  msgtemplate:state=>state.msgtemplate,
  edimsg:state=>state.edimsg,
  msglist:state=>state.msglist,
  deletemsg:state=>state.deletemsg,
  addmsg:state=>state.addmsg,
  sendmsg:state=>state.sendmsg
};

const mutations = {
  MsgtemplateF(state,payload){
    return state.msgtemplate=payload.res.data
  },
  EditMsgF(state,payload){
    return state.edimsg=payload.res.data
  },
  GetMsgListF(state,payload){
    return state.msglist=payload.res.data
  },
  DeleteMsgF(state,payload){
    return state.deletemsg=payload.res.data
  },
  AddMsgF(state,payload){
    return state.addmsg=payload.res.data
  },
  sendMsgF(state,payload){
    return state.sendmsg=payload.res.data
  }
};

const actions ={
  // 获取发送短信模板
  MsgtemplateF({commit}, payload) {
    return new Promise((resolve, reject) => {
      MsgtemplateApi().then(d => {
        commit({type: 'MsgtemplateF', res: d});
        resolve(d);
      });
    })
  },
//编辑短信
EditMsgF({commit}, payload) {
    return new Promise((resolve, reject) => {
        EditMsgApi(payload.data).then(d => {
        commit({type: 'EditMsgF', res: d});
        resolve(d);
      }).catch(e => {
        reject(e);
      });
    })
  },
  //获取短信列表
  GetMsgListF({commit}, payload) {
    return new Promise((resolve, reject) => {
        getMsgListApi().then(d => {
        commit({type: 'GetMsgListF', res: d});
        resolve(d);
      });
    })
  },
  //删除短信
  DeleteMsgF({commit}, payload) {
    return new Promise((resolve, reject) => {
        deleteMsgApi(payload.platMessageSmsId).then(d => {
        commit({type: 'DeleteMsgF', res: d});
        resolve(d);
      });
    })
  },
  //添加短信
  AddMsgF({commit}, payload) {
    return new Promise((resolve, reject) => {
        addMsgApi(payload.tpmsPlatMessageSms).then(d => {
        commit({type: 'AddMsgF', res: d});
        resolve(d);
      });
    })
  },
  //发送短信
  sendMsgF({commit}, payload) {
    return new Promise((resolve, reject) => {
        sendMsgApi(payload.data).then(d => {
        commit({type: 'sendMsgF', res: d});
        resolve(d);
      });
    })
  },


}

export default {
  state,
  getters,
  actions,
  mutations
}


