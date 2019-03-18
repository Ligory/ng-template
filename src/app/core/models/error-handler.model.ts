export type MessageType = 'I' | 'E' | 'W' | 'S';

export class ErrorObject {
  type?: MessageType;
  errorTitle: string;
  errorDescription?: string;
  constructor(init?: Partial<ErrorObject>) {
    Object.assign(this, init);
  }
}

class GatewayError {
  error: { message: GatewayErrorMessage };
}

interface GatewayErrorMessage {
  lang: string;
  value: string;
}

interface SAPAdditionalMessage {
  code: string;
  message: string;
  severity: 'info' | 'success' | 'warn';
  target: string;
}

export interface SAPAdditionalMessages extends SAPAdditionalMessage {
  details: SAPAdditionalMessage[];
}
