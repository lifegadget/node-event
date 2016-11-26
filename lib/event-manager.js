"use strict";
require('./common-types');
const workflow_manager_1 = require('./workflow-manager');
const performance_manager_1 = require('./performance-manager');
const StackTrace = require('stacktrace-js');
const Promise = require('bluebird');
const axios = require('axios');
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
        this.tagId = tagId || uuid_1.v4();
        this.tags = tags;
    }
    userLogin(userId, userProps = {}) {
        this.user = Object.assign(encoded(userProps), { id: userId });
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
                    componentType: this.componentType,
                    user: this.user,
                    context: this.context,
                }, hash);
                console.log('sending event', hash);
                axios.post(EVENT_API_ENDPOINT, hash)
                    .then(resolve)
                    .catch((err) => {
                    this.addToHospital(err, hash);
                    reject(err);
                });
            });
        };
    }
    createWorkflow(type, subType) {
        const wf = new workflow_manager_1.default(type, subType);
        this.workflows.push(wf);
        return wf;
    }
    createMeasurement(metric, options) {
        const perf = new performance_manager_1.default(metric, options, this.sendEvent('performance'));
        this.perfMeasurements.push(perf);
        return perf;
    }
    exit() {
    }
    debug(message, options) {
        return this.log(message, { options, severity: 'debug' });
    }
    info(message, options) {
        return this.log(message, { options, severity: 'info' });
    }
    warn(message, options) {
        return this.log(message, { options, severity: 'warn' });
    }
    error(message, options) {
        return this.log(message, { options, severity: 'error' });
    }
    log(messageOrError, hash) {
        console.log('logging', messageOrError, hash);
        if (!hash['severity']) {
            hash['severity'] = 'info';
        }
        if (typeof messageOrError !== 'string') {
            hash = this.stackTrace(messageOrError, hash);
            hash['message'] = messageOrError.message;
        }
        else {
            if (STACK_TRACE_LOG_LEVELS.filter((s) => s === hash['severity']).length > 0) {
                hash = this.stackTrace(null, hash);
            }
            hash['message'] = messageOrError;
        }
        return this.sendEvent('log')(Object.assign({ message: messageOrError }, hash));
    }
    addToHospital(err, event) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventManager;
