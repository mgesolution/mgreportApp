<template>
  <q-input
    borderless
    filled=""
    dense
    @click.self="showTimePicker()"
    debounce="300"
    readonly
    v-model="timeValue"
    :placeholder="label"
    mask="##:##:##"
    ><template v-slot:append>
      <q-icon v-if="!timeValue" name="search" />
      <q-icon
        v-else
        name="clear"
        @click.stop="clearTime()"
      />
      <q-popup-proxy
        ref="time"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-time
          v-model="timeValue"
          mask="HH:mm:ss"
          with-seconds
          format24h
        />
      </q-popup-proxy>
    </template>
  </q-input>
</template>

<script>
export default {
  name: 'time-picker',
  props: ['label'],
  data () {
    return {
      timeValue: '',
      isClearTime: true
    }
  },
  methods: {
    showDatePicker () {
      if (!this.isClearTime) this.$refs.time.show()
      this.isClearTime = false
    },
    clearTgl () {
      this.timeValue = ''
      this.isClearTime = true
    }
  },
  watch: {
    timeValue (val) {
      // eslint-disable-next-line no-undef
      this.$emit('change', val)
    }
  }
}
</script>
