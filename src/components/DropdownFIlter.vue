<template>
  <q-select
    v-model="selectedData"
    use-input
    hide-selected
    input-debounce="0"
    :label="label"
    :options="filteredData"
    @filter="filterFunc"
    style="width: 250px"
    behavior="menu"
    fill-input
    map-options
    filled=""
    class="q-pl-md"
    dense=""
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Tidak ada data
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-icon
        name="close"
        @click.prevent="selectedData = { label: '', value: '' }"
        class="cursor-pointer"
      />
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'dropdown-filter',
  props: ['renderData', 'selectName', 'selectValue', 'label'],
  data () {
    return {
      project: [],
      filteredData: [],
      selectedData: ''
    }
  },
  methods: {
    filterFunc (val, update) {
      if (val === '') {
        update(() => {
          this.filteredData = this.project
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredData = this.project.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    dataToSelect (data, keyID, keyName) {
      const select = []

      data.forEach(element => {
        select.push({ label: element[keyName], value: element[keyID] })
      })
      return select
    },
    initSelect () {
      const select = this.dataToSelect(
        this.renderData,
        this.selectValue,
        this.selectName
      )
      this.project = select
      this.filteredData = select
    }
  },
  watch: {
    selectedData (val) {
      // eslint-disable-next-line no-undef
      this.$emit('change', val)
    },
    renderData () {
      this.initSelect()
    }
  },
  mounted () {
    this.initSelect()
  }
}
</script>
