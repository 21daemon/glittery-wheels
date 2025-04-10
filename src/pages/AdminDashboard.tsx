
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/transitions/PageTransition";
import DataAnalytics from "@/components/admin/DataAnalytics";
import ManageBookings from "@/components/admin/ManageBookings";
import {
      Table,
      TableBody,
      TableCaption,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, AlertTriangle, Bug, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard: React.FC = () => {
      const { user } = useAuth();
      const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
      const [bookings, setBookings] = useState<any[]>([]);
      const [feedback, setFeedback] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [profileData, setProfileData] = useState<any>(null);
      const { toast } = useToast();

      useEffect(() => {
            if (user) {
                  console.log("Current authenticated user ID:", user.id);
            } else {
                  console.log("No authenticated user");
            }
      }, [user]);

      const fetchAdminStatus = async (userId: string) => {
            try {
                  console.log("Fetching admin status for user:", userId);

                  const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", userId)
                        .single();

                  if (error) {
                        console.error("Error fetching profile:", error);
                        throw error;
                  }

                  console.log("Profile data retrieved:", data);
                  setProfileData(data);

                  console.log("Admin status:", data?.is_admin);

                  return data?.is_admin || false;
            } catch (error: any) {
                  console.error("Error in fetchAdminStatus:", error);
                  toast({
                        title: "Error checking admin status",
                        description: error.message,
                        variant: "destructive",
                  });
                  return false;
            }
      };

      useEffect(() => {
            const checkAdminStatus = async () => {
                  if (!user) {
                        setIsAdmin(false);
                        setLoading(false);
                        setError("Not logged in. Please log in first.");
                        return;
                  }

                  try {
                        const adminStatus = await fetchAdminStatus(user.id);
                        setIsAdmin(adminStatus);

                        if (adminStatus) {
                              console.log("User is admin. Fetching data...");
                              await Promise.all([
                                    fetchBookings(),
                                    fetchFeedback(),
                              ]);
                        } else {
                              console.log(
                                    "User is not admin according to database."
                              );
                              setError(
                                    "Your account does not have admin privileges in the database."
                              );
                        }
                  } catch (error: any) {
                        console.error("Error in admin check process:", error);
                        setError(
                              `Error in admin check process: ${error.message}`
                        );
                        setIsAdmin(false);
                  } finally {
                        setLoading(false);
                  }
            };

            checkAdminStatus();
      }, [user]);

      const fetchBookings = async () => {
            try {
                  const { data, error } = await supabase
                        .from("bookings")
                        .select("*, profiles(full_name, email)")
                        .order("date", { ascending: false });

                  if (error) {
                        console.error("Error fetching bookings:", error);
                        throw error;
                  }

                  console.log("Fetched bookings:", data?.length || 0);
                  setBookings(data || []);
            } catch (error: any) {
                  console.error("Error fetching bookings:", error);
                  toast({
                        title: "Error",
                        description: `Could not fetch bookings: ${error.message}`,
                        variant: "destructive",
                  });
            }
      };

      const fetchFeedback = async () => {
            try {
                  const { data, error } = await supabase
                        .from("feedback")
                        .select("*, profiles(full_name, email)")
                        .order("created_at", { ascending: false });

                  if (error) {
                        console.error("Error fetching feedback:", error);
                        throw error;
                  }

                  console.log("Fetched feedback:", data?.length || 0);
                  setFeedback(data || []);
            } catch (error: any) {
                  console.error("Error fetching feedback:", error);
                  toast({
                        title: "Error",
                        description: `Could not fetch feedback: ${error.message}`,
                        variant: "destructive",
                  });
            }
      };

      const handleRetry = async () => {
            setLoading(true);
            setError(null);

            if (!user) {
                  setIsAdmin(false);
                  setLoading(false);
                  setError("Not logged in. Please log in first.");
                  return;
            }

            try {
                  const { data: sessionData, error: sessionError } =
                        await supabase.auth.refreshSession();

                  if (sessionError) {
                        throw sessionError;
                  }

                  console.log("Session refreshed successfully");

                  const adminStatus = await fetchAdminStatus(user.id);
                  setIsAdmin(adminStatus);

                  if (adminStatus) {
                        console.log("User is admin. Fetching data...");
                        await Promise.all([fetchBookings(), fetchFeedback()]);
                  } else {
                        console.log(
                              "User is not admin according to database check."
                        );
                        setError(
                              "Your account does not have admin privileges in the database."
                        );
                  }
            } catch (error: any) {
                  console.error("Error in admin check process:", error);
                  setError(`Error in admin check process: ${error.message}`);
                  setIsAdmin(false);
            } finally {
                  setLoading(false);
            }
      };

      const handleLogout = async () => {
            try {
                  await supabase.auth.signOut();

                  toast({
                        title: "Logged out",
                        description:
                              "You have been logged out. Please log in again with an admin account.",
                  });

                  window.location.href = "/auth";
            } catch (error: any) {
                  console.error("Error signing out:", error);
                  toast({
                        title: "Error",
                        description: `Could not sign out: ${error.message}`,
                        variant: "destructive",
                  });
            }
      };

      if (loading) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
            );
      }

      if (!user) {
            return <Navigate to="/auth" replace />;
      }

      if (error || !isAdmin) {
            return (
                  <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                              <Alert
                                    variant="destructive"
                                    className="mb-6 max-w-lg"
                              >
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Access Denied</AlertTitle>
                                    <AlertDescription>
                                          {error ||
                                                "You do not have permission to access the admin dashboard."}
                                    </AlertDescription>
                              </Alert>

                              <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg w-full">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                                          <Bug className="h-5 w-5 mr-2" /> Debug
                                          Information
                                    </h2>
                                    <div className="text-sm space-y-3 border p-3 rounded-md bg-gray-50">
                                          <p>
                                                <strong>User ID:</strong>{" "}
                                                {user?.id || "Not available"}
                                          </p>
                                          <p>
                                                <strong>Email:</strong>{" "}
                                                {user?.email || "Not available"}
                                          </p>
                                          <p>
                                                <strong>
                                                      Supabase Admin Status
                                                      Check:
                                                </strong>{" "}
                                                {isAdmin === null
                                                      ? "Unknown"
                                                      : isAdmin
                                                      ? "Yes"
                                                      : "No"}
                                          </p>
                                          <p>
                                                <strong>
                                                      Raw Profile Data from
                                                      Database:
                                                </strong>
                                          </p>
                                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                                                {profileData
                                                      ? JSON.stringify(
                                                              profileData,
                                                              null,
                                                              2
                                                        )
                                                      : "No profile data retrieved"}
                                          </pre>
                                    </div>
                              </div>

                              <div className="space-y-4 text-center">
                                    <p className="mb-4">
                                          Try the following actions to resolve
                                          the issue:
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                          <Button
                                                onClick={handleRetry}
                                                className="flex items-center gap-2"
                                          >
                                                <RefreshCw className="h-4 w-4" />
                                                Refresh Admin Status
                                          </Button>
                                          <Button
                                                variant="outline"
                                                onClick={handleLogout}
                                          >
                                                Log Out & Try Again
                                          </Button>
                                    </div>
                              </div>
                        </div>
                        <Footer />
                  </div>
            );
      }

      return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                  <Navbar />
                  <PageTransition>
                        <div className="container mx-auto px-4 py-8">
                              <h1 className="text-3xl font-bold mb-6">
                                    Admin Dashboard
                              </h1>

                              <Tabs defaultValue="analytics" className="w-full mb-6">
                                    <TabsList className="mb-4">
                                          <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                          <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
                                          <TabsTrigger value="data">Raw Data</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="analytics">
                                          <DataAnalytics bookings={bookings} feedback={feedback} />
                                    </TabsContent>
                                    
                                    <TabsContent value="bookings">
                                          <div className="bg-white rounded-lg shadow-md p-6">
                                                <ManageBookings bookings={bookings} onRefresh={fetchBookings} />
                                          </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="data">
                                          <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                      <h2 className="text-xl font-semibold mb-4">
                                                            Bookings
                                                      </h2>
                                                      <Table>
                                                            <TableHeader>
                                                                  <TableRow>
                                                                        <TableHead>
                                                                              Date
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Service
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Date
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Time
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Car
                                                                        </TableHead>
                                                                  </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                  {bookings.length > 0 ? (
                                                                        bookings.map(
                                                                              (booking) => (
                                                                                    <TableRow
                                                                                          key={
                                                                                                booking.id
                                                                                          }
                                                                                    >
                                                                                          <TableCell>
                                                                                                {new Date(
                                                                                                      booking.date
                                                                                                ).toLocaleDateString()}
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {
                                                                                                      booking.service_name
                                                                                                }
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {booking.date ||
                                                                                                      "N/A"}
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {booking.time_slot ||
                                                                                                      "N/A"}
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {booking.car_make ||
                                                                                                      "N/A"}
                                                                                          </TableCell>
                                                                                    </TableRow>
                                                                              )
                                                                        )
                                                                  ) : (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          5
                                                                                    }
                                                                                    className="text-center py-4"
                                                                              >
                                                                                    No
                                                                                    bookings
                                                                                    found
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  )}
                                                            </TableBody>
                                                      </Table>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                      <h2 className="text-xl font-semibold mb-4">
                                                            Feedback
                                                      </h2>
                                                      <Table>
                                                            <TableHeader>
                                                                  <TableRow>
                                                                        <TableHead>
                                                                              Date
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Rating
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Message
                                                                        </TableHead>
                                                                  </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                  {feedback.length > 0 ? (
                                                                        feedback.map(
                                                                              (item) => (
                                                                                    <TableRow
                                                                                          key={
                                                                                                item.id
                                                                                          }
                                                                                    >
                                                                                          <TableCell>
                                                                                                {new Date(
                                                                                                      item.created_at
                                                                                                ).toLocaleDateString()}
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {"⭐".repeat(
                                                                                                      item.rating
                                                                                                )}
                                                                                          </TableCell>
                                                                                          <TableCell className="truncate max-w-[200px]">
                                                                                                {
                                                                                                      item.message
                                                                                                }
                                                                                          </TableCell>
                                                                                    </TableRow>
                                                                              )
                                                                        )
                                                                  ) : (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          3
                                                                                    }
                                                                                    className="text-center py-4"
                                                                              >
                                                                                    No
                                                                                    feedback
                                                                                    found
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  )}
                                                            </TableBody>
                                                      </Table>
                                                </div>
                                          </div>
                                    </TabsContent>
                              </Tabs>
                        </div>
                  </PageTransition>
                  <Footer />
            </div>
      );
};

export default AdminDashboard;
