/* eslint-disable @typescript-eslint/no-this-alias */
import Vue from 'vue'
import { debounce } from 'quasar'
export default {
  mixins: [Vue.prototype.$mixinStore],
  components: {
    dropdownFilter: () => import('components/DropdownFilter'),
    datePicker: () => import('components/DatePicker'),
    timePicker: () => import('components/TimePicker')

  },
  data () {
    return {
      koneksi: [],
      selectedKoneksi: '',
      query: '',
      columns: [],
      data: [],
      dataToShow: [],
      filters: [],
      dataType: [
        { ID: 1, Nama: 'Text/Contain' },
        { ID: 2, Nama: 'Datetime/Equal' },
        { ID: 3, Nama: 'Dates/Equal' },
        { ID: 4, Nama: 'Time/Equal' }
      ],
      datetimeTab: 'Date',
      isClearDate: {},
      isClearTime: {},
      isClearDatetime: {},
      visibleFilters: []
    }
  },
  mounted () {
    this.setBarTitle('Generate Report')
    this.loadDataKoneksi()
  },
  watch: {
    filters: {
      handler: function () {
        debounce(this.filterdata(), 500)
      },
      deep: true
    },
    visibleFilters (val, old) {
      if (old.length > val.length) {
        const unique1 = val.filter((o) => old.indexOf(o) === -1)
        const unique2 = old.filter((o) => val.indexOf(o) === -1)
        const unique = unique1.concat(unique2)
        console.log(unique)
        if (unique.length > 0) {
          const index = this.filters.map(function (x) { return x.label }).indexOf(unique[0])
          this.filters[index].type = { label: '', value: '' }
        }
      }
    }
  },
  methods: {
    async loadDataKoneksi () {
      const _this = this
      const data = await this.post({
        url: `${_this.baseURL}getKoneksi`,
        data: {
        }
      })
      if (data.info === 'success') {
        this.koneksi = data.data
      } else {
        this.showNotif()
      }
    },
    async loadDataQuery () {
      const _this = this
      if (this.query && this.selectedKoneksi.value) {
        const data = await this.post({
          url: `${_this.baseURL}getDataFromDB`,
          data: {
            ID: this.selectedKoneksi.value,
            Query: this.query
          }
        })
        if (data.info === 'success') {
          if (data.data.length > 0) {
            this.data = data.data
            this.dataToShow = data.data
            this.dataToColumn(data.data)
          } else {
            this.showNotif('Tidak ada data yang dapat ditampilkan !')
          }
        } else {
          this.showNotif()
        }
      } else {
        this.showNotif('Pilih koneksi kemudian isi query nya !')
      }
    },
    dataToColumn (param) {
      if (param.length) {
        const data = param
        const colData = data[0]
        this.columns = []
        for (const key in colData) {
          this.columns.push({
            name: key,
            align: 'center',
            label: key,
            field: row => row[key],
            format: val => `${val || ''}`,
            sortable: true
          })
          this.filters.push({
            label: key,
            value: '',
            type: { label: '', value: '' }
          })
        }
      }
    },
    filterdata () {
      const self = this
      const filtered = self.data
      self.dataToShow = filtered.filter(record => {
        let index = 0
        let result = true
        self.filters.forEach(element => {
          // eslint-disable-next-line no-prototype-builtins
          if (element.type.value) {
            if (record[element.label] == null) {
              result = false
            } else {
              if (
                !this.compareData(
                  record[element.label],
                  self.filters[index].value
                )
              ) {
                result = false
              }
            }
          }
          index++
        })
        return result
      })
      // }, delay);
    },
    setTypeFilter (val, index, key) {
      this.filters[index].type = val
      this.filters[index].value = ''
      if (this.filters[index].type.label.includes('Dates')) {
        this.$set(this.isClearDate, key, false)
      }
      if (this.filters[index].type.label.includes('Time')) {
        this.$set(this.isClearTime, key, false)
      }
      if (this.filters[index].type.label.includes('Datetime')) {
        this.$set(this.isClearDatetime, key, false)
      }
    },
    showDatePicker (param, isClearDateKey) {
      if (!this.isClearDate[isClearDateKey]) this.$refs['' + param][0].show()
      this.isClearDate[isClearDateKey] = false
    },
    clearTgl (isClearDateKey, indexFilter) {
      this.filters[indexFilter].value = ''
      this.isClearDate[isClearDateKey] = true
    },
    showTimePicker (param, isClearTimeKey) {
      if (!this.isClearTime[isClearTimeKey]) this.$refs['' + param][0].show()
      this.isClearTime[isClearTimeKey] = false
    },
    clearTime (isClearTimeKey, indexFilter) {
      this.filters[indexFilter].value = ''
      this.isClearTime[isClearTimeKey] = true
    },
    showDatetimePicker (param, isClearDatetimeKey) {
      if (!this.isClearDatetime[isClearDatetimeKey]) {
        this.datetimeTab = 'Date'
        this.$refs['' + param][0].show()
      }
      this.isClearDatetime[isClearDatetimeKey] = false
    },
    clearDatetime (isClearDatetimeKey, indexFilter) {
      this.filters[indexFilter].value = ''
      this.isClearDatetime[isClearDatetimeKey] = true
    }
  }
}
