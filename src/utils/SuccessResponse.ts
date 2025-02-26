export class SuccessResponse {
  message: string;
  statusCode: number;
  data: any;

  constructor(data: any, message = 'Successful', statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
