import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export abstract class BaseService {
  protected readonly http: AxiosInstance;

  protected constructor(baseURL: string) {
    this.http = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.http.interceptors.request.use(
      (config) => {
        // Можно добавить токены авторизации и т.д.
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error(`API Error [${error.config?.url}]:`, error);
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.put<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }
}