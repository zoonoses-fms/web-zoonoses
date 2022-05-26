export const state = () => ({
  isResident: true,
  initial: null,
});

export const mutations = {
  setResident(state, payload) {
    state.isResident = payload.isResident;
  },
  setInitial(state, payload) {
    state.initial = payload.initial;
  },
};
