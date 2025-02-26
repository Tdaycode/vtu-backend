export interface SendVERIFICATIONOTPResponse {
  message: string;
  code: string;
  status: SendchampStatus;
  data: SendVERIFICATIONOTPResponseData;
}

enum SendchampStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

interface SendVERIFICATIONOTPResponseData {
  business_uid: string;
  reference: string;
  channel: {
      id: number;
      name: string;
      is_active: boolean;
  };
  token?: string;
  status: string;
}


