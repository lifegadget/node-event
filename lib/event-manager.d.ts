/// <reference types="bluebird" />
import './common-types';
import WorkflowManager from './workflow-manager';
import PerformanceManager from './performance-manager';
import * as Promise from 'bluebird';
export default class EventManager {
    context: IDictionary<any>;
    tags: string[];
    componentType: 'frontend' | 'backend' | 'infrastructure' | 'other';
    private workflows;
    private perfMeasurements;
    private user;
    private tagId;
    private meta;
    private _networkOutput;
    private _consoleOutput;
    constructor(tagId?: string, tags?: string[]);
    userLogin(userId: string, userProps?: IDictionary<any>): void;
    app(name: string): this;
    architecture(arch: string): this;
    component(name: string): this;
    fn(name: string): this;
    consoleOutput(flag: boolean): this;
    networkOutput(flag: boolean): this;
    stackTrace(err: Error | null, incomingHash: IDictionary<any>): Promise<IDictionary<any>>;
    sendEvent(eventType: string): (hash: IDictionary<any>) => Promise<any>;
    createWorkflow(type: string, subType: string): WorkflowManager;
    createMeasurement(metric: string, options: IDictionary<any>): PerformanceManager;
    exit(): void;
    debug(message: string, options: IDictionary<any>): Promise<any>;
    info(message: string, options: IDictionary<any>): Promise<any>;
    warn(message: string, options: IDictionary<any>): Promise<any>;
    error(message: string, options: IDictionary<any>): Promise<any>;
    protected log(messageOrError: string | Error, hash?: IDictionary<any>): Promise<any>;
    protected addToHospital(err: any, event: IDictionary<any>): void;
}
