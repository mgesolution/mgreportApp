/* eslint-disable @typescript-eslint/no-this-alias */
import Vue from 'vue'
export default {
  mixins: [Vue.prototype.$mixinStore],
  name: 'PageIndex',
  props: {
    paramID: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isShowPage: false,
      pageTitle: '',
      field: {
        Nama: '',
        Host: '',
        User: '',
        Password: '',
        Port: '',
        Database: ''
      }

    }
  },
  computed: {
  },
  methods: {
    async saveData () {
      const _this = this
      const formData = new FormData()
      for (const key in this.field) {
        formData.append(key, this.field[key])
      }
      if (this.paramID) {
        formData.append('ID', this.paramID)
      }
      const post = await this.post({
        url: `${_this.baseURL}insertKoneksi`,
        formData: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (post.info === 'success') {
        this.$router.replace({ name: 'koneksi-page' })
      } else {
        this.showNotif()
      }
    },
    async loadData () {
      // this.resetData();
      const _this = this
      const data = await this.post({
        url: `${_this.baseURL}getKoneksi`,
        data: {
          filter: {
            ID: _this.paramID
          }
        },
        loading: false
      })
      if (data.info === 'success') {
        const { Nama, Host, User, Password, Port, Database } = data.data[0]
        console.log({ Nama, Host, User, Password, Port, Database })
        this.field.Nama = Nama
        this.field.Host = Host
        this.field.User = User
        this.field.Password = Password
        this.field.Port = Port
        this.field.Database = Database
      } else {
        this.showNotif()
      }
    }
  },
  mounted () {
    this.setBarTitle('Koneksi')
    if (this.paramID === 0) {
      this.pageTitle = 'Koneksi Baru'
    } else {
      this.pageTitle = 'Edit Koneksi'
      this.loadData()
    }
  }
}
