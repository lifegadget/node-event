interface IDictionary<T> {
  [key: string]: T;
}

interface IGatewayResponse {
  statusCode: Number;
  headers?: IDictionary<String>;

  body?: string;
  error?: string;
}
