
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { WebhookConfig, WebhookEventType } from '@/types';
import { apiService } from '@/services/api';
import { AlertCircle, Clipboard, Code, Plus, RefreshCw, Trash2, Webhook } from 'lucide-react';

const WebhooksPage = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New webhook form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  
  const availableEvents: { value: WebhookEventType; label: string }[] = [
    { value: 'nft.bid', label: 'NFT Bids' },
    { value: 'nft.listing', label: 'NFT Listings' },
    { value: 'nft.sale', label: 'NFT Sales' },
    { value: 'token.transfer', label: 'Token Transfers' },
    { value: 'token.swap', label: 'Token Swaps' },
    { value: 'token.price', label: 'Token Price Updates' }
  ];
  
  useEffect(() => {
    fetchWebhooks();
  }, []);
  
  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load webhooks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !url || !apiKey || selectedEvents.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all fields and select at least one event type.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setFormLoading(true);
      
      const newWebhook = await apiService.createWebhook({
        name,
        url,
        apiKey,
        events: selectedEvents,
        status: 'active'
      });
      
      setWebhooks([...webhooks, newWebhook]);
      
      toast({
        title: 'Success',
        description: 'Webhook created successfully!'
      });
      
      // Reset form
      setName('');
      setUrl('');
      setApiKey('');
      setSelectedEvents([]);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating webhook:', error);
      toast({
        title: 'Error',
        description: 'Failed to create webhook. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleEventToggle = (event: WebhookEventType) => {
    setSelectedEvents(
      selectedEvents.includes(event)
        ? selectedEvents.filter(e => e !== event)
        : [...selectedEvents, event]
    );
  };
  
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'error':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
            <p className="text-muted-foreground mt-1">
              Configure and manage your Helius webhook integrations
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[575px]">
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>
                  Set up a new Helius webhook to receive blockchain events
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Webhook Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., NFT Marketplace Tracker"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="url">Webhook URL</Label>
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-api.example.com/webhook"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is the endpoint where Helius will send event data
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="apiKey">Helius API Key</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="hel_..."
                    />
                    <p className="text-xs text-muted-foreground">
                      You can get this from your Helius dashboard
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Event Types</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select the blockchain events you want to receive
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {availableEvents.map((event) => (
                        <div key={event.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={event.value}
                            checked={selectedEvents.includes(event.value)}
                            onCheckedChange={() => handleEventToggle(event.value)}
                          />
                          <Label htmlFor={event.value} className="text-sm cursor-pointer">
                            {event.label}
                          </Label>
                        </div>
                      ))}
                    </div>
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
                      'Create Webhook'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Webhooks require a publicly accessible URL. Make sure your server is running and accessible from the internet.
          </AlertDescription>
        </Alert>
        
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Loading webhooks...</p>
          </div>
        ) : webhooks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No webhooks configured</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                Webhooks allow your application to receive real-time updates from the Solana blockchain via Helius.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Webhook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <CardDescription className="truncate max-w-xs mt-1">
                        {webhook.url}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(webhook.status)}`}>
                      {webhook.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">API Key</div>
                      <div className="flex items-center">
                        <code className="bg-secondary rounded px-2 py-1 text-xs flex-1 truncate">
                          {webhook.apiKey}
                        </code>
                        <Button size="icon" variant="ghost" onClick={() => copyApiKey(webhook.apiKey)}>
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Event Types</div>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <span key={event} className="px-2 py-1 bg-secondary rounded-full text-xs">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(webhook.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8">
                      <Code className="h-3.5 w-3.5 mr-1" />
                      Test
                    </Button>
                    <Button size="sm" variant="destructive" className="h-8">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {webhooks.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Webhook Payload Example</CardTitle>
              <CardDescription>
                This is an example of the payload that Helius will send to your webhook URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary rounded-md p-4 overflow-x-auto">
{`{
  "type": "NFT_BIDDING",
  "timestamp": ${Date.now()},
  "data": {
    "nft": {
      "address": "5DJAG9Cc9Y6P8kMc8xNSbLJHSqQVTGVwfLUgHJBf9XH9",
      "name": "DeGods #1234",
      "collection": "DeGods",
      "image": "https://example.com/degods/1234.png"
    },
    "bid": {
      "bidder": "8JUjWjmgxkSxd2jzjKTPPYYUpPYo16PNzUz1La3T14XM",
      "amount": 95.5,
      "currency": "SOL"
    },
    "marketplace": "Magic Eden",
    "signature": "5KtP3xd4nRsVSQZBnDNgY54yzmUz1W2zC5c7vuCwDq4vt2bQKWPAq7FHm6JnD16zt6Xyt5ZmnGCrNECq5ezbFJKR"
  },
  "source": "magiceden"
}`}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebhooksPage;
