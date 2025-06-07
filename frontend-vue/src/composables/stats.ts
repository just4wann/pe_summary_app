import { ref, type Ref } from 'vue';
import type { FeedType, TroubleDataRecordByDay, TroubleDataRecordByFactory } from '../types';
import { FeedAPI } from './feeds';
import { generateTimestamp } from '../utils';

export default class StatisticChart {
  private feedAPI: FeedAPI;
  private dataFeeds: Ref<FeedType[]>;
  constructor() {
    this.feedAPI = new FeedAPI();
    this.dataFeeds = ref<FeedType[]>([]);
  }
  public async totalTroubleInDay(dataRecord: Ref<TroubleDataRecordByDay[]>, date: Ref<string[]>) {
    const result = await this.feedAPI.getAllFeed(this.dataFeeds);
    if (!result.status) return;

    dataRecord.value = [];
    for (let i in date.value) {
      let countData: number = 0;
      let eachDate = new Date(date.value[i]);
      for (let j in this.dataFeeds.value) {
        let feedDate = new Date(this.dataFeeds.value[j].createdAt);
        if (feedDate.getDate() == eachDate.getDate()) countData++;
      }
      dataRecord.value.push({
        value: countData,
        timestamp: `${generateTimestamp(eachDate)[1]}`,
      });
    }
  }

  public async totalTroubleByFactory(dataRecord: Ref<TroubleDataRecordByFactory[]>, date: Ref<string[]>) {
    const result = await this.feedAPI.getAllFeed(this.dataFeeds);
    if (!result.status) return;

    dataRecord.value = [];
    for (let i in date.value) {
      let countDataF1: number = 0;
      let countDataF2: number = 0;
      let countDataF3: number = 0;
      let countDataF4: number = 0;
      let countDataSubpro: number = 0;
      let eachDate = new Date(date.value[i]);
      for (let j in this.dataFeeds.value) {
        let feedDate = new Date(this.dataFeeds.value[j].createdAt);
        if (feedDate.getDate() == eachDate.getDate()) {
          if (this.dataFeeds.value[j].factory == 'Factory 1') countDataF1++;
          else if (this.dataFeeds.value[j].factory == 'Factory 2') countDataF2++;
          else if (this.dataFeeds.value[j].factory == 'Factory 3') countDataF3++;
          else if (this.dataFeeds.value[j].factory == 'Factory 4') countDataF4++;
          else if (this.dataFeeds.value[j].factory == 'Subproduction') countDataSubpro++;
        };
      }
      dataRecord.value.push({
        f1: countDataF1,
        f2: countDataF2,
        f3: countDataF3,
        f4: countDataF4,
        subpro: countDataSubpro,
        timestamp: `${generateTimestamp(eachDate)[1]}`,
      });
    }
  }
}
