import { Item } from "../../interfaces/item.interface";

export interface ItemState {
    items: Item[];
    error: string | null; 
  }