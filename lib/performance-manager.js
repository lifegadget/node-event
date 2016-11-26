"use strict";
require('./common-types');
class PerformanceMetric {
    constructor(metric, options, sendEvent) {
        this.sendEvent = sendEvent;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PerformanceMetric;
