export interface INotificationItem {
  id: number;
  content: string;
  device_token: string;
}

export interface IFirebaseRequireItem {
  content: string;
  tokens: string[];
}
