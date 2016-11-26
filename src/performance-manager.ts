import './common-types';

export default class PerformanceMetric {
  private sendEvent: Function;

  constructor(metric: string, options: IDictionary<any>, sendEvent: Function) {
    this.sendEvent = sendEvent;
  }

}
