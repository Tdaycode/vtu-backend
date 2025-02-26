import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Service } from 'typedi';

@Service()
export class HttpClient {
  constructor(private baseURL = '', private config = {} as AxiosRequestConfig) {}

  private async base<T>(method: string, url: string, body: any = {}, methodHeaders: { [key: string]: string | number | number } = {}) {
    this.config = {
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json', ...methodHeaders }
    };
    try {
      let response = {} as AxiosResponse<T>;
      switch (method) {
        case 'POST':
          if(methodHeaders["Content-Type"] !== 'application/x-www-form-urlencoded')
            body = JSON.stringify(body);
          response = await axios.post<T, AxiosResponse<T>>(`${url}`, body, this.config);
          break;
        case 'PUT':
          body = JSON.stringify(body);
          response = await axios.put<T, AxiosResponse<T>>(`${url}`, body, this.config);
          break;
        case 'PATCH':
          body = JSON.stringify(body);
          response = await axios.put<T, AxiosResponse<T>>(`${url}`, body, this.config);
          break;
        case 'DELETE':
          response = await axios.delete<T, AxiosResponse<T>>(`${url}`, this.config);
          break;
        default:
          // GET
          response = await axios.get<T, AxiosResponse<T>>(`${url}`, this.config);
          break;
      }
      return response.data;
    } catch (error: any) {
      console.log('HttpClient Error', error);
      throw Error(error.message);
    }
  }

  public async get<T>(url: string, header: { [key: string]: string | number } = {}): Promise<T> {
    const response = await this.base<T>('GET', url, {}, header);
    return response;
  }

  public async post<T>(url: string, data: any, header: { [key: string]: string | number } = {}): Promise<T> {
    const response = await this.base<T>('POST', url, data, header);
    return response;
  }

  public async put<T>(url: string, data: any, header: { [key: string]: string | number } = {}): Promise<T> {
    const response = await this.base<T>('PUT', url, data, header);
    return response;
  }

  public async patch<T>(url: string, data: any, header: { [key: string]: string | number } = {}): Promise<T> {
    const response = await this.base<T>('PATCH', url, data, header);
    return response;
  }

  public async delete<T>(url: string, data: any, header: { [key: string]: string | number } = {}): Promise<T> {
    const response = await this.base<T>('DELETE', url, data, header);
    return response;
  }
}
