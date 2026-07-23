/**
 * Tipe-tipe bersama di layer domain. Layer ini TIDAK BOLEH bergantung pada
 * axios, Vue, Pinia, atau apapun di luar TypeScript murni — supaya domain
 * tetap independen dari framework/infrastructure (aturan inti clean
 * architecture: dependency mengarah ke dalam, domain adalah lingkaran
 * paling dalam).
 */

/**
 * Representasi generik dari amplop response backend:
 * { success, message, data }
 * Dipakai HANYA di infrastructure/http saat unwrap response — bukan
 * dikembalikan ke use case/store, supaya presentation tidak perlu tahu
 * bentuk mentah response HTTP backend.
 */
export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

/**
 * Error domain yang dilempar oleh repository ketika request gagal.
 * Membungkus pesan dari backend (dto.Error) + status HTTP asli, supaya
 * presentation layer bisa menampilkan pesan yang relevan tanpa perlu tahu
 * detail axios/fetch.
 */
export class DomainError extends Error {
  public readonly statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'DomainError'
    this.statusCode = statusCode
  }
}

export type ID = number
