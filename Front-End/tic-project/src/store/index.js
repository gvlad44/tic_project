import { store } from "quasar/wrappers";
import { createStore } from "vuex";

export default store(function () {
  const Store = createStore({
    state: {
      jwt: "",
    },

    getters: {
      getJWT(state) {
        return state.jwt;
      },
    },

    mutations: {
      setJWT(state, newJWT) {
        state.jwt = newJWT;
      },

      logOut(state) {
        state.jwt = "";
      },
    },

    strict: process.env.DEBUGGING,
  });

  return Store;
});
