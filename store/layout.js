export const state = () => ({
  title: 'Zoonoses',
});

export const mutations = {
  CHANGE_NAV_TITLE(state, title) {
    state.title = title;
  },
};
