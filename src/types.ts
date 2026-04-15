export type UserRole = 'admin' | 'mediator' | 'client';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
}

export type DisputeStatus = 'pending_payment' | 'under_review' | 'resolved' | 'closed';

export interface Dispute {
  id: string;
  applicant: {
    name: string;
    phone: string;
    email: string;
    role: 'owner' | 'tenant';
  };
  secondParty?: {
    name: string;
    phone: string;
    email: string;
  };
  details: {
    type: 'price_increase' | 'eviction' | 'maintenance' | 'payment_delay' | 'other';
    description: string;
    monthlyRent: number;
    address: string;
    documentUrl?: string;
  };
  status: DisputeStatus;
  paymentStatus: 'unpaid' | 'paid';
  mediatorId?: string;
  decision?: {
    text: string;
    fileUrl?: string;
    createdAt: any;
  };
  createdAt: any;
}

export interface Message {
  id: string;
  disputeId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
}
