"use strict";
require('./test-setup');
const chai_1 = require("chai");
const test_console_1 = require('test-console');
const event_manager_1 = require("../src/event-manager");
describe("Event Manager", () => {
    it("can instantiate", () => {
        const event = new event_manager_1.default();
        chai_1.expect(event).to.be.an('object');
    });
    it("expected interface", () => {
        const event = new event_manager_1.default();
        const interfaces = ['createWorkflow', 'createMeasurement', 'log', 'sendEvent', 'userLogin'];
        interfaces.map((i) => {
            chai_1.expect(event).has.property(i);
        });
    });
    it('createWorkflow returns a WorkflowManager', () => {
        const event = new event_manager_1.default();
        const wf = event.createWorkflow('shopping', 'checkout');
    });
    it.skip('createMeasurement returns a PerformanceMeasurement');
    it('logging info() works', (done) => {
        const event = new event_manager_1.default();
        let mute = test_console_1.stdout.inspect();
        event.info('this is just a test', {
            testing: true,
        })
            .then(() => {
            mute.restore();
            chai_1.expect(mute.output).to.be.an('array');
            chai_1.expect(mute.output).to.have.lengthOf(1);
            chai_1.expect(mute.output[0].indexOf('info')).to.not.equal(-1);
            done();
        })
            .catch((err) => {
            console.log('failed with', err);
            done(err);
        });
    });
    it('logging warn() works', (done) => {
        const event = new event_manager_1.default();
        let mute = test_console_1.stdout.inspect();
        event.warn('this is a warning ... get out of the house', {
            testing: true,
        })
            .then(() => {
            mute.restore();
            chai_1.expect(mute.output).to.be.an('array');
            chai_1.expect(mute.output).to.have.lengthOf(1);
            chai_1.expect(mute.output[0].indexOf('warn')).to.not.equal(-1);
            done();
        })
            .catch((err) => {
            console.log('failed with', err);
            done(err);
        });
    });
    it('setting the app, fn, and architecture meta', (done) => {
        const event = new event_manager_1.default();
        let mute = test_console_1.stdout.inspect();
        event
            .fn('event-manager-spec')
            .app('node-event')
            .architecture('backend');
        event.warn(`I'm warning you but I am providing you with meta info`, {
            testing: true,
        })
            .then(() => {
            mute.restore();
            chai_1.expect(mute.output).to.be.an('array');
            chai_1.expect(mute.output).to.have.lengthOf(1);
            chai_1.expect(mute.output[0].indexOf('event-manager-spec')).to.not.equal(-1);
            chai_1.expect(mute.output[0].indexOf('node-event')).to.not.equal(-1);
            chai_1.expect(mute.output[0].indexOf('architecture')).to.not.equal(-1);
            done();
        })
            .catch((err) => {
            mute.restore();
            console.log('failed with', err);
            done(err);
        });
    });
    it('setting the app, fn, and architecture meta, no local', (done) => {
        const event = new event_manager_1.default();
        let mute = test_console_1.stdout.inspect();
        event
            .fn('event-manager-spec')
            .app('node-event')
            .architecture('backend')
            .consoleOutput(false);
        event.warn(`I'm warning you but I am providing you with meta info`, {
            testing: true,
        })
            .then(() => {
            mute.restore();
            chai_1.expect(mute.output).to.be.an('array');
            chai_1.expect(mute.output).to.have.lengthOf(0);
            done();
        })
            .catch((err) => {
            mute.restore();
            console.log('failed with', err);
            done(err);
        });
    });
});
