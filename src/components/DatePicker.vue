<template>
  <q-input
    borderless
    dense
    filled=""
    @click.self="showDatePicker()"
    debounce="300"
    readonly
    v-model="dateValue"
    :placeholder="label"
    mask="####-##-##"
    ><template v-slot:append>
      <q-icon v-if="!dateValue" name="search" />
      <q-icon
        v-else
        name="clear"
        @click.stop="clearTgl()"
      />
      <q-popup-proxy
        ref="date"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-model="dateValue"
          mask="YYYY-MM-DD"
          @input="() => $refs.date.hide()"
        />
      </q-popup-proxy>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'date-picker',
  props: ['label'],
  data () {
    return {
      dateValue: '',
      isClearDate: true
    }
  },
  methods: {
    showDatePicker () {
      if (!this.isClearDate) this.$refs.date.show()
      this.isClearDate = false
    },
    clearTgl () {
      this.dateValue = ''
      this.isClearDate = true
    }
  },
  watch: {
    dateValue (val) {
      // eslint-disable-next-line no-undef
      this.$emit('change', val)
    }

  }
}
</script>
