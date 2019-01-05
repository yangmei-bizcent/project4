import {
  authSignInApi,
  SMSConfigListApi,
  SMSConfigUpdateApi
} from '../../service/user'


const state = {
  
};

const getters = {
  
};

const mutations = {
  
};

const actions ={
   /**
   * 用户登陆
   * @param commit
   * @param payload
   * @returns {Promise<any>}
   */
  login({commit}, payload) {
    let req = payload.req;
    return new Promise((resolve, reject) => {
      authSignInApi({"password": req.password, "phone": req.phone}).then(d => {
        this.dispatch({
          type: 'set_token',
          token: d.data.token
        });
        // this.dispatch({
        //   type: 'user_name',
        //   userName: d.data.realName
        // });
        resolve(d);
      });
    })
  },

  smsConfigList({commit}, payload) {
    return new Promise((resolve, reject) => {
      SMSConfigListApi().then(d => {
        commit({type: 'smsConfigList', res: d});
        resolve(d);
      });
    })
  },


  smsConfigUpdate({commit}, payload) {
    return new Promise((resolve, reject) => {
        SMSConfigUpdateApi(payload.res).then(d => {
        commit({type: 'smsConfigUpdate', res: d});
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


