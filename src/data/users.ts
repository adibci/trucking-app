export type UserRole = 'operator' | 'admin'
export type ApprovalStatus = 'approved' | 'pending' | 'rejected'

export interface User {
  email: string
  role: UserRole
  approvalStatus?: ApprovalStatus
}

interface Account {
  email: string
  password: string
  role: UserRole
  approvalStatus?: ApprovalStatus
}

// Hardcoded accounts — satu akun per tampilan
export const ACCOUNTS: Account[] = [
  { email: 'approved@mail.com', password: '123', role: 'operator', approvalStatus: 'approved' },
  { email: 'pending@mail.com',  password: '123', role: 'operator', approvalStatus: 'pending'  },
  { email: 'rejected@mail.com', password: '123', role: 'operator', approvalStatus: 'rejected' },
  { email: 'admin@mail.com',    password: '123', role: 'admin' },
]

export function validateLogin(email: string, password: string): User | null {
  const account = ACCOUNTS.find(a => a.email === email && a.password === password)
  if (!account) return null
  return { email: account.email, role: account.role, approvalStatus: account.approvalStatus }
}
