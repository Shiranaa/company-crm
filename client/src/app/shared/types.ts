export interface User {
  id: string;
  username: string;
  name: string;
  token: string;
}

export interface Customer {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
}

export interface AddCustomer {
  name: string;
  phone: string;
  email: string;
}

export interface EditCustomer extends AddCustomer {
  id: string;
}

export type sortColumn = 'name' | 'email';

export interface CustomerSort {
  column: sortColumn;
  dirAsc: boolean;
}

export interface Login {
  email?: string | null;
  password?: string | null;
}

export interface RegisterUser {
  username?: string | null;
  email?: string | null;
  password?: string | null;
}
