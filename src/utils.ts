import * as _ from 'lodash';

export function createError(code: string, message?: string) {
  this.code = code;
  this.message = message || '';
}
createError.prototype = Object.create(Error.prototype);
createError.prototype.constructor = createError;

/**
 * Convenience function to return a value back to API Gateway
 */
export function gatewayResponse(
    statusCode: number,
    body: string,
    headers: IDictionary<string> = {}
  ): IGatewayResponse {
  const defaultHeaders = {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin': '*'
  };
  return {
    statusCode,
    body,
    headers: _.assign(defaultHeaders, headers),
  }
}
