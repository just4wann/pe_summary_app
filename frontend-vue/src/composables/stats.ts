import { type Ref } from 'vue';
import type { FeedType, TroubleDataRecordByDay, TroubleDataRecordByFactory, FactoryListType } from '../types';
import { generateTimestamp, isSameDate } from '../utils';

export default class StatisticChart {
  public async totalTroubleInDay(dataFeed: Ref<FeedType[]>, dataRecord: Ref<TroubleDataRecordByDay[]>, date: Ref<string[]>) {
    if (!dataFeed.value) return;

    dataRecord.value = [];
    for (const d of date.value) {
      let counter: number = 0;
      const eachDate = new Date(d);
      for (let item of dataFeed.value) {
        let feedDate = new Date(item.createdAt);
        if (isSameDate(feedDate, eachDate)) counter++;
      }
      dataRecord.value.push({
        value: counter,
        timestamp: generateTimestamp(eachDate)[1],
      });
    }
  }

  public async totalTroubleByFactory(dataFeed: Ref<FeedType[]>, dataRecord: Ref<TroubleDataRecordByFactory[]>, date: Ref<string[]>, factory?: FactoryListType) {
    if (!dataFeed.value) return;

    const factoryMap = {
      f1: 'Factory 1',
      f2: 'Factory 2',
      f3: 'Factory 3',
      f4: 'Factory 4',
      subpro: 'Subproduction',
    };

    dataRecord.value = [];
    for (const d of date.value) {
      const eachDate = new Date(d);
      const counters = {
        f1: 0,
        f2: 0,
        f3: 0,
        f4: 0,
        subpro: 0,
      };
      for (const item of dataFeed.value) {
        let feedDate = new Date(item.createdAt);
        if (isSameDate(feedDate, eachDate)) {
          const factoryName = item.factory;

          if (!factory || factory === 'all') {
            if (factoryName === 'Factory 1') counters.f1++;
            else if (factoryName === 'Factory 2') counters.f2++;
            else if (factoryName === 'Factory 3') counters.f3++;
            else if (factoryName === 'Factory 4') counters.f4++;
            else if (factoryName === 'Subproduction') counters.subpro++;
          } else {
            if (factoryMap[factory] == factoryName) {
              if (factory === 'f1') counters.f1++;
              else if (factory === 'f2') counters.f2++;
              else if (factory === 'f3') counters.f3++;
              else if (factory === 'f4') counters.f4++;
              else if (factory === 'subpro') counters.subpro++;
            }
          }
        }
      }
      dataRecord.value.push({
        ...counters,
        timestamp: generateTimestamp(eachDate)[1],
      });
    }
  }
}
