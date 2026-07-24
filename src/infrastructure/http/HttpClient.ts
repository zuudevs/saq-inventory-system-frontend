import axios, { AxiosError, type AxiosInstance } from 'axios'
import { DomainError, type ApiEnvelope } from '@/domain/entities/common'

/**
 * Satu-satunya tempat di seluruh aplikasi yang tahu tentang axios dan
 * bentuk mentah response backend (dto.Response[T] Go: {success, message,
 * data}). Semua repository di infrastructure/repositories memakai client
 * ini, tidak pernah memanggil axios langsung.
 */
export class HttpClient {
  private readonly axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return this.unwrap(this.axiosInstance.get<ApiEnvelope<T>>(url, { params }))
  }

  async post<T>(url: string, body?: unknown): Promise<T> {
    return this.unwrap(this.axiosInstance.post<ApiEnvelope<T>>(url, body))
  }

  async getBlob(url: string): Promise<Blob> {
    try {
      const response = await this.axiosInstance.get<Blob>(url, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw this.toDomainError(error)
    }
  }

  async postForm<T>(url: string, form: FormData): Promise<T> {
    return this.unwrap(
      this.axiosInstance.post<ApiEnvelope<T>>(url, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  }

  async put<T>(url: string, body?: unknown): Promise<T> {
    return this.unwrap(this.axiosInstance.put<ApiEnvelope<T>>(url, body))
  }

  async delete<T>(url: string): Promise<T> {
    return this.unwrap(this.axiosInstance.delete<ApiEnvelope<T>>(url))
  }

  private async unwrap<T>(
    promise: Promise<{ data: ApiEnvelope<T> }>,
  ): Promise<T> {
    try {
      const response = await promise
      return response.data.data
    } catch (error) {
      throw this.toDomainError(error)
    }
  }

  private toDomainError(error: unknown): DomainError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiEnvelope<unknown>>
      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Terjadi kesalahan yang tidak diketahui'

      return new DomainError(message, axiosError.response?.status)
    }

    return new DomainError('Terjadi kesalahan yang tidak diketahui')
  }
}

export const httpClient = new HttpClient(
  import.meta.env.VITE_API_BASE_URL || '/api',
)
