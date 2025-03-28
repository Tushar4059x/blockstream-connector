
import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ChevronLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 rounded-full mx-auto flex items-center justify-center">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button asChild variant="default" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="gap-2">
            <Link to="javascript:history.back()">
              <ChevronLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
