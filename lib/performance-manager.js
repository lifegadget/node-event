"use strict";
require("./common-types");
const moment = require("moment");
class PerformanceMetric {
    constructor(metric, sendEvent) {
        this.resolution = 'nanosecond';
        this.metric = metric;
        this.sendEvent = sendEvent;
    }
    start(comment = 'start') {
        this.lastTick = process.hrtime();
        this.tod = moment().unix();
        this.ticks = [{
                timestamp: this.lastTick,
                comment,
            }];
    }
    tick(comment) {
        this.lastTick = process.hrtime(this.lastTick);
        this.ticks.push({
            timestamp: this.lastTick,
            comment,
        });
    }
    stop(comment = 'stop') {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PerformanceMetric;
