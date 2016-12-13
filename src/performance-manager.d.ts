import './common-types';
export interface ITimingTick {
    timestamp: number | number[];
    comment: string;
}
export default class PerformanceMetric {
    private sendEvent;
    private metric;
    private tod;
    private lastTick;
    private ticks;
    private resolution;
    constructor(metric: string, sendEvent: Function);
    start(comment?: string): void;
    tick(comment: string): void;
    stop(comment?: string): void;
}
