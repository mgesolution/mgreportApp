<template>
  <q-page class="flex justify-center">
    <q-card class="my-card">
      <q-card-section class="text-center">
        <div class="text-h6">
          {{pageTitle}}
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="saveData" class="q-gutter-md">
          <q-input
            v-model="field.Nama"
            label="Nama *"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Nama tidak boleh kosong'
            ]"
          />
          <q-input
            v-model="field.Host"
            label="Host *"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Host tidak boleh kosong'
            ]"
          />
          <q-input
            v-model="field.User"
            label="User *"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'User tidak boleh kosong'
            ]"
          />
          <q-input
            v-model="field.Password"
            label="Password *"
            type="password"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Password tidak boleh kosong'
            ]"
          />
          <q-input
            v-model="field.Port"
            label="Port *"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Port tidak boleh kosong'
            ]"
          />
          <q-input
            v-model="field.Database"
            label="Database *"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'Database tidak boleh kosong'
            ]"
          />
          <div class="text-right q-mt-lg">
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<style lang="sass" scoped>
.my-card
  width: 85%
</style>
<script src="./KoneksiInsert.js"></script>
