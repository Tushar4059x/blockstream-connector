
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WebhooksPage from "./pages/WebhooksPage";
import IndexingPage from "./pages/IndexingPage";
import DataExplorerPage from "./pages/DataExplorerPage";
import DatabasePage from "./pages/DatabasePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/webhooks" element={<WebhooksPage />} />
          <Route path="/indexing" element={<IndexingPage />} />
          <Route path="/data" element={<DataExplorerPage />} />
          <Route path="/data/nft-bids" element={<DataExplorerPage />} />
          <Route path="/data/token-pricing" element={<DataExplorerPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
