<template>
  <div ref="container" class="flex-container">
    <transition name="fade">
      <div v-show="show" class="sidebar">
        <b-navbar
          toggleable="lg"
          type="dark"
          variant="primary"
          class="justify-content-between"
        >
          <b-avatar variant="light" :src="logo"></b-avatar>
          <b-navbar-brand>Zoonoses</b-navbar-brand>
          <b-button variant="outline-light" size="sm" @click="switchShow">
            X
          </b-button>
        </b-navbar>
        <ul class="list-group list-group-flush mt-2">
          <li class="list-group-item">
            <NuxtLink to="/" class="item">
              <b-icon icon="bookmark"></b-icon>
              Home
            </NuxtLink>
          </li>
          <li
            v-b-tooltip.hover
            class="list-group-item"
            title="Núcleo de Controle da Raiva, Leishmaniose e Outras Zoonoses"
          >
            <NuxtLink to="/ncrlo" class="item">
              <b-icon icon="clipboard-check"></b-icon>
              NCRLO
            </NuxtLink>
          </li>
          <li
            v-b-tooltip.hover
            class="list-group-item"
            title="Núcleo de Controle de Roedores e Vetores"
          >
            <NuxtLink to="/ncrv" class="item">
              <b-icon icon="clipboard-check"></b-icon>
              NCRV
            </NuxtLink>
          </li>
          <li
            v-b-tooltip.hover
            class="list-group-item"
            title="Núcleo de Correição"
          >
            <NuxtLink to="/nc" class="item">
              <b-icon icon="clipboard-check"></b-icon>
              NC
            </NuxtLink>
          </li>
          <li
            v-b-tooltip.hover
            class="list-group-item"
            title="Mapas"
          >
            <NuxtLink to="/maps" class="item">
              <b-icon icon="map"></b-icon>
              Mapas
            </NuxtLink>
          </li>
        </ul>
      </div>
    </transition>
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
              <b-navbar-nav
                v-show="$auth.loggedIn"
                class="ml-auto justify-content-end"
              >
                <b-nav-item-dropdown right>
                  <!-- Using 'button-content' slot -->
                  <template #button-content>
                    <em>Usuário</em>
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
            <button
              v-show="!show"
              type="button"
              class="btn btn-primary"
              @click="switchShow"
            >
              <b-icon icon="layout-text-sidebar"></b-icon>
            </button>
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
    this.checkSizeWindow();
  },
  destroy() {
    // window.removeEventListener('resize', this.onResize)
  },
  methods: {
    switchShow() {
      this.show = !this.show;
    },
    checkSizeWindow(count = 10) {
      this.$nextTick(() => {
        if (window !== undefined) {
          const width = window.document.documentElement.clientWidth;
          this.show = !(width <= 991.98);
          window.addEventListener('resize', this.onResize);
        } else if (count > 0) {
          this.checkSizeWindow(count - 1);
        }
      });
    },
    onResize(windowResize) {
      const targetElement = windowResize.target || windowResize.srcElement;

      if (targetElement !== undefined) {
        const width = targetElement.document.documentElement.clientWidth;
        this.show = !(width <= 991.98);
      }
    },
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

.sidebar {
  width: 280px;
  height: 99vh;
  padding: 0;
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: #fff;
  box-shadow: 7px 0 60px rgba(0, 0, 0, 0.1);

  .navbar {
    min-height: 58px;
  }

  .item {
    display: block;
    width: 100%;
    height: 42px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 10px;
    color: #212529;
    text-decoration: none;
  }

  .item.nuxt-link-exact-active {
    background-color: rgba(229, 146, 56, 1);
    color: #fff;
    border-color: rgba(229, 146, 56, 0.1);
  }

  .item.nuxt-link-exact-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(229, 146, 56, 1);
    height: 100%;
    width: 10px;
    border-radius: 0 16px 16px 0;
  }
}

@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    z-index: 9999;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>
