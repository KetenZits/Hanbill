export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
}

export interface Bill {
  id: number;
  title: string;
  owner_id: number;
  participants: User[];
  items: Item[];
}

export interface Item {
  id: number;
  name: string;
  price: number;
  payer_id: number;
  split_type: "equal" | "custom";
  participants: ItemParticipant[];
}

export interface ItemParticipant {
  id: number;
  user_id: number;
  amount?: number;
}
