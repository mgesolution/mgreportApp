<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{ barTitle }}
        </q-toolbar-title>
        <q-btn @click="reload()" flat round dense icon="refresh" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <div class="column" style="height: 100vh">
        <div class="col">
          <q-list>
            <q-item-label header class="text-grey-8">Menu</q-item-label>
            <q-item clickable to="/dashboard">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>
            <template v-for="(data, index) in essentialLinks">
              <q-item
                clickable
                :to="data.to"
                @click="changeHeader(data.title)"
                :key="'menu' + index"
              >
                <q-item-section avatar>
                  <q-icon name="thumbs_up_down" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ data.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <div class="col full-height full-width">
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view :key="watcher" ref="contentPage" />
    </q-page-container>

    <q-dialog v-model="isDialog" persistent>
      <q-card style="min-width: 350px">
        <q-form
          @submit="changePassword()"
          style="width:95%"
          class="q-gutter-md"
        >
          <q-card-section>
            <div class="text-h6">Change Password</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              label="Input Password"
              v-model="password"
              autofocus
              type="password"
              :rules="[
                val => (val && val.length > 0) || 'Please input Password'
              ]"
            />
            <q-input
              dense
              label="Re-InputPassword"
              type="password"
              v-model="repassword"
              :rules="[
                val =>
                  val == password ||
                  'Confirm password must be same with password'
              ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Save" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'MainLayout',
  mixins: [Vue.prototype.$mixinStore],
  data () {
    return {
      watcher: 0,
      leftDrawerOpen: true,
      essentialLinks: [
        {
          title: 'Koneksi',
          icon: 'code',
          link: 'koneksi',
          to: { name: 'koneksi-page' }
        },
        {
          title: 'Generate Report',
          icon: 'code',
          link: 'generate-report',
          to: { name: 'generate-report-page' }
        }
      ],
      password: '',
      repassword: '',
      isDialog: false
    }
  },
  watch: {
    reloadPage (val) {
      this.watcher = val
    }
  },
  methods: {
    changeHeader (param) {
      this.setBarTitle(param)
    },
    reload () {
      this.doReloadPage()
    }
  }
}
</script>
