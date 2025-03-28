
import { 
  WebhookConfig, 
  IndexingConfig, 
  DatabaseConfig,
  NFTBid,
  TokenPrice,
  SystemStatus
} from '@/types';

// Mock data service - in a real app this would connect to your backend
export const mockData = {
  webhooks: [
    {
      id: '1',
      name: 'NFT Bids Webhook',
      url: 'https://api.example.com/webhooks/nft-bids',
      apiKey: 'hel_1a2b3c4d5e6f7g8h9i0j',
      status: 'active',
      createdAt: '2023-06-15T10:30:00Z',
      lastTriggered: '2023-06-20T14:45:00Z',
      events: ['nft.bid', 'nft.listing']
    },
    {
      id: '2',
      name: 'Token Pricing Webhook',
      url: 'https://api.example.com/webhooks/token-prices',
      apiKey: 'hel_9i8h7g6f5e4d3c2b1a0',
      status: 'inactive',
      createdAt: '2023-05-10T08:15:00Z',
      events: ['token.price', 'token.swap']
    }
  ] as WebhookConfig[],
  
  indexingConfigs: [
    {
      id: '1',
      name: 'Popular NFT Collections',
      type: 'nft-bids',
      enabled: true,
      filters: {
        collections: ['DeGods', 'y00ts', 'Solana Monkey Business'],
        minBidAmount: 5
      },
      createdAt: '2023-06-01T10:30:00Z',
      lastIndexed: '2023-06-20T15:45:00Z'
    },
    {
      id: '2',
      name: 'DeFi Tokens',
      type: 'token-pricing',
      enabled: true,
      filters: {
        tokens: ['SOL', 'BONK', 'JTO', 'PYTH'],
        updateFrequency: 'hourly'
      },
      createdAt: '2023-05-15T09:45:00Z',
      lastIndexed: '2023-06-20T16:00:00Z'
    }
  ] as IndexingConfig[],
  
  databaseConfig: {
    host: 'postgres.example.com',
    port: 5432,
    username: 'blockstream_user',
    password: '********',
    database: 'blockstream_db',
    ssl: true,
    status: 'connected'
  } as DatabaseConfig,
  
  nftBids: [
    {
      id: '1',
      tokenAddress: 'DGOD5Lgv9EnxPpzMcuUNPAWEGS4JGwAqpvbqjTGMoF1j',
      bidAmount: 105.5,
      bidder: '8JUjWjmgxkSxd2jzjKTPPYYUpPYo16PNzUz1La3T14XM',
      marketplace: 'Magic Eden',
      timestamp: '2023-06-20T14:30:00Z'
    },
    {
      id: '2',
      tokenAddress: 'Y00T5SbsGFjG5ZQhCPin6zSSvU1mHk91z3UWFZdKJvM3',
      bidAmount: 78.2,
      bidder: '6KCQfqY5fT3QZd6YBBgXmP6FMBs9AsR4tAFQJ1zQzBD3',
      marketplace: 'Tensor',
      timestamp: '2023-06-20T13:15:00Z'
    },
    {
      id: '3',
      tokenAddress: 'DGOD5Lgv9EnxPpzMcuUNPAWEGS4JGwAqpvbqjTGMoF1j',
      bidAmount: 104.8,
      bidder: '9YQFFbMNRYJHRx9mS8SHJrEPVsQvRQkwXGHhBSuMrjJY',
      marketplace: 'Magic Eden',
      timestamp: '2023-06-20T12:45:00Z'
    }
  ] as NFTBid[],
  
  tokenPrices: [
    {
      id: '1',
      symbol: 'SOL',
      name: 'Solana',
      address: 'So11111111111111111111111111111111111111112',
      price: 68.42,
      priceChange24h: 5.2,
      volume24h: 1254897654,
      lastUpdated: '2023-06-20T16:05:00Z'
    },
    {
      id: '2',
      symbol: 'BONK',
      name: 'Bonk',
      address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      price: 0.0000124,
      priceChange24h: -2.3,
      volume24h: 89654123,
      lastUpdated: '2023-06-20T16:02:00Z'
    },
    {
      id: '3',
      symbol: 'JTO',
      name: 'Jito',
      address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
      price: 2.14,
      priceChange24h: 0.8,
      volume24h: 32541789,
      lastUpdated: '2023-06-20T16:00:00Z'
    }
  ] as TokenPrice[],
  
  systemStatus: {
    webhooksActive: 1,
    indexersRunning: 2,
    dbConnected: true,
    lastEvent: '2023-06-20T15:45:00Z',
    uptime: 685412 // seconds
  } as SystemStatus
};

// API Service methods
export const apiService = {
  // Webhook API
  getWebhooks: async (): Promise<WebhookConfig[]> => {
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.webhooks), 500);
    });
  },
  
  createWebhook: async (webhook: Omit<WebhookConfig, 'id' | 'createdAt'>): Promise<WebhookConfig> => {
    const newWebhook: WebhookConfig = {
      ...webhook,
      id: `wh_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // In a real app, this would send the data to your backend
    return new Promise((resolve) => {
      setTimeout(() => resolve(newWebhook), 700);
    });
  },
  
  // Indexing API
  getIndexingConfigs: async (): Promise<IndexingConfig[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.indexingConfigs), 500);
    });
  },
  
  createIndexingConfig: async (config: Omit<IndexingConfig, 'id' | 'createdAt'>): Promise<IndexingConfig> => {
    const newConfig: IndexingConfig = {
      ...config,
      id: `idx_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newConfig), 700);
    });
  },
  
  // Database API
  getDatabaseConfig: async (): Promise<DatabaseConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.databaseConfig), 300);
    });
  },
  
  updateDatabaseConfig: async (config: Partial<DatabaseConfig>): Promise<DatabaseConfig> => {
    const updatedConfig = { ...mockData.databaseConfig, ...config };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedConfig), 500);
    });
  },
  
  // Data API
  getNFTBids: async (): Promise<NFTBid[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.nftBids), 600);
    });
  },
  
  getTokenPrices: async (): Promise<TokenPrice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.tokenPrices), 600);
    });
  },
  
  // System API
  getSystemStatus: async (): Promise<SystemStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData.systemStatus), 400);
    });
  }
};
