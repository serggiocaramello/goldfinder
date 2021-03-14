import Vue from "vue";
import Vuex from "vuex";
const axios = require("axios").default;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    myGold: 0,
    locationLevels: {
      Farm: "level1",
      Cave: "level1",
      House: "level1",
      Casino: "level1"
    },
    levels: ["level1", "level2", "level3", "level4", "level5"],
    lastPlay: null,
    locations: null
  },
  getters: {},
  mutations: {
    SET_LOCATIONS(state, locations) {
      state.locations = locations;
    },
    SET_GOLD(state, { minEarn, maxEarn, maxLost, name }) {
      // Si earnGold = true se gana dinero, en caso contrario se pierde.
      const earnsGold = Math.random() < 0.5;
      let gold;
      if (earnsGold) {
        gold = Math.floor(Math.random() * (maxEarn - minEarn)) + minEarn;
        state.myGold += gold;
      } else {
        gold = Math.floor(Math.random() * maxLost);
        state.myGold -= gold;
      }
      // Se guardan en el store los datos de la jugada actual
      state.lastPlay = { location: name, earnsGold, gold, time: new Date() };
    }
  },
  actions: {
    getLocations({ commit }) {
      axios.get("http://localhost:3000/locaciones").then(response => {
        commit("SET_LOCATIONS", response.data);
      });
    },
    getGold({ commit }, payload) {
      commit("SET_GOLD", payload);
    }
  },
  modules: {}
});
