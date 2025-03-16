export interface Message {
  text: string;
  user: string;
  id: number;
}

export interface UserEvent {
  user: string;
  users: string[];
} 