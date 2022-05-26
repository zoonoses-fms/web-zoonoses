export const state = () => ({
  isResident: true,
  initial: null,
  filter_cids: [],
  filter_chapters_cids: [],
  filter_groups_cids: [],
});

export const mutations = {
  setResident(state, payload) {
    state.isResident = payload.isResident;
  },
  setInitial(state, payload) {
    state.initial = payload.initial;
  },
  setCids(state, payload) {
    state.filter_cids = payload.filter_cids;
  },
  setGroupsCids(state, payload) {
    state.filter_groups_cids = payload.filter_groups_cids;
  },
  setChaptersCids(state, payload) {
    state.filter_chapters_cids = payload.filter_chapters_cids;
  },
};
