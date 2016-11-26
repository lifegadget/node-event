
import EventManager from "../src/event-manager";
import * as mocha from 'mocha';
import { expect } from "chai";


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

  it('createWorkflow returns a WorkflowManager', () => {
    const event: EventManager = new EventManager();
    const wf = event.createWorkflow('shopping', 'checkout');
  });

  it.skip('createMeasurement returns a PerformanceMeasurement');

  it('logging info() works', (done) => {
    const event: EventManager = new EventManager();
    event.info('this is just a test', {
      testing: true,
    })
      .then(() => {
        console.log('success');
        done();
      })
      .catch(err => {
        console.log('failed with', err);
        done(err);
      });
  });

});
