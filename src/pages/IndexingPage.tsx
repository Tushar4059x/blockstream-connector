
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndexingConfig, IndexingType } from '@/types';
import { apiService } from '@/services/api';
import { 
  BarChart3, 
  Clock, 
  Coins, 
  Database as DatabaseIcon, 
  Filter, 
  Image, 
  MessageSquare, 
  Plus, 
  RefreshCw, 
  Settings, 
  Sliders, 
  ThumbsUp
} from 'lucide-react';

const IndexingPage = () => {
  const { toast } = useToast();
  const [indexingConfigs, setIndexingConfigs] = useState<IndexingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<IndexingType>('nft-bids');
  const [filters, setFilters] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  useEffect(() => {
    fetchConfigs();
  }, []);
  
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getIndexingConfigs();
      setIndexingConfigs(data);
    } catch (error) {
      console.error('Error fetching indexing configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load indexing configurations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    let parsedFilters: Record<string, any> = {};
    try {
      // Try to parse filters as JSON if provided
      if (filters) {
        parsedFilters = JSON.parse(filters);
      } else {
        // Default filters based on type
        switch (type) {
          case 'nft-bids':
            parsedFilters = {
              collections: ['DeGods', 'y00ts'],
              minBidAmount: 1
            };
            break;
          case 'token-pricing':
            parsedFilters = {
              tokens: ['SOL', 'BONK', 'JTO'],
              updateFrequency: 'hourly'
            };
            break;
          default:
            parsedFilters = {};
        }
      }
    } catch (error) {
      toast({
        title: 'Invalid Filters',
        description: 'Please enter valid JSON for the filters or leave it empty for defaults.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setFormLoading(true);
      
      const newConfig = await apiService.createIndexingConfig({
        name,
        type,
        enabled: true,
        filters: parsedFilters
      });
      
      setIndexingConfigs([...indexingConfigs, newConfig]);
      
      toast({
        title: 'Success',
        description: 'Indexing configuration created successfully!'
      });
      
      // Reset form
      setName('');
      setType('nft-bids');
      setFilters('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating indexing config:', error);
      toast({
        title: 'Error',
        description: 'Failed to create indexing configuration. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const toggleIndexer = (id: string) => {
    setIndexingConfigs(
      indexingConfigs.map(config => 
        config.id === id ? { ...config, enabled: !config.enabled } : config
      )
    );
    
    toast({
      title: 'Status Updated',
      description: `Indexer ${indexingConfigs.find(c => c.id === id)?.enabled ? 'disabled' : 'enabled'} successfully.`
    });
  };
  
  const getTypeIcon = (type: IndexingType) => {
    switch (type) {
      case 'nft-bids':
        return <ThumbsUp className="h-5 w-5 text-blue-500" />;
      case 'nft-listings':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'token-pricing':
        return <Coins className="h-5 w-5 text-green-500" />;
      case 'token-lending':
        return <BarChart3 className="h-5 w-5 text-orange-500" />;
      default:
        return <Sliders className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Indexing Configuration</h1>
            <p className="text-muted-foreground mt-1">
              Configure blockchain data indexing for your application
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Indexer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[575px]">
              <DialogHeader>
                <DialogTitle>Create New Indexer</DialogTitle>
                <DialogDescription>
                  Configure a new blockchain data indexer
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Indexer Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., Top NFT Collections"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Indexer Type</Label>
                    <Select
                      value={type}
                      onValueChange={(value) => setType(value as IndexingType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select indexer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nft-bids">NFT Bids</SelectItem>
                        <SelectItem value="nft-listings">NFT Listings</SelectItem>
                        <SelectItem value="token-pricing">Token Pricing</SelectItem>
                        <SelectItem value="token-lending">Token Lending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="filters">Filters (JSON)</Label>
                    <Input
                      id="filters"
                      value={filters}
                      onChange={(e) => setFilters(e.target.value)}
                      placeholder='{"collections": ["DeGods"], "minBidAmount": 1}'
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Enter JSON filters or leave empty for defaults
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Indexer'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Indexers</TabsTrigger>
            <TabsTrigger value="nft">NFT Data</TabsTrigger>
            <TabsTrigger value="token">Token Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">Loading indexing configurations...</p>
              </div>
            ) : indexingConfigs.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sliders className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No indexers configured</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                    Set up indexers to track and store specific blockchain data like NFT bids, token prices, and more.
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Indexer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {indexingConfigs.map((config) => (
                  <Card key={config.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(config.type)}
                          <div>
                            <CardTitle>{config.name}</CardTitle>
                            <CardDescription className="mt-1">
                              Type: {config.type}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={() => toggleIndexer(config.id)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {config.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-3 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium mb-1">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            Filters
                          </div>
                          <div className="bg-secondary rounded-md p-2 text-xs overflow-x-auto">
                            <pre>{JSON.stringify(config.filters, null, 2)}</pre>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Last indexed: {config.lastIndexed ? new Date(config.lastIndexed).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(config.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-3.5 w-3.5 mr-1" />
                          View Data
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nft" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">Loading NFT indexers...</p>
              </div>
            ) : indexingConfigs.filter(c => c.type.startsWith('nft')).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Image className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No NFT indexers configured</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                    Set up indexers to track NFT marketplace activity like bids, listings, and sales.
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create NFT Indexer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indexingConfigs
                  .filter(c => c.type.startsWith('nft'))
                  .map((config) => (
                    <Card key={config.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(config.type)}
                            <div>
                              <CardTitle>{config.name}</CardTitle>
                              <CardDescription className="mt-1">
                                Type: {config.type}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={() => toggleIndexer(config.id)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {config.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-3 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium mb-1">
                              <Filter className="h-4 w-4 text-muted-foreground" />
                              Filters
                            </div>
                            <div className="bg-secondary rounded-md p-2 text-xs overflow-x-auto">
                              <pre>{JSON.stringify(config.filters, null, 2)}</pre>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Last indexed: {config.lastIndexed ? new Date(config.lastIndexed).toLocaleString() : 'Never'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(config.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3.5 w-3.5 mr-1" />
                            View Data
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="token" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">Loading token indexers...</p>
              </div>
            ) : indexingConfigs.filter(c => c.type.startsWith('token')).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Coins className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No token indexers configured</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                    Set up indexers to track token data like prices, transfers, and swaps.
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Token Indexer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indexingConfigs
                  .filter(c => c.type.startsWith('token'))
                  .map((config) => (
                    <Card key={config.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(config.type)}
                            <div>
                              <CardTitle>{config.name}</CardTitle>
                              <CardDescription className="mt-1">
                                Type: {config.type}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={() => toggleIndexer(config.id)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {config.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mt-3 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium mb-1">
                              <Filter className="h-4 w-4 text-muted-foreground" />
                              Filters
                            </div>
                            <div className="bg-secondary rounded-md p-2 text-xs overflow-x-auto">
                              <pre>{JSON.stringify(config.filters, null, 2)}</pre>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Last indexed: {config.lastIndexed ? new Date(config.lastIndexed).toLocaleString() : 'Never'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(config.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3.5 w-3.5 mr-1" />
                            View Data
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Indexing</CardTitle>
            <CardDescription>
              Customize indexing behavior with advanced settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-secondary rounded-md p-2 flex items-center justify-center">
                  <DatabaseIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Data Retention</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure how long indexed data is stored in the database
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-secondary rounded-md p-2 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Backfill Options</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure options for historical data backfilling
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-secondary rounded-md p-2 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Scheduling</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set custom schedules for indexing tasks
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-secondary rounded-md p-2 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Notifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure alerts for indexing errors or milestones
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IndexingPage;
