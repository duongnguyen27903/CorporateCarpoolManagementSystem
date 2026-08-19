export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  employeeId: number
  fullName: string
  role: string
}