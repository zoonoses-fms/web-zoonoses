<template>
  <div ref="container" class="flex-container">
    <div class="container-main">
      <div class="row">
        <div class="col">
          <b-navbar
            toggleable="lg"
            type="dark"
            variant="primary"
            class="d-flex justify-content-end"
          >
            <b-navbar-brand href="#">{{ title }}</b-navbar-brand>

            <b-collapse id="nav-collapse" is-nav>
              <!-- Right aligned nav items -->
              <client-only>
                <b-navbar-nav
                  v-if="$auth.loggedIn"
                  class="ml-auto justify-content-end"
                >
                  <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                      <em>{{ $auth.user.name }}</em>
                      <b-avatar size="sm"></b-avatar>
                    </template>
                    <NuxtLink
                      v-show="isAdmin"
                      to="/admin/user"
                      class="dropdown-item"
                    >
                      Usuários
                    </NuxtLink>
                    <NuxtLink
                      v-show="isAdmin"
                      to="/admin/team"
                      class="dropdown-item"
                    >
                      Turmas
                    </NuxtLink>
                    <NuxtLink
                      v-show="isAdmin"
                      to="/auth/profile"
                      class="dropdown-item"
                    >
                      Profile
                    </NuxtLink>
                    <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-navbar-nav>
              </client-only>
            </b-collapse>

            <NuxtLink
              v-show="!$auth.loggedIn"
              to="/auth/login"
              class="btn btn-warning"
            >
              <b-icon icon="arrow-return-right"></b-icon>
              Login
            </NuxtLink>
            <b-navbar-toggle
              v-show="$auth.loggedIn"
              target="nav-collapse"
            ></b-navbar-toggle>
          </b-navbar>
        </div>
      </div>
      <div class="p-2">
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import is from '@/mixins/is';
export default {
  name: 'NuxtTutorial',
  mixins: [is],
  data() {
    return {
      show: true,
      logo: require('@/assets/img/background.png'),
    };
  },
  computed: {
    title() {
      return this.$store.state.layout.title;
    },
  },
  mounted() {
  },
  destroy() {
    // window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  background-color: #f1f4f6;
}

.container-main {
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5 px;
  width: 100%;
}

</style>
