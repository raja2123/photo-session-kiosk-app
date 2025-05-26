
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PhotographerLogin from "./pages/PhotographerLogin";
import PhotographerDashboard from "./pages/PhotographerDashboard";
import CreateSession from "./pages/CreateSession";
import SessionManagement from "./pages/SessionManagement";
import UserPortal from "./pages/UserPortal";
import SessionView from "./pages/SessionView";
import PhotoSelection from "./pages/PhotoSelection";
import PhotoEditor from "./pages/PhotoEditor";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrintQueue from "./pages/PrintQueue";
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
          <Route path="/photographer" element={<PhotographerLogin />} />
          <Route path="/photographer/dashboard" element={<PhotographerDashboard />} />
          <Route path="/photographer/create-session" element={<CreateSession />} />
          <Route path="/photographer/session/:sessionId" element={<SessionManagement />} />
          <Route path="/photographer/print-queue" element={<PrintQueue />} />
          <Route path="/user" element={<UserPortal />} />
          <Route path="/user/session/:sessionId" element={<SessionView />} />
          <Route path="/user/session/:sessionId/photos" element={<PhotoSelection />} />
          <Route path="/user/session/:sessionId/editor" element={<PhotoEditor />} />
          <Route path="/user/session/:sessionId/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
