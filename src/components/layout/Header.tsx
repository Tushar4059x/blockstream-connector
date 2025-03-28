
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare, 
  HelpCircle,
  PlusCircle 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header = () => {
  return (
    <header className="border-b border-border h-14 px-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="text-lg font-medium flex items-center gap-2">
        <span className="text-primary">Blockstream</span>
        <span className="text-muted-foreground">Connector</span>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <HelpCircle size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help & Documentation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MessageSquare size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Feedback</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button size="sm" className="ml-2 gap-1">
          <PlusCircle size={16} />
          New Webhook
        </Button>
      </div>
    </header>
  );
};

export default Header;
