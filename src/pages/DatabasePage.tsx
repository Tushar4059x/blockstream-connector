
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { DatabaseConfig } from '@/types';
import { apiService } from '@/services/api';
import { 
  AlertCircle, 
  CheckCircle, 
  Database as DatabaseIcon, 
  Lock,
  RefreshCw, 
  Save, 
  Shield, 
  Table, 
  Terminal
} from 'lucide-react';

const DatabasePage = () => {
  const { toast } = useToast();
  const [dbConfig, setDbConfig] = useState<DatabaseConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('');
  const [ssl, setSsl] = useState(true);
  
  useEffect(() => {
    fetchDatabaseConfig();
  }, []);
  
  const fetchDatabaseConfig = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDatabaseConfig();
      setDbConfig(data);
      
      // Set form state
      setHost(data.host);
      setPort(data.port.toString());
      setUsername(data.username);
      setPassword(data.password);
      setDatabase(data.database);
      setSsl(data.ssl);
    } catch (error) {
      console.error('Error fetching database config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load database configuration. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!host || !port || !username || !password || !database) {
      toast({
        title: 'Validation Error',
        description: 'Please fill out all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const updatedConfig = await apiService.updateDatabaseConfig({
        host,
        port: parseInt(port, 10),
        username,
        password,
        database,
        ssl
      });
      
      setDbConfig(updatedConfig);
      
      toast({
        title: 'Success',
        description: 'Database configuration updated successfully!'
      });
    } catch (error) {
      console.error('Error updating database config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update database configuration. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const testConnection = async () => {
    try {
      setTesting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Connection Successful',
        description: 'Successfully connected to the database!'
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to the database. Please check your configuration.',
        variant: 'destructive'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure your PostgreSQL database connection
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Loading database configuration...</p>
          </div>
        ) : (
          <Tabs defaultValue="connection" className="space-y-4">
            <TabsList>
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Connection</CardTitle>
                  <CardDescription>
                    Configure your PostgreSQL database connection settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="host">Host</Label>
                      <Input
                        id="host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="localhost or database URL"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="port">Port</Label>
                      <Input
                        id="port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="5432"
                        type="number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="database">Database Name</Label>
                      <Input
                        id="database"
                        value={database}
                        onChange={(e) => setDatabase(e.target.value)}
                        placeholder="blockstream_db"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="postgres"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter database password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ssl"
                      checked={ssl}
                      onCheckedChange={setSsl}
                    />
                    <Label htmlFor="ssl">Enable SSL/TLS connection</Label>
                  </div>
                  
                  {dbConfig?.status && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${
                        dbConfig.status === 'connected' ? 'bg-green-500' : 
                        dbConfig.status === 'disconnected' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm">
                        Status: {dbConfig.status}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={testConnection}
                    disabled={testing}
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Connection URL</CardTitle>
                  <CardDescription>
                    Your PostgreSQL connection string
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-3 rounded-md font-mono text-sm overflow-x-auto">
                    {`postgresql://${username}:******@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Password is hidden for security. Use this connection string in your application code.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema</CardTitle>
                  <CardDescription>
                    Manage database schema and tables
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Table Name</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Rows (Est.)</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Size</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 flex items-center gap-2">
                            <Table className="h-4 w-4 text-primary" />
                            users
                          </td>
                          <td className="py-3">12</td>
                          <td className="py-3">256 KB</td>
                          <td className="py-3 text-muted-foreground">User accounts and credentials</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 flex items-center gap-2">
                            <Table className="h-4 w-4 text-primary" />
                            webhooks
                          </td>
                          <td className="py-3">2</td>
                          <td className="py-3">128 KB</td>
                          <td className="py-3 text-muted-foreground">Webhook configurations</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 flex items-center gap-2">
                            <Table className="h-4 w-4 text-primary" />
                            indexers
                          </td>
                          <td className="py-3">2</td>
                          <td className="py-3">128 KB</td>
                          <td className="py-3 text-muted-foreground">Indexing configurations</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 flex items-center gap-2">
                            <Table className="h-4 w-4 text-primary" />
                            nft_bids
                          </td>
                          <td className="py-3">1,283</td>
                          <td className="py-3">2.4 MB</td>
                          <td className="py-3 text-muted-foreground">NFT bid data</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 flex items-center gap-2">
                            <Table className="h-4 w-4 text-primary" />
                            token_prices
                          </td>
                          <td className="py-3">4,291</td>
                          <td className="py-3">5.1 MB</td>
                          <td className="py-3 text-muted-foreground">Historical token price data</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    <Terminal className="h-4 w-4" />
                    Run Migration
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Schema Management</CardTitle>
                  <CardDescription>
                    Database schema visualization and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-4 rounded-md h-72 flex items-center justify-center">
                    <p className="text-muted-foreground">Schema visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Database Performance</CardTitle>
                  <CardDescription>
                    Monitor and optimize database performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Connection Pool</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Connections:</span>
                          <span>3/10</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Database Size</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Used Space:</span>
                          <span>8.1 MB / 1 GB</span>
                        </div>
                        <Progress value={0.81} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Query Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Avg Query Time:</span>
                          <span>45ms</span>
                        </div>
                        <Progress value={45} max={200} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Cache Hit Ratio</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Cache Hits:</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Tuning</CardTitle>
                  <CardDescription>
                    Configure database performance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minPool">Min Pool Size</Label>
                      <Input id="minPool" type="number" defaultValue="5" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxPool">Max Pool Size</Label>
                      <Input id="maxPool" type="number" defaultValue="20" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idleTimeout">Idle Timeout (ms)</Label>
                      <Input id="idleTimeout" type="number" defaultValue="10000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="connTimeout">Connection Timeout (ms)</Label>
                      <Input id="connTimeout" type="number" defaultValue="5000" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button variant="outline">Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Alert className="border-yellow-500/20 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500">
                  Ensure your database uses strong passwords and is not exposed to the public internet.
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure database security options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <Label htmlFor="ssl-enabled">SSL/TLS Encryption</Label>
                      </div>
                      <Switch id="ssl-enabled" checked={ssl} onCheckedChange={setSsl} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <Label htmlFor="encrypt-data">Encrypt Sensitive Data</Label>
                      </div>
                      <Switch id="encrypt-data" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DatabaseIcon className="h-4 w-4 text-primary" />
                        <Label htmlFor="audit-logging">Audit Logging</Label>
                      </div>
                      <Switch id="audit-logging" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <Label htmlFor="auto-backup">Automated Backups</Label>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button variant="outline">Update Security Settings</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Manage database access permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">blockstream_user</span>
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">
                          Admin
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">readonly_user</span>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                          Read-only
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">api_user</span>
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                          API
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DatabasePage;
