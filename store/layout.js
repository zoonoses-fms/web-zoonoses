export const state = () => ({
  title: 'NEV',
});

export const mutations = {
  CHANGE_NAV_TITLE(state, title) {
    state.title = title;
  },
};
