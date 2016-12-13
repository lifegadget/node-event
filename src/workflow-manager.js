"use strict";
require('./common-types');
const uuid_1 = require('uuid');
class WorkflowManager {
    constructor(type, subType) {
        this.timeout = 240;
        this.states = [];
        const now = new Date().getTime();
        this.startTime = now;
        this.type = type;
        this.subType = subType;
        this.id = uuid_1.v4();
    }
    action(name, options) {
        this.addState({
            kind: 'action',
            state: name,
            subState: options['subState'],
            start: new Date().getTime(),
        });
    }
    ;
    navigate(route, options) {
        this.addState({
            kind: 'navigation',
            state: name,
            subState: options['subState'],
            start: new Date().getTime(),
        });
    }
    ;
    get isCompleted() {
        return Boolean(this.states[this.states.length - 1].stop);
    }
    addState(state) {
        this.states.push(state);
        this._updateQueue();
    }
    _updateQueue() {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkflowManager;
