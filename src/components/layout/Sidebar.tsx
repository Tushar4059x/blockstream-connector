
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Settings, 
  Database, 
  Webhook, 
  BarChart3, 
  Sliders,
  ThumbsUp,
  CircleDollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Webhook Setup', path: '/webhooks', icon: <Webhook size={20} /> },
    { name: 'Indexing Config', path: '/indexing', icon: <Sliders size={20} /> },
    { name: 'Data Explorer', path: '/data', icon: <BarChart3 size={20} /> },
    { name: 'Database', path: '/database', icon: <Database size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];
  
  const indexFeatures = [
    { name: 'NFT Bids', path: '/data/nft-bids', icon: <ThumbsUp size={16} /> },
    { name: 'Token Pricing', path: '/data/token-pricing', icon: <CircleDollarSign size={16} /> },
  ];

  return (
    <aside className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary mr-2 flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold">BC</span>
          </div>
          Blockstream
        </h1>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <nav className="flex-1 overflow-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.name}>
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-2 font-normal", 
                location.pathname === item.path ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
              )}
            >
              {item.icon}
              {item.name}
            </Button>
          </Link>
        ))}
        
        {location.pathname.startsWith('/data') && (
          <div className="ml-4 mt-2 space-y-1">
            <p className="text-xs text-muted-foreground mb-1 pl-2">Indexing Types</p>
            {indexFeatures.map((feature) => (
              <Link to={feature.path} key={feature.name}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 font-normal text-sm", 
                    location.pathname === feature.path ? "bg-primary/30 text-primary-foreground" : "hover:bg-sidebar-accent"
                  )}
                >
                  {feature.icon}
                  {feature.name}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs">Connected to Helius</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
