
// Webhook Types
export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  lastTriggered?: string;
  events: WebhookEventType[];
}

export type WebhookEventType = 
  | 'nft.bid'
  | 'nft.listing'
  | 'nft.sale'
  | 'token.transfer'
  | 'token.swap'
  | 'token.price';

// Indexing Types
export interface IndexingConfig {
  id: string;
  name: string;
  type: IndexingType;
  enabled: boolean;
  filters: Record<string, any>;
  createdAt: string;
  lastIndexed?: string;
}

export type IndexingType = 
  | 'nft-bids'
  | 'nft-listings'
  | 'token-pricing'
  | 'token-lending';

// Database Configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

// Data Types
export interface NFTBid {
  id: string;
  tokenAddress: string;
  bidAmount: number;
  bidder: string;
  marketplace: string;
  timestamp: string;
}

export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  address: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  lastUpdated: string;
}

// System Status
export interface SystemStatus {
  webhooksActive: number;
  indexersRunning: number;
  dbConnected: boolean;
  lastEvent: string;
  uptime: number;
}
