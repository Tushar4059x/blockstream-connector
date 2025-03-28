
import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Bell, 
  FileText, 
  Key, 
  Moon, 
  RefreshCw, 
  Save, 
  Shield, 
  Trash2, 
  User
} from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // User settings
  const [username, setUsername] = useState('admin@example.com');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // API settings
  const [apiKey, setApiKey] = useState('hel_1a2b3c4d5e6f7g8h9i0j');
  const [endpointUrl, setEndpointUrl] = useState('https://api.helius.xyz/v1');
  const [rateLimit, setRateLimit] = useState('100');
  
  // System settings
  const [logLevel, setLogLevel] = useState('info');
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState('30');
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Settings Saved',
        description: 'Your settings have been updated successfully.'
      });
      setSaving(false);
    }, 1000);
  };
  
  const regenerateApiKey = () => {
    const newKey = 'hel_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    
    toast({
      title: 'API Key Regenerated',
      description: 'Your new API key has been created. Be sure to update your applications.'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application settings
          </p>
        </div>
        
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Email Address</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-primary" />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  A
                </div>
                <div>
                  <h3 className="font-medium">Administrator</h3>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Key className="h-3.5 w-3.5 mr-1" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your Helius API keys and endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-secondary border-secondary">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary">
                    Your API keys grant access to your Helius account. Keep them secure and never share them publicly.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">Helius API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={regenerateApiKey}>
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for authenticating with the Helius API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endpoint-url">API Endpoint</Label>
                  <Input
                    id="endpoint-url"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The base URL for Helius API requests
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input
                    id="rate-limit"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                    type="number"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of API requests per minute
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save API Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                  Monitor your API usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Requests (Current Month)</span>
                      <span>12,453 / 100,000</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '12.5%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      12.5% of your monthly API quota used
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Webhook Calls (Current Month)</span>
                      <span>3,271 / 50,000</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '6.5%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      6.5% of your monthly webhook quota used
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings for your Blockstream instance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <select
                    id="log-level"
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Controls the verbosity of system logs
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <Label htmlFor="auto-backup">Automated Backups</Label>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Input
                    id="data-retention"
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    type="number"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of days to retain indexed data (0 = keep forever)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save System Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Monitor the health of your Blockstream instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">API Service: Operational</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Database: Connected</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Webhooks: Active</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Indexers: Running</span>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Run System Diagnostics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    Warning: Changing these settings can affect system performance and stability. Proceed with caution.
                  </AlertDescription>
                </Alert>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="enable-rpc">Enable Direct RPC Access</Label>
                  </div>
                  <Switch id="enable-rpc" defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <Label htmlFor="error-alerts">Error Alerting</Label>
                  </div>
                  <Switch id="error-alerts" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-timeout">Webhook Timeout (ms)</Label>
                  <Input id="webhook-timeout" defaultValue="5000" type="number" />
                  <p className="text-xs text-muted-foreground">
                    Maximum time to wait for webhook responses
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="indexer-threads">Indexer Thread Count</Label>
                  <Input id="indexer-threads" defaultValue="4" type="number" />
                  <p className="text-xs text-muted-foreground">
                    Number of concurrent indexing threads (higher values use more system resources)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Advanced Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Destructive actions that should be used with caution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/50 rounded-md space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-destructive">Reset All Data</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will delete all indexed data but keep your configurations.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                      Clear Indexed Data
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-destructive">Factory Reset</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will reset all configurations and data to factory defaults.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                      Factory Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
