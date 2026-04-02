export interface Transaction {
  id: string;
  amount: number;
  to: string;
  category: string;
  date: string;
  type: 'incoming' | 'outgoing';
}

export interface FintechProvider {
  login(phone: string): Promise<{ token: string }>;
  getBalance(): Promise<number>;
  sendMoney(amount: number, to: string): Promise<boolean>;
  getTransactions(): Promise<Transaction[]>;
}
