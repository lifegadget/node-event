export declare function createError(code: string, message?: string): void;
export declare function gatewayResponse(statusCode: number, body: string, headers?: IDictionary<string>): IGatewayResponse;
export declare function without(dict: IDictionary<any>, ...without: string[]): {} & IDictionary<any>;
export declare function padLeft(width: number, value: any, padding?: string): string;
