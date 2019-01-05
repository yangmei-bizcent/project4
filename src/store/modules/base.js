import { 
  SET_TOKEN,
  SET_APPLYSTATE
} from '../mutation-types'

const state = {
    token: '',
    applyState: '0',
}
const getters={
    token: function(state){
        return state.token;
    },
    applyState: function(state){
        return state.applyState;
    },
}

const mutations={
    [SET_TOKEN](state, token) {
        localStorage.setItem('token', token.token);
        state.token = token.token;  
    },
    [SET_APPLYSTATE](state, applyState) {
        localStorage.setItem('applyState', applyState);
        state.applyState = applyState;  
    },
}
const actions={
    set_token({ commit },token) {
        commit(SET_TOKEN, token)
    },
    set_applyState({ commit },applyState) {
        commit(SET_APPLYSTATE, applyState)
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}