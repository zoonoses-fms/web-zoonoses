<template>
  <div v-click-outside="externalClick">
    <div class="form-group">
      <div class="">
        <div class="input-group mb-3">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="badge badge-pill badge-danger h-auto m-1 p-2"
          >
            <a class="inline-block" @click.prevent="onRemoveBadge(badge)">
              <b-icon-x-circle></b-icon-x-circle>
            </a>

            <template v-if="sortingProperty && indexProperty">
              <span
                >{{ badge[indexProperty] }}: {{ badge[sortingProperty] }}</span
              >
            </template>
            <template v-else>
              {{ badge }}
            </template>
          </div>

          <input
            v-model="search"
            type="text"
            name="search"
            class="form-control input-search ml-1"
            placeholder="Buscar..."
            @keyup.esc="deactivate()"
          />
        </div>
      </div>
    </div>
    <div class="">
      <div v-if="showList" class="card text-center">
        <div class="card-body p-0">
          <ul class="list-group">
            <li
              v-for="item in allItems"
              :key="item.id"
              class="list-group-item"
              @click="onSelectItem(item)"
            >
              <template v-if="sortingProperty && indexProperty">
                <span
                  >{{ item[indexProperty] }}: {{ item[sortingProperty] }}</span
                >
              </template>
              <template v-else>
                {{ item }}
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const sortBy = (key) => {
  return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};

export default {
  name: 'InputAutocompleteBadge',
  props: {
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    sortingProperty: {
      type: String,
      default: null,
    },
    indexProperty: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      search: '',
      showList: false,
      badges: this.value,
    };
  },
  computed: {
    allItems() {
      const items = [...this.options];
      if (!this.sortingProperty) return items.sort();
      return items.sort(sortBy(this.sortingProperty));
    },
    filteredAllItems() {
      if (this.search) {
        const filteredItems = this.allItems.filter((i) => {
          if (this.sortingProperty) {
            return i[this.sortingProperty]
              .toLowerCase()
              .includes(this.search.toLowerCase());
          } else {
            return i.toLowerCase().includes(this.search.toLowerCase());
          }
        });
        return filteredItems;
      } else {
        return this.allItems;
      }
    },
  },
  watch: {
    search(val) {
      if (val != null) {
        this.$emit('change', val);
      }
    },
    allItems() {
      if (this.allItems.length > 0) {
        this.activate();
      }
    },
  },
  methods: {
    externalClick(event) {
      this.deactivate();
    },
    onSelectItem(item) {
      const checkItem = this.badges.find(
        (selectedItem) => selectedItem.id === item.id
      );
      if (checkItem === undefined) {
        this.badges.push(item);
      } else {
        this.$toast.error(`Item já está na lista!`);
        return false;
      }

      this.$emit('input', this.badges);

      const indexOfItem = this.allItems.findIndex((i) => {
        return i.id === item.id;
      });
      this.allItems.splice(indexOfItem, 1);
      this.search = null;
      this.showList = false;
    },
    onRemoveBadge(item) {
      this.allItems.push(item);
      this.sortingProperty
        ? this.allItems.sort(sortBy(this.sortingProperty))
        : this.allItems.sort();

      const indexOfItem = this.badges.findIndex((i) => {
        return i.id === item.id;
      });
      this.badges.splice(indexOfItem, 1);
      this.$emit('input', this.badges);
    },
    activate() {
      this.showList = true;
    },
    deactivate() {
      this.showList = false;
    },
  },
};
</script>
<style lang="postcss" scoped>
.form-control {
  border-top: 0 none;
  border-right: 0 none;
  width: 100px;
}

.badge {
  font-size: 0.75rem;
  white-space: unset;
}

.search {
  height: auto;
  @apply w-full pr-16 input input-primary input-bordered flex flex-wrap content-center py-2 h-auto;
}

.input-search {
  outline: none;
  background-color: transparent;
}

.input-search:focus {
  outline: none;
  background-color: transparent;
}
</style>
