/* eslint-disable @typescript-eslint/no-this-alias */
import Vue from 'vue'
export default {
  mixins: [Vue.prototype.$mixinStore],
  data () {
    return {
      filter: { Nama: '' },
      initfilter: { Nama: '' },
      loading: false,
      pagination: {
        sortBy: 'ID',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      initPagination: {
        sortBy: 'ID',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {
          name: 'Nama',
          required: true,
          label: 'Nama',
          align: 'left',
          field: row => row.Nama,
          format: val => `${val || '-'}`,
          sortable: true
        },
        {
          name: 'Host',
          align: 'center',
          label: 'Host',
          field: row => row.Host,
          format: val => `${val || '-'}`,
          sortable: true
        },
        {
          name: 'User',
          align: 'center',
          label: 'User',
          field: row => row.User,
          format: val => `${val || '-'}`,
          sortable: true
        },
        {
          name: 'Port',
          align: 'center',
          label: 'Port',
          field: row => row.Port,
          format: val => `${val || '-'}`,
          sortable: true
        },
        {
          name: 'Database',
          align: 'center',
          label: 'Database',
          field: row => row.Database,
          format: val => `${val || '-'}`,
          sortable: true
        }
      ],
      data: []
    }
  },
  mounted () {
    this.setBarTitle('Koneksi')
    this.loadData({
      pagination: this.pagination,
      filter: this.initfilter
    })
  },
  methods: {
    async deleteData (param) {
      const _this = this
      for (const key in _this.$refs) {
        const element = _this.$refs[key]
        element.hide()
      }
      const data = await this.post({
        url: `${_this.baseURL}deleteKoneksi`,
        data: {
          ID: param
        }
      })

      if (data.info === 'success') {
        this.pagination = this.initPagination
        this.filter = this.initfilter
        this.loadData({
          pagination: this.pagination,
          filter: this.initfilter
        })
      } else {
        this.showNotif()
      }
    },
    async loadData (props) {
      // this.resetData();
      this.loading = true
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      const _this = this
      const data = await this.post({
        url: `${_this.baseURL}getKoneksi`,
        data: {
          token: this.token,
          sortBy: sortBy,
          sortType: descending ? 'DESC' : 'ASC',
          pageNow: page,
          limit: rowsPerPage,
          filter: {
            ID: '',
            Nama: filter.Nama
          }
        },
        loading: false
      })
      if (data.info === 'success') {
        this.pagination.rowsNumber = data.countData
        this.data.splice(0, this.data.length, ...data.data)
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending
        this.loading = false
      } else {
        this.showNotif()
      }
    }
  }
}
