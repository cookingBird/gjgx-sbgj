import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    list: [],
  },
  mutations: {
    HISTORY_ADD(state, data) {
      if(!state.list.find(item => data.name === item.name)){
        state.list.push(data);
      } 
    },
    HISTORY_DEL(state,data){
      const index = state.list.findIndex((item) => item.path === data);
      state.list.splice(index, 1);
    }
  }
}