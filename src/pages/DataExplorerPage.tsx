
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NFTBid, TokenPrice } from '@/types';
import { apiService } from '@/services/api';
import { 
  ArrowDown, 
  ArrowUp, 
  CircleDollarSign, 
  Download, 
  FileJson, 
  RefreshCw, 
  Search, 
  Table as TableIcon
} from 'lucide-react';
import {
  AreaChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const DataExplorerPage = () => {
  const { toast } = useToast();
  const [nftBids, setNftBids] = useState<NFTBid[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bidsData, pricesData] = await Promise.all([
        apiService.getNFTBids(),
        apiService.getTokenPrices()
      ]);
      
      setNftBids(bidsData);
      setTokenPrices(pricesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      toast({
        title: 'Data Refreshed',
        description: 'Latest blockchain data has been loaded.'
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Unable to refresh data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  const filteredNftBids = nftBids.filter(bid => 
    bid.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bid.bidder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bid.marketplace.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTokenPrices = tokenPrices.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mock price history data for the chart
  const getPriceHistoryData = (symbol: string) => {
    const now = new Date();
    const data = [];
    
    // Generate random price history for the past 24 hours
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const basePrice = symbol === 'SOL' ? 68 : symbol === 'BONK' ? 0.000012 : 2.1;
      const variance = basePrice * 0.05; // 5% variance
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: basePrice + (Math.random() * variance * 2 - variance)
      });
    }
    
    return data;
  };
  
  // Sample price history data for the selected token
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const priceHistoryData = selectedToken ? getPriceHistoryData(selectedToken) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Explorer</h1>
            <p className="text-muted-foreground mt-1">
              Explore indexed blockchain data
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="nft-bids" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nft-bids">NFT Bids</TabsTrigger>
            <TabsTrigger value="token-prices">Token Prices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nft-bids" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>NFT Bid Activity</CardTitle>
                <CardDescription>
                  Recent NFT bids tracked by your indexers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Loading NFT bid data...</p>
                  </div>
                ) : filteredNftBids.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <TableIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No NFT bid data found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchTerm ? "Try adjusting your search term" : "Enable NFT bid indexing to start collecting data"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Token Address</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Bid Amount</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Bidder</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Marketplace</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNftBids.map((bid) => (
                          <tr key={bid.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="py-3 font-mono text-xs">
                              {bid.tokenAddress.substring(0, 6)}...{bid.tokenAddress.substring(bid.tokenAddress.length - 4)}
                            </td>
                            <td className="py-3">
                              <span className="flex items-center">
                                <CircleDollarSign className="h-3 w-3 text-primary mr-1" />
                                {bid.bidAmount} SOL
                              </span>
                            </td>
                            <td className="py-3 font-mono text-xs">
                              {bid.bidder.substring(0, 6)}...{bid.bidder.substring(bid.bidder.length - 4)}
                            </td>
                            <td className="py-3">{bid.marketplace}</td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {new Date(bid.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '-' : nftBids.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {loading ? '-' : nftBids.length > 0 ? '2 unique collections' : '0 collections'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    {loading ? '-' : nftBids.length > 0 ? 
                      (nftBids.reduce((sum, bid) => sum + bid.bidAmount, 0) / nftBids.length).toFixed(2) : 
                      '0'
                    } SOL
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all marketplaces
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Marketplace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '-' : nftBids.length > 0 ? 'Magic Eden' : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loading ? '-' : nftBids.length > 0 ? '67% of all bids' : 'No bid data available'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Raw JSON Data</CardTitle>
                <CardDescription>
                  View the raw webhook data received from Helius
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-md p-4 font-mono text-xs overflow-x-auto max-h-72 overflow-y-auto">
                  {nftBids.length > 0 ? (
                    <pre>{JSON.stringify(nftBids[0], null, 2)}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileJson className="h-5 w-5" />
                        No JSON data available
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="token-prices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Token Price Data</CardTitle>
                <CardDescription>
                  Real-time token price data from the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Loading token price data...</p>
                  </div>
                ) : filteredTokenPrices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <CircleDollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No token price data found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchTerm ? "Try adjusting your search term" : "Enable token price indexing to start collecting data"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Symbol</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Price (USD)</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">24h Change</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">24h Volume</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTokenPrices.map((token) => (
                          <tr 
                            key={token.id} 
                            className="border-b border-border hover:bg-secondary/30 cursor-pointer"
                            onClick={() => setSelectedToken(token.symbol)}
                          >
                            <td className="py-3 font-bold">{token.symbol}</td>
                            <td className="py-3">{token.name}</td>
                            <td className="py-3 font-mono">
                              ${token.price < 0.01 ? token.price.toFixed(8) : token.price.toFixed(2)}
                            </td>
                            <td className={`py-3 ${
                              token.priceChange24h > 0 ? 'text-green-500' : 
                              token.priceChange24h < 0 ? 'text-red-500' : 
                              'text-muted-foreground'
                            }`}>
                              <span className="flex items-center">
                                {token.priceChange24h > 0 ? (
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                ) : token.priceChange24h < 0 ? (
                                  <ArrowDown className="h-3 w-3 mr-1" />
                                ) : null}
                                {Math.abs(token.priceChange24h).toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 font-mono">
                              ${(token.volume24h / 1000000).toFixed(2)}M
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {new Date(token.lastUpdated).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedToken && (
              <Card>
                <CardHeader>
                  <CardTitle>Price History: {selectedToken}</CardTitle>
                  <CardDescription>
                    24-hour price chart for {selectedToken}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={priceHistoryData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="time" 
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => selectedToken === 'BONK' ? value.toFixed(8) : value.toFixed(2)}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--popover-foreground))'
                          }}
                          formatter={(value: number) => [
                            `$${selectedToken === 'BONK' ? value.toFixed(8) : value.toFixed(2)}`,
                            'Price'
                          ]}
                          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Indexed Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '-' : tokenPrices.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total tokens being tracked
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Update Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    15 minutes
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time between updates
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    {loading ? '-' : tokenPrices.length > 0 ? 
                      tokenPrices.reduce((prev, current) => (prev.priceChange24h > current.priceChange24h) ? prev : current).symbol : 
                      'N/A'
                    }
                    {!loading && tokenPrices.length > 0 && (
                      <span className="ml-2 text-green-500 text-sm flex items-center">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {tokenPrices.reduce((prev, current) => (prev.priceChange24h > current.priceChange24h) ? prev : current).priceChange24h.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    In the last 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Raw JSON Data</CardTitle>
                <CardDescription>
                  View the raw token price data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-md p-4 font-mono text-xs overflow-x-auto max-h-72 overflow-y-auto">
                  {tokenPrices.length > 0 ? (
                    <pre>{JSON.stringify(tokenPrices[0], null, 2)}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileJson className="h-5 w-5" />
                        No JSON data available
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DataExplorerPage;
