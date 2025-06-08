<script setup lang="ts">
import { onBeforeMount, ref, watchEffect, type Ref } from 'vue';
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip, VisScatter, VisBulletLegend } from '@unovis/vue';

import Footer from '../components/Footer.vue';
import { generateTimestamp } from '../utils';
import { type FactoryListType, type FactoryType, type FeedType, type TroubleDataRecordByDay, type TroubleDataRecordByFactory } from '../types';
import StatisticChart from '../composables/stats';
import { factoryData } from '../constant';
import { FeedAPI } from '../composables/feeds';
import type { BulletLegendItemInterface } from '@unovis/ts';

const feedAPI = new FeedAPI();

const feedData = ref<FeedType[]>([]);
const selectedFactory = ref<FactoryType>();
const statistic = new StatisticChart();
const datesByDay = ref<Date[] | undefined>([new Date(), new Date()]);
const datesByFactory = ref<Date[] | undefined>([new Date(), new Date()]);

const troubleRecordByDay = ref<TroubleDataRecordByDay[]>([]);
const troubleRecordByFactory = ref<TroubleDataRecordByFactory[]>([]);

const xByDay = (d: TroubleDataRecordByDay, i: number): number => i;
const yByDay = [(d: TroubleDataRecordByDay): number => d.value];
const xByFactory = (d: TroubleDataRecordByFactory, i: number): number => i;
const yByFactory = [
  (d: TroubleDataRecordByFactory): number => d.f1,
  (d: TroubleDataRecordByFactory): number => d.f2,
  (d: TroubleDataRecordByFactory): number => d.f3,
  (d: TroubleDataRecordByFactory): number => d.f4,
  (d: TroubleDataRecordByFactory): number => d.subpro,
];

const datePickerRangeFormat = (dates: Ref<Date[] | undefined>): Ref<string[]> => {
  if (!dates.value) return ref<string[]>([]);
  if (!dates.value[1]) return ref<string[]>([]);
  const startDate = dates.value[0];
  const endDate = dates.value[1];

  let current = new Date(startDate);
  let dateRange: Ref<string[]> = ref<[]>([]);

  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    dateRange.value.push(current.toISOString());
    current.setDate(current.getDate() + 1);
  }
  return dateRange;
};

const xTicksLabelByDay = (i: number): string => {
  const dateRange = datePickerRangeFormat(datesByDay);
  if (dateRange.value.length == 0) return `<p class="text-[0.1rem]">null</p>`;
  return generateTimestamp(dateRange.value[i])[1];
};
const xTicksLabelByFactory = (i: number): string => {
  const dateRange = datePickerRangeFormat(datesByFactory);
  if (dateRange.value.length == 0) return `<p class="text-[0.1rem]">null</p>`;
  return generateTimestamp(dateRange.value[i])[1];
};

const xTickLabelLengthByDay = (): number => {
  return troubleRecordByDay.value.length >= 15 ? 15 : troubleRecordByDay.value.length - 1;
};
const xTickLabelLengthByFactory = (): number => {
  return troubleRecordByFactory.value.length >= 15 ? 15 : troubleRecordByFactory.value.length - 1;
};

const templateByDay = (d: TroubleDataRecordByDay) => `<p class="text-xs">${d.value} trouble</p>`;
const templateByFactory = (d: TroubleDataRecordByFactory) => `<p class="text-xs">F1 : ${d.f1}<br/> F2 : ${d.f2}<br/> F3 : ${d.f3}<br/> F4 : ${d.f4}<br/> Subpro : ${d.subpro}</p>`;

const colorByFactory = ['blue', 'red', 'green', 'orange', 'pink'];
const labelByFactory = ['Factory 1', 'Factory 2', 'Factory 3', 'Factory 4', 'Subproduction'];

const itemsByFactory: BulletLegendItemInterface[] = labelByFactory.map((label, i) => ({ name: label, color: colorByFactory[i] }));
const lineColorByFactory = (d: TroubleDataRecordByFactory, i: number) => colorByFactory[i];

onBeforeMount(async () => {
  await feedAPI.getAllFeed(feedData);
});

