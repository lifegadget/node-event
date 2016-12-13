import './common-types';
import * as moment from 'moment';
import * as EventManager from './event-manager';

export interface ITimingTick {
  timestamp: number | number[];
  comment: string;
}

export default class PerformanceMetric {
  
  private sendEvent: Function;
  private metric: string;
  /* the time of day, measured in unix epoc */
  private tod: number;
  private lastTick: any;
  private ticks: ITimingTick[];
  private resolution: 'milisecond' | 'second' | 'nanosecond' = 'nanosecond';

  constructor(metric: string, sendEvent: Function) {
    this.metric = metric;
    this.sendEvent = sendEvent;
  }

  public start(comment: string = 'start') {
    this.lastTick = process.hrtime();
    this.tod = moment().unix();
    this.ticks = [{ 
      timestamp: this.lastTick,
      comment,
    }];
  }

  public tick(comment: string) {
    this.lastTick = process.hrtime(this.lastTick);
    this.ticks.push({
      timestamp: this.lastTick,
      comment,
    });
  }

  public stop(comment: string = 'stop') {
    this.lastTick = process.hrtime(this.lastTick);
    this.ticks.push({
      timestamp: this.lastTick,
      comment,
    });
    this.sendEvent({
      metric: this.metric,
      ticks: this.ticks,
      tod: this.tod,
    });
  }

}
