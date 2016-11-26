import './common-types';
export default class WorkflowManager {
    id: string;
    uid: string;
    startTime: number;
    stopTime: number;
    type: string;
    subType: string;
    timeout: number;
    private states;
    constructor(type: string, subType: string);
    action(name: string, options: IDictionary<any>): void;
    navigate(route: string, options: IDictionary<any>): void;
    readonly isCompleted: boolean;
    addState(state: IWorkflowState): void;
    private _updateQueue();
}
export interface IWorkflowState {
    kind: string;
    state: string;
    subState?: string;
    start?: number;
    stop?: number;
}