watchEffect(async () => {
  if (!datesByDay.value) return;
  if (datesByDay.value.length != 2) return;

  if (!datesByFactory.value) return;
  if (datesByFactory.value.length != 2) return;

  let factoryCode = selectedFactory.value?.code as FactoryListType;
  await statistic.totalTroubleInDay(feedData, troubleRecordByDay, datePickerRangeFormat(datesByDay));
  await statistic.totalTroubleByFactory(feedData, troubleRecordByFactory, datePickerRangeFormat(datesByFactory), factoryCode);
});
</script>
<template>
  <div>
    <main class="min-h-screen">
      <header class="flex items-center justify-between bg-white p-5">
        <div class="flex items-center gap-5">
          <button @click="$router.back()">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h1>Statistic</h1>
        </div>
      </header>
      <Card class="mt-2">
        <template #content>
          <section class="flex flex-col justify-center items-start gap-5">
            <div class="flex items-center justify-between w-full">
              <span class="poppins-semibold text-xs">Total Trouble in a day</span>
              <DatePicker v-model="datesByDay" selectionMode="range" size="small" showIcon fluid :showOnFocus="false" placeholder="Select dates" :inputStyle="{ fontSize: '0.6rem', width: '9.5rem' }" />
            </div>
            <VisXYContainer :data="troubleRecordByDay" :margin="{ right: 15 }" :height="200" :key="datesByDay">
              <VisLine :x="xByDay" :y="yByDay" :lineWidth="2" />
              <VisAxis
                type="x"
                :x="xByDay"
                :tickFormat="xTicksLabelByDay"
                :tickTextAngle="10"
                :gridLine="false"
                label="Day"
                labelFontSize="10px"
                tickTextFontSize="10px"
                :labelMargin="5"
                :tickLine="false"
                :numTicks="xTickLabelLengthByDay()"
              />
              <VisAxis type="y" :y="yByDay" :gridLine="false" label="Total" labelFontSize="10px" tickTextFontSize="10px" :labelMargin="5" :tickLine="false" />
              <VisCrosshair :template="templateByDay" color="rgb(77, 140, 253)" />
              <VisScatter :x="xByDay" :y="yByDay" :size="5" />
              <VisTooltip />
            </VisXYContainer>
          </section>
        </template>
      </Card>
      <Card class="mt-2">
        <template #content>
          <section class="flex flex-col justify-center items-start gap-5">
            <div class="flex items-center justify-between w-full">
              <span class="poppins-semibold text-xs">Total Trouble by Factory</span>
              <div class="flex flex-col gap-1">
                <DatePicker v-model="datesByFactory" selectionMode="range" size="small" showIcon fluid :showOnFocus="false" placeholder="Select dates" :inputStyle="{ fontSize: '0.6rem', width: '9.5rem' }" />
                <Select v-model="selectedFactory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" class="w-full" size="small" :labelStyle="{ fontSize: '0.6rem' }">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                      <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center">
                      <div class="text-[0.6rem]">{{ slotProps.option.name }}</div>
                    </div>
                  </template>
                  <template #dropdownicon>
                    <i class="pi pi-warehouse" style="font-size: 0.8rem" />
                  </template>
                </Select>
              </div>
            </div>
            <VisXYContainer :data="troubleRecordByFactory" :margin="{ right: 15 }" :height="200" :key="datesByFactory">
              <VisLine :x="xByFactory" :y="yByFactory" :lineWidth="2" :color="lineColorByFactory"/>
              <VisAxis
                type="x"
                :x="xByFactory"
                :tickFormat="xTicksLabelByFactory"
                :tickTextAngle="10"
                :gridLine="false"
                label="Day"
                labelFontSize="10px"
                tickTextFontSize="10px"
                :labelMargin="5"
                :tickLine="false"
                :numTicks="xTickLabelLengthByFactory()"
              />
              <VisAxis type="y" :y="yByFactory" :gridLine="false" label="Total" labelFontSize="10px" tickTextFontSize="10px" :labelMargin="5" :tickLine="false" />
              <VisCrosshair :template="templateByFactory" color="rgb(77, 140, 253)" />
              <VisScatter :x="xByFactory" :y="yByFactory" :size="5" :color="lineColorByFactory"/>
              <VisTooltip />
            </VisXYContainer>
            <VisBulletLegend :items="itemsByFactory" labelFontSize="9px" />
          </section>
        </template>
      </Card>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
