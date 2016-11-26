import './common-types';
import { v4 } from 'uuid';

/**
 * Uses an array to represent a user workflow, where a "workflow" is
 * most typically a set of Ember routes (but can be anything)
 */
export default class WorkflowManager {
  public id: string;
  public uid: string;
  public startTime: number;
  public stopTime: number;
  public type: string;
  public subType: string;
  /**
   * The number of seconds before workflow times out
   */
  public timeout: number = 240;

  private states: IWorkflowState[] = [];

  constructor (type: string, subType: string) {
    const now = new Date().getTime();
    this.startTime = now;
    this.type = type;
    this.subType = subType;
    this.id = v4();
  }

  /**
   * Indicates a user action that took place
   */
  public action(name: string, options: IDictionary<any>) {
    this.addState({
      kind: 'action',
      state: name,
      subState: options['subState'],
      start: new Date().getTime(),
    });
  };

  /**
   * Indicates a route change in the UI
   */
  public navigate(route: string, options: IDictionary<any>) {
    this.addState({
      kind: 'navigation',
      state: name,
      subState: options['subState'],
      start: new Date().getTime(),
    });
  };

  /**
   * Has the workflow completed? A workflow completes when:
   *
   * - explicit call to
   * - user shuts down browser / tab of Ember app
   * - timeout period is exceeded
   */
  get isCompleted() {
    return Boolean(this.states[this.states.length - 1].stop);
  }

  public addState(state: IWorkflowState) {
    this.states.push(state);
    this._updateQueue();
  }

  private _updateQueue() {
    // TODO: implement
  }

}


export interface IWorkflowState {
  kind: string;
  state: string;
  subState?: string;
  start?: number;
  stop?: number;
}
