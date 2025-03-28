
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { apiService } from '@/services/api';
import { SystemStatus, WebhookConfig, IndexingConfig } from '@/types';
import { 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Database as DatabaseIcon, 
  Server, 
  Webhook 
} from 'lucide-react';

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const Index = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [indexingConfigs, setIndexingConfigs] = useState<IndexingConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statusData, webhooksData, indexingData] = await Promise.all([
          apiService.getSystemStatus(),
          apiService.getWebhooks(),
          apiService.getIndexingConfigs()
        ]);
        
        setStatus(statusData);
        setWebhooks(webhooksData);
        setIndexingConfigs(indexingData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your Blockstream Connector and manage your webhooks
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Webhook className="mr-2 h-4 w-4 text-primary" /> Active Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '-' : status?.webhooksActive}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {webhooks.filter(w => w.status === 'active').length} of {webhooks.length} configured
              </p>
              <Progress 
                className="h-1 mt-2" 
                value={loading ? 0 : (webhooks.length > 0 ? (webhooks.filter(w => w.status === 'active').length / webhooks.length) * 100 : 0)} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="mr-2 h-4 w-4 text-primary" /> Indexers Running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '-' : status?.indexersRunning}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {indexingConfigs.filter(i => i.enabled).length} of {indexingConfigs.length} enabled
              </p>
              <Progress 
                className="h-1 mt-2" 
                value={loading ? 0 : (indexingConfigs.length > 0 ? (indexingConfigs.filter(i => i.enabled).length / indexingConfigs.length) * 100 : 0)} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <DatabaseIcon className="mr-2 h-4 w-4 text-primary" /> Database Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {loading ? '-' : (status?.dbConnected ? 
                  <span className="text-green-500">Connected</span> : 
                  <span className="text-red-500">Disconnected</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                PostgreSQL database
              </p>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${status?.dbConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs">{loading ? '-' : status?.dbConnected ? 'Healthy' : 'Error'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" /> System Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '-' : formatUptime(status?.uptime || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last event: {loading ? '-' : status?.lastEvent ? formatDate(status.lastEvent) : 'N/A'}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 rounded-full mr-2 bg-green-500 animate-pulse"></div>
                <span className="text-xs">System active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="webhooks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="indexers">Indexers</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Loading webhook data...</p>
                  </div>
                ) : webhooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No webhooks configured yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Go to the Webhooks section to set up your first webhook
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">URL</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Last Triggered</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Events</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webhooks.map((webhook) => (
                          <tr key={webhook.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="py-3">{webhook.name}</td>
                            <td className="py-3 text-sm text-muted-foreground">{webhook.url}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                webhook.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                webhook.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-red-500/20 text-red-500'
                              }`}>
                                {webhook.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {webhook.lastTriggered ? formatDate(webhook.lastTriggered) : 'Never'}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {webhook.events.map((event) => (
                                  <span key={event} className="px-2 py-1 bg-accent rounded-full text-xs">
                                    {event}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="indexers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Indexers</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Loading indexer data...</p>
                  </div>
                ) : indexingConfigs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <Server className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No indexers configured yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Go to the Indexing Config section to set up your first indexer
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Last Indexed</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Filters</th>
                        </tr>
                      </thead>
                      <tbody>
                        {indexingConfigs.map((config) => (
                          <tr key={config.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="py-3">{config.name}</td>
                            <td className="py-3 text-sm">{config.type}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                config.enabled ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {config.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {config.lastIndexed ? formatDate(config.lastIndexed) : 'Never'}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {Object.keys(config.filters).map((key) => (
                                  <span key={key} className="px-2 py-1 bg-accent rounded-full text-xs">
                                    {key}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/50 rounded-md p-3 font-mono text-xs h-[300px] overflow-y-auto">
                  <div className="text-green-400">[2023-06-20 16:05:00] [INFO] System started successfully</div>
                  <div className="text-muted-foreground">[2023-06-20 16:05:01] [INFO] Connecting to database...</div>
                  <div className="text-green-400">[2023-06-20 16:05:02] [INFO] Database connection established</div>
                  <div className="text-muted-foreground">[2023-06-20 16:05:03] [INFO] Loading webhook configurations...</div>
                  <div className="text-green-400">[2023-06-20 16:05:04] [INFO] Loaded 2 webhook configurations</div>
                  <div className="text-blue-400">[2023-06-20 16:05:05] [DEBUG] Initializing indexers...</div>
                  <div className="text-green-400">[2023-06-20 16:05:06] [INFO] Started 2 indexers</div>
                  <div className="text-yellow-400">[2023-06-20 16:10:23] [WARN] Rate limit approaching for API key: hel_1a2b3c4d5e6f7g8h9i0j</div>
                  <div className="text-blue-400">[2023-06-20 16:15:45] [DEBUG] Processing webhook: NFT Bids Webhook</div>
                  <div className="text-muted-foreground">[2023-06-20 16:15:46] [INFO] Received NFT bid event for DeGods #5839</div>
                  <div className="text-green-400">[2023-06-20 16:15:47] [INFO] Successfully processed and stored NFT bid</div>
                  <div className="text-blue-400">[2023-06-20 16:20:12] [DEBUG] Updating token prices...</div>
                  <div className="text-green-400">[2023-06-20 16:20:15] [INFO] Updated prices for 3 tokens</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure your first webhook to start receiving blockchain events
              </p>
              <a href="/webhooks" className="text-primary text-sm flex items-center hover:underline">
                Set up Helius webhooks <ArrowUpRight className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to use the Blockstream Connector and integrate with Helius
              </p>
              <a href="https://docs.helius.xyz/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center hover:underline">
                View Helius docs <ArrowUpRight className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Got questions or need assistance with your integration?
              </p>
              <a href="#" className="text-primary text-sm flex items-center hover:underline">
                Contact support <ArrowUpRight className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
