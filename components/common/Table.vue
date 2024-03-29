<template>
  <div>
    <div class="card-body">
      <div class="table-responsive">
        <input
          type="text"
          class="mb-1 pl-2 border rounded"
          placeholder="search"
          v-model="search_text"
          v-if="filter_type === 'search'"
          style="width: auto; height: 34px;"
        />
        <input
          type="text"
          class="mb-1 pl-2 border rounded"
          placeholder="filter"
          v-else-if="filter_type === 'filter'"
          v-model="filter_text"
          style="width: auto; height: 34px;"
        />
        <span style="float: right;" v-if="isPagination">
          <label for="per_page" style="margin-right: 5px">Per Page</label>
          <select id="per_page" v-model="per_page_value">
            <option
              v-for="(value, ind) in per_page_array"
              :key="ind"
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </span>
        <table class="table table-bordered text-center">
          <thead>
            <tr>
              <slot
                v-for="(column, index) in columns"
                :name="`header_${column.field}`"
                :header="column"
              >
                <th
                  :key="index"
                  :style="{
                    cursor:
                      !column.hasOwnProperty('sortable') || column.sortable
                        ? 'pointer'
                        : '',
                  }"
                  @click="
                    !column.hasOwnProperty('sortable') || column.sortable
                      ? sort(column.field)
                      : null
                  "
                >
                  {{ column.label }}
                  <span
                    v-if="!column.hasOwnProperty('sortable') || column.sortable"
                  >
                    <span v-if="sortKey == '' || sortKey !== column.field">
                      <i class="fas fa-sort"></i>
                    </span>
                    <span v-else>
                      <i class="fas fa-sort-down" v-if="sortOrder == 1"></i>
                      <i class="fas fa-sort-up" v-else></i>
                    </span>
                  </span>
                </th>
              </slot>
              <slot name="header_action" v-if="isAction">
                <th>Action</th>
              </slot>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entity, index) in filtered_entities"
              :key="`entity.${index}`"
            >
              <slot
                v-for="(column, ind) in columns"
                :name="`column_${column.field}`"
                :entity="entity"
                :index="index"
              >
                <td :key="`column.${ind}`">
                  {{ getEntityValue(entity, column.field) }}
                </td>
              </slot>
              <slot name="column_action" :entity="entity" v-if="isAction">
                <td>
                  <a class="mr-2" href="javascript:" @click="onEdit(entity)"
                    ><i class="fas fa-edit"></i
                  ></a>

                  <a
                    style="color: #dc3545"
                    href="javascript:"
                    @click="onDelete(entity)"
                    ><i class="fas fa-trash"></i
                  ></a>
                </td>
              </slot>
            </tr>
            <tr v-if="filtered_entities.length == 0">
              <td :colspan="isAction ? columns.length + 1 : columns.length">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="card-footer clearfix"
      v-if="
        isPagination &&
        !_isEmpty(entities) &&
        entities.hasOwnProperty('meta') &&
        !_isEmpty(entities.meta) &&
        entities.meta.hasOwnProperty('links') &&
        !_isEmpty(entities.meta.links)
      "
    >
      <ul class="pagination pagination-sm m-0 float-right">
        <li
          class="page-item"
          v-for="(link, sl) in entities.meta.links"
          :key="sl"
          :class="[
            link.active ? 'active' : '',
            link.url === null ? 'disabled' : '',
          ]"
        >
          <a
            @click="getData({ url: link.url })"
            class="page-link"
            href="javascript:"
            v-html="link.label"
          ></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  columns: {
    type: Array,
    required: false,
    default: [],
  },
  entities: {
    type: Object,
    required: false,
    default: {},
  },
  isAction: {
    type: Boolean,
    required: false,
    default: true,
  },
  isPagination: {
    type: Boolean,
    required: false,
    default: true,
  },
  filter_type: {
    type: String,
    required: false,
    default: "search",
  },
  per_page_array: {
    type: Array,
    required: false,
    default: [10, 50, 100, 500, 1000],
  },
  per_page: {
    type: Number,
    required: false,
    default: 10,
  },
});

const sortKey = ref("");
const sortOrder = ref(-1);
const filter_text = ref("");
const search_text = ref("");
const per_page_value = ref(props.per_page);

watch(
  search_text,
  _debounce((new_value, old_value) => {
    getData();
  }, 500)
);

watch(
  per_page_value,
  _debounce((new_value, old_value) => {
    getData();
  }, 500)
);

const getEntityValue = (entity, field) => {
  const fields = field.split(".");
  
  for (let i = 0; i < fields.length; i++) {
    if (entity && entity.hasOwnProperty(fields[i])) {
      entity = entity[fields[i]];
    } else {
      // If any part of the path is missing or the property is undefined, return a default value (e.g., null)
      return null;
    }
  }
  
  return entity;
};


const emit = defineEmits(["onEdit", "onDelete", "getData"]);

const getData = (customParams = { url: null, filter: {} }) => {
  if (props.isPagination) {
    // Ensure that the 'filter' property exists in customParams
    customParams.filter = customParams.filter || {};

    // Include search_text in the filter if it's not empty
    if (search_text.value.trim() !== "") {
      customParams.filter.search = search_text.value.trim();
    }

    // Set the number of rows per page
    customParams.filter.rows = per_page_value.value;

    // Emit the 'getData' event with the updated customParams
    emit("getData", customParams);
  } else {
    // Emit the 'getData' event with the original customParams
    emit("getData", customParams);
  }
};


const onEdit = (entity) => {
  emit("onEdit", entity);
};

const onDelete = (entity) => {
  emit("onDelete", entity);
};

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1; // Toggle sort order
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
};

const filtered_entities = computed(() => {
  let sorted = [];

  // Check props.entities

  // if (!_isEmpty(props.entities)) {
  //   if(props.entities.hasOwnProperty("data")){
  //     if(!_isEmpty(props.entities.data)){
  //       sorted = [...props.entities.data];
  //     }
  //   }else{
  //     sorted = [...props.entities];
  //   }
  // }

  if (!_isEmpty(props.entities)) {
    sorted = props.entities.hasOwnProperty('data') ? [...props.entities.data] : [...props.entities];
  }

  // Sort the 'sorted' array based on 'sortKey' and 'sortOrder'
  sorted.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) {
      return -1 * sortOrder.value;
    } else if (a[sortKey.value] > b[sortKey.value]) {
      return 1 * sortOrder.value;
    }
    return 0;
  });

  if (props.filter_type === "filter" && filter_text.value != "") {
    // Filter the 'sorted' array based on filter conditions
    return sorted.filter((entity) => {
      let return_value = false;

      props.columns.forEach((column) => {
        if (!column.hasOwnProperty("filterable") || column.filterable) {
          let fields = column.field.split(".");
          if (entity.hasOwnProperty(fields[0])) {
            let check_entity = entity[fields[0]];
            for (var i = 1; i < fields.length; i++) {
              if (check_entity && check_entity.hasOwnProperty(fields[i])) {
                check_entity = check_entity[fields[i]];
              }
            }

            if (
              check_entity &&
              check_entity
                .toString()
                .toLowerCase()
                .trim()
                .includes(filter_text.value.toLowerCase().trim())
            ) {
              return_value = true;
            }
          }
        }
      });

      return return_value;
    });
  } else {
    return sorted;
  }
});

</script>

<style scoped>
</style>