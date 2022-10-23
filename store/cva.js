export const state = () => ({
  worker: null,
});

export const mutations = {
  SET_WORKER(state, worker) {
    state.worker = worker;
  },
};

export const getters = {
  GET_WORKER(state) {
    return state.worker;
  },
};
