import './test-setup';
import * as mocha from 'mocha';
import { expect } from "chai";
import { stdout } from 'test-console';
import EventManager from "../src/event-manager";

describe("Event Manager", () => {
  it("can instantiate", () => {
    const event = new EventManager();
    expect(event).to.be.an('object');
  });

  it("expected interface", () => {
    const event: EventManager = new EventManager();
    const interfaces = ['createWorkflow', 'createMeasurement', 'log', 'sendEvent', 'userLogin'];
    interfaces.map((i: string) => {
      expect(event).has.property(i);
    });
  });

  it('createWorkflow returns a WorkflowManager', () => {
    const event: EventManager = new EventManager();
    const wf = event.createWorkflow('shopping', 'checkout');
  });

  it.skip('createMeasurement returns a PerformanceMeasurement');

  it('logging info() works', (done) => {
    const event: EventManager = new EventManager();
    let mute = stdout.inspect();
    event.info('this is just a test', {
      testing: true,
    })
      .then(() => {
        mute.restore();
        
        expect(mute.output).to.be.an('array');
        expect(mute.output).to.have.lengthOf(1);
        expect(mute.output[0].indexOf('info')).to.not.equal(-1);

        done();
      })
      .catch((err) => {
        console.log('failed with', err);
        done(err);
      });
  });

  it('logging warn() works', (done) => {
    const event: EventManager = new EventManager();
    let mute = stdout.inspect();

    event.warn('this is a warning ... get out of the house', {
      testing: true,
    })
      .then(() => {
        mute.restore();
        expect(mute.output).to.be.an('array');
        expect(mute.output).to.have.lengthOf(1);
        expect(mute.output[0].indexOf('warn')).to.not.equal(-1);
        done();
      })
      .catch((err) => {
        console.log('failed with', err);
        done(err);
      });
  });

  it('setting the app, fn, and architecture meta', (done) => {
    const event: EventManager = new EventManager();
    let mute = stdout.inspect();
    event
      .fn('event-manager-spec')
      .app('node-event')
      .architecture('backend');

    event.warn(`I'm warning you but I am providing you with meta info`, {
      testing: true,
    })
      .then(() => {
        mute.restore();
        expect(mute.output).to.be.an('array');
        expect(mute.output).to.have.lengthOf(1);
        expect(mute.output[0].indexOf('event-manager-spec')).to.not.equal(-1);
        expect(mute.output[0].indexOf('node-event')).to.not.equal(-1);
        expect(mute.output[0].indexOf('architecture')).to.not.equal(-1);
        done();
      })
      .catch((err) => {
        mute.restore();
        console.log('failed with', err);
        done(err);
      });
  });

  it('setting the app, fn, and architecture meta, no local', (done) => {
    const event: EventManager = new EventManager();
    let mute = stdout.inspect();
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
        expect(mute.output).to.be.an('array');
        expect(mute.output).to.have.lengthOf(0);
        done();
      })
      .catch((err) => {
        mute.restore();
        console.log('failed with', err);
        done(err);
      });
  });

  it.skip('performance measurement provides right number of lines of output', (done) => {
    const event: EventManager = new EventManager();
    const perf = event.createMeasurement('testing');
    let mute = stdout.inspect();
    perf.start();
    setTimeout(() => {
      perf.tick('intermediate time');
      perf.tick('intermediate time 2');
      perf.tick('intermediate time 3');
      setTimeout(() => {
        perf.stop();
        mute.restore();
        const header = 2;
        const events = 5;
        const footer = 1;
        expect(mute.output).to.have.lengthOf(header + events + footer);
        done();
      }, 35);
    }, 25);

  });

});
