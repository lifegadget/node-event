"use strict";
require('./common-types');
const workflow_manager_1 = require('./workflow-manager');
const performance_manager_1 = require('./performance-manager');
const StackTrace = require('stacktrace-js');
const Promise = require('bluebird');
const axios = require('axios');
const utils = require('./utils');
const _ = require('lodash');
const uuid_1 = require('uuid');
const STACK_TRACE_LOG_LEVELS = ['warn', 'error'];
const STACK_START_DEPTH = 2;
const EVENT_API_ENDPOINT = 'https://m21x9qbpyi.execute-api.eu-west-1.amazonaws.com/dev/logger';
const encoded = (hash) => {
    Object.keys(hash).map((key) => {
        hash[new Buffer(key, 'base64').toString()] = new Buffer(hash[key]).toString();
        delete hash[key];
    });
};
class EventManager {
    constructor(tagId, tags) {
        this.context = {};
        this.componentType = 'backend';
        this.workflows = [];
        this.perfMeasurements = [];
        this.meta = {};
        this._networkOutput = true;
        this._consoleOutput = true;
        this.tagId = tagId || uuid_1.v4();
        this.tags = tags;
    }
    userLogin(userId, userProps = {}) {
        this.user = Object.assign(encoded(userProps), { id: userId });
    }
    app(name) {
        this.meta['appName'] = name;
        return this;
    }
    architecture(arch) {
        const validValues = ['frontend', 'backend', 'db', 'infra', 'other'];
        if (validValues.reduce((previous, current) => previous || current === arch ? 'true' : '')) {
            this.meta['architecture'] = arch;
            return this;
        }
        else {
            throw new Error(`invalid value for architecture, must be one of the following: ${validValues.join(', ')}`);
        }
    }
    component(name) {
        this.meta['component'] = name;
        return this;
    }
    fn(name) {
        this.meta['fn'] = name;
        return this;
    }
    transaction(id) {
        this.meta['transactionId'] = id;
        return this;
    }
    consoleOutput(flag) {
        this._consoleOutput = flag;
        return this;
    }
    networkOutput(flag) {
        this._networkOutput = flag;
        return this;
    }
    stackTrace(err, incomingHash) {
        let hash = Object.assign({}, incomingHash);
        return new Promise((resolve, reject) => {
            if (err) {
                StackTrace.fromError(err)
                    .then((st) => {
                    hash['stack'] = st;
                    return Promise.resolve(hash);
                })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                StackTrace.get()
                    .then((st) => st.slice(STACK_START_DEPTH))
                    .then((st) => {
                    hash['stack'] = st;
                    return Promise.resolve(hash);
                })
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    sendEvent(eventType) {
        return (hash) => {
            return new Promise((resolve, reject) => {
                hash = Object.assign({
                    id: uuid_1.v4(),
                    eventType,
                    tagId: this.tagId,
                    user: this.user,
                    meta: this.meta,
                }, hash);
                if (this._consoleOutput) {
                    if (eventType === 'log') {
                        console.log(JSON.stringify(hash, null, 2));
                    }
                    if (eventType === 'performance') {
                        console.log(`Performance for "${hash['metric']}" metric:`);
                        console.log('---------------------------' + Array(hash['metric'].length).join('-'));
                        if (console.table) {
                            console.table(hash['ticks']);
                        }
                        else {
                            hash['ticks'].map((tick) => {
                                const stamp = typeof tick.timestamp === 'number'
                                    ? utils.padLeft(20, tick.timestamp)
                                    : utils.padLeft(10, tick.timestamp[0]) + utils.padLeft(15, tick.timestamp[1]);
                                console.log(`${stamp} - ${tick['comment']}`);
                            });
                        }
                        console.log(`\nMeta information for performance run was:\n`, JSON.stringify(utils.without(hash, 'ticks', 'metric'), null, 2));
                    }
                }
                if (this._networkOutput) {
                    console.error('working ', eventType);
                    axios.post(EVENT_API_ENDPOINT, hash)
                        .then(resolve)
                        .catch((err) => {
                        this.addToHospital(err, hash);
                        reject(err);
                    });
                }
                else {
                    resolve();
                }
            });
        };
    }
    createWorkflow(type, subType) {
        const wf = new workflow_manager_1.default(type, subType);
        this.workflows.push(wf);
        return wf;
    }
    createMeasurement(metric, options) {
        const perf = new performance_manager_1.default(metric, this.sendEvent('performance').bind(this));
        this.perfMeasurements.push(perf);
        return perf;
    }
    exit() {
    }
    debug(message, options) {
        return this.log(message, _.assign(options, { severity: 'debug' }));
    }
    info(message, options) {
        return this.log(message, _.assign(options, { severity: 'info' }));
    }
    warn(message, options) {
        return this.log(message, _.assign(options, { severity: 'warn' }));
    }
    error(message, options) {
        return this.log(message, _.assign(options, { severity: 'error' }));
    }
    log(messageOrError, hash) {
        const severity = hash['severity'] || 'info';
        let message;
        let stack;
        if (typeof messageOrError !== 'string') {
            stack = this.stackTrace(messageOrError, hash);
            hash['message'] = messageOrError.message;
        }
        else {
            if (STACK_TRACE_LOG_LEVELS.filter((s) => s === hash['severity']).length > 0) {
                hash = this.stackTrace(null, hash);
            }
            hash['message'] = messageOrError;
        }
        return this.sendEvent('log')(_.assign(hash, {
            message: messageOrError,
            severity: hash['severity'],
            meta: this.meta,
        }));
    }
    addToHospital(err, event) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventManager;
