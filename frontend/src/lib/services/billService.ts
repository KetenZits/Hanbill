// API service for bills
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  price: number;
  paidBy: string;
  splitBetween: string[];
}

export interface Bill {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  participants: Participant[];
  items: BillItem[];
  createdAt: string;
}

export interface ShareCalculation {
  paid: number;
  owes: number;
  net: number;
}

export interface BillWithShares extends Bill {
  shares: Record<string, ShareCalculation>;
}

class BillService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createBill(billData: {
    name: string;
    description: string;
    participants: Participant[];
    items: BillItem[];
  }): Promise<number> {
    try {
      const response = await axios.post(`${API_URL}/bills`, billData, {
        headers: this.getAuthHeader()
      });
      return response.data.bill_id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBill(id: number): Promise<BillWithShares> {
    try {
      const response = await axios.get(`${API_URL}/bills/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBills(): Promise<Bill[]> {
    try {
      const response = await axios.get(`${API_URL}/bills`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteBill(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/bills/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred';
      return new Error(message);
    }
    return error;
  }

  async updateBill(id: number, billData: {
    title: string;  // เดิม name → แก้เป็น title
    description: string;
    participants: Participant[];
    items: BillItem[];
  }): Promise<void> {
    try {
      await axios.put(`${API_URL}/bills/${id}`, billData, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const billService = new BillService();
