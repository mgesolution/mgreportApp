<template>
  <q-page padding>
    <div class="q-pa-md row">
      <div class="col-12 row justify-center">
        <dropdown-filter
          :render-data="koneksi"
          label="Pilih Koneksi"
          @change="val => (selectedKoneksi = val)"
          select-name="Nama"
          select-value="ID"
        ></dropdown-filter>
      </div>
      <div class="col-12 row justify-center">
        <q-input
          class="full-width"
          v-model="query"
          type="textarea"
          filled=""
          label="Query"
        />
      </div>
      <div class="col-12">
        <q-table :data="dataToShow" :columns="columns" row-key="ID">
          <template v-slot:top>
            <q-expansion-item
              expand-separator
              icon="search"
              label="Filters"
              class="full-width"
            >
              <div class="row">
                <q-select
                  v-model="visibleFilters"
                  multiple
                  borderless
                  filled=""
                  dense
                  options-dense
                  emit-value
                  map-options
                  label="Visible Filters"
                  :options="columns"
                  option-value="name"
                  style="min-width: 100px; width: 100vw;"
                />
              </div>
              <div class="row full-width">
                <template v-for="(data, index) in filters">
                  <div
                    class="col-12"
                    v-if="visibleFilters.includes(data.label)"
                    :key="`filter${index}`"
                  >
                    <div class="row">
                      <div class="col-4">
                        {{ data.label + " : " }}
                        <dropdown-filter
                          :render-data="dataType"
                          label="Pilih Type Filter"
                          @change="val => setTypeFilter(val, index, data.label)"
                          select-name="Nama"
                          select-value="ID"
                        ></dropdown-filter>
                      </div>
                      <div
                        v-if="filters[index].type.value"
                        class="col-8 column justify-end"
                      >
                        <q-input
                          v-if="filters[index].type.label.includes('Text')"
                          borderless
                          filled=""
                          dense=""
                          debounce="300"
                          v-model="filters[index].value"
                          :placeholder="data.label"
                          ><template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                        <q-input
                          v-else-if="
                            filters[index].type.label.includes('Datetime')
                          "
                          filled=""
                          borderless
                          dense
                          @click.self="
                            showDatetimePicker(
                              `datetime${data.label}`,
                              data.label
                            )
                          "
                          debounce="300"
                          readonly
                          v-model="filters[index].value"
                          :placeholder="data.label"
                          mask="##/##/#### ##:##:##"
                          ><template v-slot:append>
                            <q-icon
                              v-if="!filters[index].value"
                              name="search"
                            />
                            <q-icon
                              v-else
                              name="clear"
                              @click.stop="
                                clearDatetime(`${data.label}`, index)
                              "
                            />
                            <q-popup-proxy
                              :ref="`datetime${data.label}`"
                              transition-show="scale"
                              transition-hide="scale"
                              breakpoint="2000"
                            >
                              <q-card>
                                <q-tabs
                                  v-model="datetimeTab"
                                  dense
                                  class="text-grey"
                                  active-color="primary"
                                  indicator-color="primary"
                                  align="justify"
                                  narrow-indicator
                                >
                                  <q-tab name="Date" label="Date" />
                                  <q-tab name="Time" label="Time" />
                                </q-tabs>
                                <q-separator />

                                <q-tab-panels v-model="datetimeTab" animated>
                                  <q-tab-panel name="Date">
                                    <div class="text-center">
                                      {{ filters[index].value }}
                                    </div>
                                    <q-date
                                      v-model="filters[index].value"
                                      mask="DD/MM/YYYY HH:mm:ss"
                                    />
                                  </q-tab-panel>

                                  <q-tab-panel name="Time">
                                    <div class="text-center">
                                      {{ filters[index].value }}
                                    </div>
                                    <q-time
                                      v-model="filters[index].value"
                                      mask="DD-MM-YYYY HH:mm:ss"
                                      with-seconds
                                      format24h
                                    />
                                  </q-tab-panel>
                                </q-tab-panels>
                              </q-card>
                            </q-popup-proxy>
                          </template>
                        </q-input>
                        <time-picker
                        v-else-if="
                            filters[index].type.label.includes('Time')
                          "
                          :label = "data.label"
                          @change="(val)=>filters[index].value = val"
                        />
                        <date-picker
                        v-else-if="
                            filters[index].type.label.includes('Dates')
                          "
                          :label = "data.label"
                          @change="(val)=>filters[index].value = val"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </q-expansion-item>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <template>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value != "null" ? col.value : "" }}
                </q-td>
              </template>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <div class="row full-width justify-between q-mt-md">
      <q-btn color="primary" label="Generate" @click="loadDataQuery()" />
      <q-btn
        color="positive"
        icon-right="archive"
        label="Export to Excel"
        :disable="dataToShow.length > 0 ? false : true"
        no-caps
        @click="exportExcel(columns, dataToShow, 'generated-report')"
      />
    </div>
  </q-page>
</template>

<script src="./GenerateReport.js"></script>
