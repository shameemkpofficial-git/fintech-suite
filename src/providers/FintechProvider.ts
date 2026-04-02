export interface FintechProvider {
  login(phone: string): Promise<{ token: string }>;
  getBalance(): Promise<number>;
  sendMoney(amount: number, to: string): Promise<boolean>;
}
