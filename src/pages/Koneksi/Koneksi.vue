<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-right q-mb-md">
        <q-btn color="primary" icon="add" fab-mini="" :to="{name:'koneksi-insert-page'}" />
      </div>
      <q-table
        title="Project"
        :data="data"
        :columns="columns"
        row-key="ID"
        :pagination.sync="pagination"
        :loading="loading"
        :filter="filter"
        @request="loadData"
        binary-state-sort
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />

            <q-th v-for="col in props.cols" :key="'' + col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-gutter-xs">
                <q-btn no-caps="" size="md" dense="" color="red" icon="delete">
                  <q-popup-proxy :ref="`popUpDelete${props.key}`">
                    <q-banner class="bg-red text-white">
                      Apakah Anda Yakin?
                      <template v-slot:action>
                        <q-btn
                          flat
                          color="white"
                          label="Delete"
                          @click="deleteData(props.key)"
                        />
                      </template>
                    </q-banner>
                  </q-popup-proxy>
                </q-btn>
                <q-btn
                  no-caps=""
                  size="md"
                  dense=""
                  color="green"
                  icon="edit"
                  :to="{ name: 'koneksi-edit-page', params: { id: props.key } }"
                />
              </div>
            </q-td>

            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top>
          <div class="row full-width">
            <div class="col-6">
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter.Nama"
                placeholder="Nama"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script src="./Koneksi.js"></script>
