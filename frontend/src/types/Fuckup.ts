export interface Fuckup {
  id: string;
  user: string;
  desc: string;
  likes: number;
}

export interface AddFuckupRequest {
  user: string;
  desc: string;
} 