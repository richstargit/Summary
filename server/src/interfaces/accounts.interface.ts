export interface Account {
  username: string;
  password: string;
  email: string;
  role: number;
  banned: boolean;
  locked: boolean;
  warning?: string;
}

export interface CreateAccount {
  username: string;
  password: string;
  email: string;
}
