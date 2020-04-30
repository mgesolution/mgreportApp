/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-void */
/* eslint-disable prefer-const */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { date, format, exportFile, copyToClipboard } from 'quasar'

import XLSX from 'xlsx'
// destructuring to keep only what is needed
const { capitalize } = format
// import moment from "moment";
export default ({ Vue, store }) => {
  function getPropsModul (types, name) {
    let arr
    if (types !== 'state' && types !== '_mutations') {
      arr = Reflect.ownKeys(store[types]).map(function (x) {
        return x.replace(new RegExp(name + '/', 'g'), '')
      })
    } else if (types === '_mutations') {
      arr = Reflect.ownKeys(store[types]).filter(function (y) {
        return y.includes(name)
      })
      arr = arr.map(function (x) {
        return x.replace(new RegExp(name + '/', 'g'), '')
      })
    } else {
      arr = Reflect.ownKeys(store[types][name])
      arr.pop()
    }
    return arr
  }
  const mixin = {
    methods: {
      ...mapActions('GlobalData', getPropsModul('_actions', 'GlobalData')),
      ...mapActions('WebService', getPropsModul('_actions', 'WebService')),
      ...mapMutations('WebService', getPropsModul('_mutations', 'WebService')),
      ...mapMutations('GlobalData', getPropsModul('_mutations', 'GlobalData')),
      showNotif (param = 'Gagal Saat Request', color = 'red') {
        this.$q.notify({
          message: param,
          color: color,
          position: 'top'
        })
      },
      formatDateTime (param, format) {
        // return moment(param).format("DD-MM-YYYY");
        return date.formatDate(param, format)
      },
      formatCapital (param) {
        if (param) {
          return capitalize(param)
        }
        return ''
      },
      formatCurrency (param) {
        if (typeof param !== 'number') {
          param = parseFloat(param)
        }
        if (isNaN(param)) {
          return 0
        }
        param = param.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        return param
      },
      getFormatedData (val, type) {
        let formated
        switch (type) {
          case 'date':
            formated = this.formatDateTime(val, 'DD/MM/YYYY')
            break
          case 'datetime':
            formated = this.formatDateTime(val, 'DD/MM/YYYY HH:mm:ss')
            break
          case 'number':
            formated = this.formatCurrency(val)
            break
          default:
            formated = val
            break
        }
        return formated
      },
      dataToSelect (data, keyID, keyName) {
        const select = []

        data.forEach((element) => {
          select.push({ label: element[keyName], value: element[keyID] })
        })
        return select
      },
      filterArrayObject (data, key, filter) {
        const filteredArray = data.filter(function (itm) {
          return filter.indexOf(itm[key]) > -1
        })
        return filteredArray
      },
      differenceOf2Arrays (array1, array2) {
        const temp = []
        array1 = array1.toString().split(',').map(Number)
        array2 = array2.toString().split(',').map(Number)

        for (var i in array1) {
          if (!array2.includes(array1[i])) temp.push(array1[i])
        }
        for (i in array2) {
          if (!array1.includes(array2[i])) temp.push(array2[i])
        }
        return temp.sort((a, b) => a - b)
      },
      compareData (data1, data2, type = 'LIKE') {
        let cek = false
        if (typeof data1 === 'number') {
          data1 = data1.toString()
        }
        if (typeof data2 === 'number') {
          data2 = data2.toString()
        }
        switch (type) {
          case 'LIKE':
            cek = data1.toUpperCase().includes(data2.toUpperCase())
            break

          default:
            break
        }
        return cek
      },
      wrapCsvValue (val, formatFn) {
        console.log(val, formatFn)
        let formatted = formatFn !== void 0 ? formatFn(val) : val

        formatted =
          formatted === void 0 || formatted === null ? '' : String(formatted)

        // formatted = formatted.split('"').join("\t");
        /**
         * Excel accepts \n and \r in strings, but some other CSV parsers do not
         * Uncomment the next two lines to escape new lines
         */
        // .split('\n').join('\\n')
        // .split('\r').join('\\r')
        return `${formatted}`
      },
      exportExcelOld (columns, data, nmFile) {
        const _this = this
        // naive encoding to csv format
        const content = [
          columns.map((col) => _this.wrapCsvValue(col.label)).join('\t')
        ]
          .concat(
            data.map((row) =>
              columns
                .map((col) =>
                  _this.wrapCsvValue(
                    typeof col.field === 'function'
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field],
                    col.format
                  )
                )
                .join('\t')
            )
          )
          .join('\r\n')
        console.log(content)
        const status = exportFile(
          `${nmFile}-${_this.formatDateTime(Date.now(), 'DD-MM-YYYY')}`,
          content,
          'application/vnd.ms-excel'
        )

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      },
      exportExcel (columns, data, nmFile) {
        const _this = this
        const content = [columns.map((col) => _this.wrapCsvValue(col.label))]

        data.map((row) =>
          content.push(
            columns.map((col) =>
              _this.wrapCsvValue(
                typeof col.field === 'function'
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format
              )
            )
          )
        )
        const ws = XLSX.utils.aoa_to_sheet(content)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'SheetJS')
        XLSX.writeFile(wb, `${nmFile}-${_this.formatDateTime(Date.now(), 'DD-MM-YYYY')}.xlsx`)
      },
      copyText (text) {
        copyToClipboard(text)
          .then(() => {
            this.$q.notify({
              message: 'Data berhasil diCopy',
              color: 'primary'
            })
          })
          .catch(() => {
            this.$q.notify({
              message: 'Data gagal diCopy',
              color: 'red'
            })
          })
      }
    },

    computed: {
      ...mapState('GlobalData', getPropsModul('state', 'GlobalData')),
      ...mapGetters('GlobalData', getPropsModul('getters', 'GlobalData')),
      ...mapState('WebService', getPropsModul('state', 'WebService')),
      ...mapGetters('WebService', getPropsModul('getters', 'WebService')),
      getBgTheme () {
        return {
          'background-color': this.theme
        }
      }
    }
  }
  Vue.prototype.$mixinStore = mixin
}
