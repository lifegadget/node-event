import './common-types';
import WorkflowManager from './workflow-manager';
import * as workflow from './workflow-manager';
import PerformanceManager from './performance-manager';
import * as StackTrace from 'stacktrace-js';
import * as Promise from 'bluebird';
import * as axios from 'axios';
import * as utils from './utils';
import * as _ from 'lodash';
import { v4 } from 'uuid';

const STACK_TRACE_LOG_LEVELS = ['warn', 'error'];
const STACK_START_DEPTH = 2;
const EVENT_API_ENDPOINT = 'https://m21x9qbpyi.execute-api.eu-west-1.amazonaws.com/dev/logger';

const encoded = (hash: IDictionary<any>) => {
  Object.keys(hash).map( (key) => {
    hash[new Buffer(key, 'base64').toString()] = new Buffer(hash[key]).toString();
    delete hash[key];
  });
};

export default class EventManager {
  public context: IDictionary<any> = {};
  public tags: string[];
  public componentType: 'frontend' | 'backend' | 'infrastructure' | 'other' = 'backend';

  private workflows: WorkflowManager[]  = [];
  private perfMeasurements: PerformanceManager[] = [];
  private user: IDictionary<any>;
  private tagId: string;
  /* properties that will be forwarded as part of event */
  private meta: IDictionary<string> = {};
  private _networkOutput: boolean = true;
  private _consoleOutput: boolean = true;

  constructor(tagId?: string, tags?: string[]) {
    this.tagId = tagId || v4();
    this.tags = tags;
  }

  public userLogin(userId: string, userProps: IDictionary<any> = {}) {
    this.user = Object.assign(encoded(userProps), {id: userId});
  }

  /**
   * Sets the applications name so subsequent calls will include this information;
   * uses a fluent style interface.
   */
  public app(name: string) {
    this.meta['appName'] = name;
    return this;
  }

  /**
   * Sets the architecture variable; uses a fluent style interface.
   */
  public architecture(arch: string) {
    const validValues = ['frontend' , 'backend' , 'db' , 'infra' , 'other'];
    if (validValues.reduce( (previous, current) => previous || current === arch ? 'true' : '' )) {
      this.meta['architecture'] = arch;
      return this;
    } else {
      throw new Error(`invalid value for architecture, must be one of the following: ${validValues.join(', ')}`);
    }
  }

  /**
   * Sets the applications component name; this name is anything the user wants it to be
   */
  public component(name: string) {
    this.meta['component'] = name;
    return this;
  }

  /**
   * Sets a function name; intended to be set at the entry to a function point which has logging
   */
  public fn(name: string) {
    this.meta['component'] = name;
    return this;
  }

  public consoleOutput(flag: boolean) {
    this._consoleOutput = flag;
    return this;
  }

  public networkOutput(flag: boolean) {
    this._networkOutput = flag;
    return this;
  }

  /**
   * Adds a stacktrace to an incoming options hash before it is sent out to logging server.
   * You can optionally send in an Error object (ideal) or it will instead just take the
   * current call stack (minus the stack involved in getting here)
   */
  public stackTrace(err: Error | null, incomingHash: IDictionary<any> ): Promise<IDictionary<any>> {
    let hash = Object.assign({}, incomingHash);
    return new Promise( (resolve, reject) => {

      if (err) {
        StackTrace.fromError(err)
          .then( (st) => {
            hash['stack'] = st;
            return Promise.resolve(hash);
          })
          .then(resolve)
          .catch(reject);
      } else {
        StackTrace.get()
          .then( (st) => st.slice(STACK_START_DEPTH))
          .then( (st) => {
            hash['stack'] = st;
            return Promise.resolve(hash);
          })
          .then(resolve)
          .catch(reject);
      }

    });
  }

  public sendEvent(eventType: string) {
    return (hash: IDictionary<any>): Promise<any> => {

      return new Promise( (resolve, reject) => {

        hash = Object.assign({
          id: v4(),
          eventType,
          tagId: this.tagId,
          user: this.user,
          meta: this.meta,
        }, hash);
        if (this._consoleOutput) {
          console.log(JSON.stringify(hash, null, 2));
        }

        if (this._networkOutput) {
          axios.post(EVENT_API_ENDPOINT, hash)
            .then(resolve)
            .catch( (err) => {
              this.addToHospital(err, hash);
              reject(err);
            });
        } else {
          resolve();        
        }

      }); // promise
    }; // inner function
  }

  public createWorkflow(type: string, subType: string) {
    const wf = new WorkflowManager(type, subType);
    this.workflows.push(wf);
    return wf;
  }

  public createMeasurement(metric: string, options: IDictionary<any>) {
    const perf = new PerformanceManager(metric, options, this.sendEvent('performance'));
    this.perfMeasurements.push(perf);
    return perf;
  }

  public exit() {
    // TODO
  }

  public debug(message: string, options: IDictionary<any>) {
    return this.log( message, _.assign(options, {severity: 'debug'}) );
  }
  public info(message: string, options: IDictionary<any>): Promise<any> {
    return this.log( message, _.assign(options, {severity: 'info'}) );
  }
  public warn(message: string, options: IDictionary<any>) {
    return this.log( message, _.assign(options, {severity: 'warn'}) );
  }
  public error(message: string, options: IDictionary<any>) {
    return this.log( message, _.assign(options, {severity: 'error'}) );
  }

  protected log( messageOrError: string | Error, hash?: IDictionary<any> ): Promise<any> {
    if (!hash['severity']) { hash['severity'] = 'info'; }
    if (typeof messageOrError !== 'string') {
      hash = this.stackTrace(messageOrError, hash);
      hash['message'] = messageOrError.message;
    } else {
      if (STACK_TRACE_LOG_LEVELS.filter((s: string) => s === hash['severity']).length > 0 ) {
        hash = this.stackTrace(null, hash);
      }
      hash['message'] = messageOrError;
    }
    return this.sendEvent('log')(_.assign(hash, { 
      message: messageOrError,
      meta: this.meta,
    }));
  }

  protected addToHospital(err: any, event: IDictionary<any>) {
    // TODO: Implement
  }

}
