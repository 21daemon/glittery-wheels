
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Feedback from "./pages/Feedback";
import Auth from "./pages/Auth";
import { AdminDashboard } from "./pages/AdminDashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
      <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                  <TooltipProvider>
                        <ThemeProvider attribute="class" defaultTheme="light">
                              <AuthProvider>
                                    <ChatProvider>
                                          <Toaster />
                                          <Sonner />
                                          <BrowserRouter>
                                                <Routes>
                                                      <Route
                                                            path="/"
                                                            element={<Index />}
                                                      />
                                                      <Route
                                                            path="/services"
                                                            element={<Services />}
                                                      />
                                                      <Route
                                                            path="/booking"
                                                            element={<Booking />}
                                                      />
                                                      <Route
                                                            path="/my-bookings"
                                                            element={<MyBookings />}
                                                      />
                                                      <Route
                                                            path="/feedback"
                                                            element={<Feedback />}
                                                      />
                                                      <Route
                                                            path="/auth"
                                                            element={<Auth />}
                                                      />
                                                      <Route
                                                            path="/admin"
                                                            element={
                                                                  <AdminDashboard />
                                                            }
                                                      />
                                                      <Route
                                                            path="/admin-full"
                                                            element={<Admin />}
                                                      />
                                                      <Route
                                                            path="*"
                                                            element={<NotFound />}
                                                      />
                                                </Routes>
                                                <ChatWidget />
                                          </BrowserRouter>
                                    </ChatProvider>
                              </AuthProvider>
                        </ThemeProvider>
                  </TooltipProvider>
            </QueryClientProvider>
      </React.StrictMode>
);

export default App;
