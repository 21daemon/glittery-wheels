import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
      Table,
      TableBody,
      TableCaption,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Star, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/transitions/PageTransition";

const Admin: React.FC = () => {
      const { user } = useAuth();
      const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
      const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
      const [bookings, setBookings] = useState<any[]>([]);
      const [feedback, setFeedback] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [bookingsPage, setBookingsPage] = useState(1);
      const [feedbackPage, setFeedbackPage] = useState(1);
      const [bookingsFilter, setBookingsFilter] = useState("");
      const [statusFilter, setStatusFilter] = useState("");
      const [ratingFilter, setRatingFilter] = useState("");
      const { toast } = useToast();
      const navigate = useNavigate();

      const PAGE_SIZE = 10;

      useEffect(() => {
            const checkAdminStatus = async () => {
                  if (!user) {
                        setIsAdmin(false);
                        return;
                  }

                  try {
                        const { data, error } = await supabase
                              .from("profiles")
                              .select("is_admin, is_superadmin")
                              .eq("id", user.id)
                              .single();

                        console.log(user.id);
                        console.log("Fetched Data:", data);

                        if (error) {
                              console.error(
                                    "Error fetching admin status:",
                                    error
                              );
                              setIsAdmin(false);
                              return;
                        }

                        setIsAdmin(data?.is_admin || false);
                        setIsSuperAdmin(data?.is_superadmin || false);
                  } catch (error) {
                        console.error("Error checking admin status:", error);
                        setIsAdmin(false);
                  } finally {
                        setLoading(false);
                  }
            };

            checkAdminStatus();
      }, [user]);

      useEffect(() => {
            if (isAdmin) {
                  fetchBookings();
                  fetchFeedback();

                  // Set up realtime listeners
                  const bookingsChannel = supabase
                        .channel("bookings-changes")
                        .on(
                              "postgres_changes",
                              {
                                    event: "*",
                                    schema: "public",
                                    table: "bookings",
                              },
                              () => fetchBookings()
                        )
                        .subscribe();

                  const feedbackChannel = supabase
                        .channel("feedback-changes")
                        .on(
                              "postgres_changes",
                              {
                                    event: "*",
                                    schema: "public",
                                    table: "feedback",
                              },
                              () => fetchFeedback()
                        )
                        .subscribe();

                  return () => {
                        supabase.removeChannel(bookingsChannel);
                        supabase.removeChannel(feedbackChannel);
                  };
            }
      }, [
            isAdmin,
            bookingsPage,
            feedbackPage,
            bookingsFilter,
            statusFilter,
            ratingFilter,
      ]);

      const fetchBookings = async () => {
            if (!isAdmin) return;

            setLoading(true);

            try {
                  let query = supabase
                        .from("bookings")
                        .select("*, profiles(full_name, email)", {
                              count: "exact",
                        });

                  if (bookingsFilter) {
                        query = query.or(
                              `car_make.ilike.%${bookingsFilter}%,car_model.ilike.%${bookingsFilter}%`
                        );
                  }

                  if (statusFilter) {
                        query = query.eq("status", statusFilter);
                  }

                  const { data, error, count } = await query.order("date", {
                        ascending: false,
                  });

                  if (error) throw error;

                  setBookings(data || []);
                  setLoading(false);
            } catch (error) {
                  console.error("Error fetching bookings:", error);
                  toast({
                        title: "Error",
                        description:
                              "Failed to load bookings. Please try again.",
                        variant: "destructive",
                  });
                  setLoading(false);
            }
      };

      const fetchFeedback = async () => {
            if (!isAdmin) return;

            setLoading(true);

            try {
                  let query = supabase
                        .from("feedback")
                        .select("*, profiles(full_name, email)", {
                              count: "exact",
                        });

                  if (ratingFilter) {
                        query = query.eq("rating", parseInt(ratingFilter));
                  }

                  const { data, error } = await query
                        .order("created_at", { ascending: false })
                        .range(
                              (feedbackPage - 1) * PAGE_SIZE,
                              feedbackPage * PAGE_SIZE - 1
                        );

                  if (error) throw error;

                  setFeedback(data || []);
                  setLoading(false);
            } catch (error) {
                  console.error("Error fetching feedback:", error);
                  toast({
                        title: "Error",
                        description:
                              "Failed to load feedback. Please try again.",
                        variant: "destructive",
                  });
                  setLoading(false);
            }
      };

      const updateBookingStatus = async (id: string, status: string) => {
            try {
                  const { error } = await supabase
                        .from("bookings")
                        .update({ status })
                        .eq("id", id);

                  if (error) throw error;

                  toast({
                        title: "Status Updated",
                        description: `Booking status changed to ${status}`,
                  });

                  fetchBookings();
            } catch (error) {
                  console.error("Error updating booking status:", error);
                  toast({
                        title: "Error",
                        description:
                              "Failed to update status. Please try again.",
                        variant: "destructive",
                  });
            }
      };

      const deleteBooking = async (id: string) => {
            if (!isSuperAdmin) return;

            try {
                  const { error } = await supabase
                        .from("bookings")
                        .delete()
                        .eq("id", id);

                  if (error) throw error;

                  toast({
                        title: "Booking Deleted",
                        description:
                              "The booking has been permanently removed.",
                  });

                  fetchBookings();
            } catch (error) {
                  console.error("Error deleting booking:", error);
                  toast({
                        title: "Error",
                        description:
                              "Failed to delete booking. Please try again.",
                        variant: "destructive",
                  });
            }
      };

      const deleteFeedback = async (id: string) => {
            if (!isSuperAdmin) return;

            try {
                  const { error } = await supabase
                        .from("feedback")
                        .delete()
                        .eq("id", id);

                  if (error) throw error;

                  toast({
                        title: "Feedback Deleted",
                        description:
                              "The feedback has been permanently removed.",
                  });

                  fetchFeedback();
            } catch (error) {
                  console.error("Error deleting feedback:", error);
                  toast({
                        title: "Error",
                        description:
                              "Failed to delete feedback. Please try again.",
                        variant: "destructive",
                  });
            }
      };

      const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                  case "confirmed":
                        return "bg-green-100 text-green-800";
                  case "completed":
                        return "bg-blue-100 text-blue-800";
                  case "cancelled":
                        return "bg-red-100 text-red-800";
                  case "pending":
                        return "bg-yellow-100 text-yellow-800";
                  default:
                        return "bg-gray-100 text-gray-800";
            }
      };

      const renderStars = (rating: number) => {
            return Array(5)
                  .fill(0)
                  .map((_, i) => (
                        <Star
                              key={i}
                              className={`h-4 w-4 ${
                                    i < rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                              }`}
                        />
                  ));
      };

      if (loading && isAdmin === null) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
            );
      }

      if (isAdmin === false && !loading) {
            return <Navigate to="/" replace />;
      }

      return (
            <div className="min-h-screen flex flex-col">
                  <Navbar />

                  <PageTransition>
                        <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                              <div className="bg-white rounded-xl border shadow-sm p-6 mb-8 dark:bg-gray-800">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                          <div>
                                                <h1 className="text-2xl font-bold mb-2">
                                                      Admin Dashboard
                                                </h1>
                                                <p className="text-muted-foreground">
                                                      Manage bookings and
                                                      customer feedback for
                                                      Autox24.
                                                </p>
                                          </div>
                                          {isSuperAdmin && (
                                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                                      Super Admin
                                                </Badge>
                                          )}
                                    </div>
                              </div>

                              <Tabs defaultValue="bookings" className="w-full">
                                    <TabsList className="mb-4">
                                          <TabsTrigger value="bookings">
                                                Bookings
                                          </TabsTrigger>
                                          <TabsTrigger value="feedback">
                                                Customer Feedback
                                          </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="bookings">
                                          <div className="bg-white rounded-xl border shadow-sm p-6 dark:bg-gray-800">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                                      <h2 className="text-xl font-semibold">
                                                            Bookings Management
                                                      </h2>

                                                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                            <Input
                                                                  placeholder="Filter by car make/model..."
                                                                  value={
                                                                        bookingsFilter
                                                                  }
                                                                  onChange={(
                                                                        e
                                                                  ) =>
                                                                        setBookingsFilter(
                                                                              e
                                                                                    .target
                                                                                    .value
                                                                        )
                                                                  }
                                                                  className="max-w-xs"
                                                            />

                                                            <Select
                                                                  value={
                                                                        statusFilter
                                                                  }
                                                                  onValueChange={
                                                                        setStatusFilter
                                                                  }
                                                            >
                                                                  <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Filter by status" />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                        <SelectItem value="">
                                                                              All
                                                                              Statuses
                                                                        </SelectItem>
                                                                        <SelectItem value="confirmed">
                                                                              Confirmed
                                                                        </SelectItem>
                                                                        <SelectItem value="pending">
                                                                              Pending
                                                                        </SelectItem>
                                                                        <SelectItem value="completed">
                                                                              Completed
                                                                        </SelectItem>
                                                                        <SelectItem value="cancelled">
                                                                              Cancelled
                                                                        </SelectItem>
                                                                  </SelectContent>
                                                            </Select>

                                                            <Button
                                                                  variant="outline"
                                                                  size="icon"
                                                                  onClick={() => {
                                                                        setBookingsFilter(
                                                                              ""
                                                                        );
                                                                        setStatusFilter(
                                                                              ""
                                                                        );
                                                                        fetchBookings();
                                                                  }}
                                                            >
                                                                  <RefreshCw className="h-4 w-4" />
                                                            </Button>
                                                      </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                      <Table>
                                                            <TableCaption>
                                                                  List of all
                                                                  service
                                                                  bookings
                                                            </TableCaption>
                                                            <TableHeader>
                                                                  <TableRow>
                                                                        <TableHead>
                                                                              Date
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Time
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Service
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Vehicle
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Customer
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Price
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Status
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Actions
                                                                        </TableHead>
                                                                  </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                  {loading ? (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          8
                                                                                    }
                                                                                    className="h-24 text-center"
                                                                              >
                                                                                    Loading
                                                                                    bookings...
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  ) : bookings.length ===
                                                                    0 ? (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          8
                                                                                    }
                                                                                    className="h-24 text-center"
                                                                              >
                                                                                    No
                                                                                    bookings
                                                                                    found
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  ) : (
                                                                        bookings.map(
                                                                              (
                                                                                    booking
                                                                              ) => (
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
                                                                                                      booking.time_slot
                                                                                                }
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {
                                                                                                      booking.service_name
                                                                                                }
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {
                                                                                                      booking.car_make
                                                                                                }{" "}
                                                                                                {
                                                                                                      booking.car_model
                                                                                                }
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {booking
                                                                                                      .profiles
                                                                                                      ?.full_name ||
                                                                                                      "N/A"}
                                                                                                <div className="text-xs text-muted-foreground">
                                                                                                      {booking
                                                                                                            .profiles
                                                                                                            .email ||
                                                                                                            "No email"}
                                                                                                </div>
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                $
                                                                                                {
                                                                                                      booking.price
                                                                                                }
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                <Badge
                                                                                                      className={getStatusColor(
                                                                                                            booking.status
                                                                                                      )}
                                                                                                      variant="outline"
                                                                                                >
                                                                                                      {
                                                                                                            booking.status
                                                                                                      }
                                                                                                </Badge>
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                      <Select
                                                                                                            defaultValue={
                                                                                                                  booking.status
                                                                                                            }
                                                                                                            onValueChange={(
                                                                                                                  value
                                                                                                            ) =>
                                                                                                                  updateBookingStatus(
                                                                                                                        booking.id,
                                                                                                                        value
                                                                                                                  )
                                                                                                            }
                                                                                                      >
                                                                                                            <SelectTrigger className="w-[130px]">
                                                                                                                  <SelectValue placeholder="Change status" />
                                                                                                            </SelectTrigger>
                                                                                                            <SelectContent>
                                                                                                                  <SelectItem value="confirmed">
                                                                                                                        Confirm
                                                                                                                  </SelectItem>
                                                                                                                  <SelectItem value="pending">
                                                                                                                        Pending
                                                                                                                  </SelectItem>
                                                                                                                  <SelectItem value="completed">
                                                                                                                        Complete
                                                                                                                  </SelectItem>
                                                                                                                  <SelectItem value="cancelled">
                                                                                                                        Cancel
                                                                                                                  </SelectItem>
                                                                                                            </SelectContent>
                                                                                                      </Select>

                                                                                                      {isSuperAdmin && (
                                                                                                            <AlertDialog>
                                                                                                                  <AlertDialogTrigger
                                                                                                                        asChild
                                                                                                                  >
                                                                                                                        <Button
                                                                                                                              variant="destructive"
                                                                                                                              size="icon"
                                                                                                                        >
                                                                                                                              <Trash2 className="h-4 w-4" />
                                                                                                                        </Button>
                                                                                                                  </AlertDialogTrigger>
                                                                                                                  <AlertDialogContent>
                                                                                                                        <AlertDialogHeader>
                                                                                                                              <AlertDialogTitle>
                                                                                                                                    Are
                                                                                                                                    you
                                                                                                                                    absolutely
                                                                                                                                    sure?
                                                                                                                              </AlertDialogTitle>
                                                                                                                              <AlertDialogDescription>
                                                                                                                                    This
                                                                                                                                    action
                                                                                                                                    cannot
                                                                                                                                    be
                                                                                                                                    undone.
                                                                                                                                    This
                                                                                                                                    will
                                                                                                                                    permanently
                                                                                                                                    delete
                                                                                                                                    the
                                                                                                                                    booking
                                                                                                                                    record.
                                                                                                                              </AlertDialogDescription>
                                                                                                                        </AlertDialogHeader>
                                                                                                                        <AlertDialogFooter>
                                                                                                                              <AlertDialogCancel>
                                                                                                                                    Cancel
                                                                                                                              </AlertDialogCancel>
                                                                                                                              <AlertDialogAction
                                                                                                                                    onClick={() =>
                                                                                                                                          deleteBooking(
                                                                                                                                                booking.id
                                                                                                                                          )
                                                                                                                                    }
                                                                                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                                                              >
                                                                                                                                    Delete
                                                                                                                              </AlertDialogAction>
                                                                                                                        </AlertDialogFooter>
                                                                                                                  </AlertDialogContent>
                                                                                                            </AlertDialog>
                                                                                                      )}
                                                                                                </div>
                                                                                          </TableCell>
                                                                                    </TableRow>
                                                                              )
                                                                        )
                                                                  )}
                                                            </TableBody>
                                                      </Table>
                                                </div>

                                                <Pagination className="mt-4">
                                                      <PaginationContent>
                                                            <PaginationItem>
                                                                  <PaginationPrevious
                                                                        onClick={() =>
                                                                              setBookingsPage(
                                                                                    (
                                                                                          prev
                                                                                    ) =>
                                                                                          Math.max(
                                                                                                prev -
                                                                                                      1,
                                                                                                1
                                                                                          )
                                                                              )
                                                                        }
                                                                        className={
                                                                              bookingsPage ===
                                                                              1
                                                                                    ? "pointer-events-none opacity-50"
                                                                                    : ""
                                                                        }
                                                                  />
                                                            </PaginationItem>

                                                            {[...Array(3)].map(
                                                                  (_, i) => {
                                                                        const page =
                                                                              bookingsPage -
                                                                              1 +
                                                                              i;
                                                                        if (
                                                                              page <
                                                                              1
                                                                        )
                                                                              return null;
                                                                        return (
                                                                              <PaginationItem
                                                                                    key={
                                                                                          page
                                                                                    }
                                                                              >
                                                                                    <PaginationLink
                                                                                          isActive={
                                                                                                page ===
                                                                                                bookingsPage
                                                                                          }
                                                                                          onClick={() =>
                                                                                                setBookingsPage(
                                                                                                      page
                                                                                                )
                                                                                          }
                                                                                    >
                                                                                          {
                                                                                                page
                                                                                          }
                                                                                    </PaginationLink>
                                                                              </PaginationItem>
                                                                        );
                                                                  }
                                                            )}

                                                            <PaginationItem>
                                                                  <PaginationNext
                                                                        onClick={() =>
                                                                              setBookingsPage(
                                                                                    (
                                                                                          prev
                                                                                    ) =>
                                                                                          prev +
                                                                                          1
                                                                              )
                                                                        }
                                                                  />
                                                            </PaginationItem>
                                                      </PaginationContent>
                                                </Pagination>
                                          </div>
                                    </TabsContent>

                                    <TabsContent value="feedback">
                                          <div className="bg-white rounded-xl border shadow-sm p-6 dark:bg-gray-800">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                                      <h2 className="text-xl font-semibold">
                                                            Customer Feedback
                                                      </h2>

                                                      <div className="flex items-center gap-2">
                                                            <Select
                                                                  value={
                                                                        ratingFilter
                                                                  }
                                                                  onValueChange={
                                                                        setRatingFilter
                                                                  }
                                                            >
                                                                  <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Filter by rating" />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                        <SelectItem value="">
                                                                              All
                                                                              Ratings
                                                                        </SelectItem>
                                                                        <SelectItem value="5">
                                                                              5
                                                                              Stars
                                                                        </SelectItem>
                                                                        <SelectItem value="4">
                                                                              4
                                                                              Stars
                                                                        </SelectItem>
                                                                        <SelectItem value="3">
                                                                              3
                                                                              Stars
                                                                        </SelectItem>
                                                                        <SelectItem value="2">
                                                                              2
                                                                              Stars
                                                                        </SelectItem>
                                                                        <SelectItem value="1">
                                                                              1
                                                                              Star
                                                                        </SelectItem>
                                                                  </SelectContent>
                                                            </Select>

                                                            <Button
                                                                  variant="outline"
                                                                  size="icon"
                                                                  onClick={() => {
                                                                        setRatingFilter(
                                                                              ""
                                                                        );
                                                                        fetchFeedback();
                                                                  }}
                                                            >
                                                                  <RefreshCw className="h-4 w-4" />
                                                            </Button>
                                                      </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                      <Table>
                                                            <TableCaption>
                                                                  Recent
                                                                  customer
                                                                  feedback
                                                            </TableCaption>
                                                            <TableHeader>
                                                                  <TableRow>
                                                                        <TableHead>
                                                                              Date
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Customer
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Rating
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Satisfaction
                                                                        </TableHead>
                                                                        <TableHead>
                                                                              Feedback
                                                                        </TableHead>
                                                                        {isSuperAdmin && (
                                                                              <TableHead>
                                                                                    Actions
                                                                              </TableHead>
                                                                        )}
                                                                  </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                  {loading ? (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          isSuperAdmin
                                                                                                ? 6
                                                                                                : 5
                                                                                    }
                                                                                    className="h-24 text-center"
                                                                              >
                                                                                    Loading
                                                                                    feedback...
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  ) : feedback.length ===
                                                                    0 ? (
                                                                        <TableRow>
                                                                              <TableCell
                                                                                    colSpan={
                                                                                          isSuperAdmin
                                                                                                ? 6
                                                                                                : 5
                                                                                    }
                                                                                    className="h-24 text-center"
                                                                              >
                                                                                    No
                                                                                    feedback
                                                                                    found
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  ) : (
                                                                        feedback.map(
                                                                              (
                                                                                    item
                                                                              ) => (
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
                                                                                                {item
                                                                                                      .profiles
                                                                                                      ?.full_name ||
                                                                                                      "Anonymous"}
                                                                                                <div className="text-xs text-muted-foreground">
                                                                                                      {item
                                                                                                            .profiles
                                                                                                            ?.email ||
                                                                                                            "No email"}
                                                                                                </div>
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                <div className="flex">
                                                                                                      {renderStars(
                                                                                                            item.rating
                                                                                                      )}
                                                                                                </div>
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                                {item.satisfaction ||
                                                                                                      "N/A"}
                                                                                          </TableCell>
                                                                                          <TableCell className="max-w-xs">
                                                                                                <div className="whitespace-normal break-words">
                                                                                                      {
                                                                                                            item.message
                                                                                                      }
                                                                                                </div>
                                                                                          </TableCell>
                                                                                          {isSuperAdmin && (
                                                                                                <TableCell>
                                                                                                      <AlertDialog>
                                                                                                            <AlertDialogTrigger
                                                                                                                  asChild
                                                                                                            >
                                                                                                                  <Button
                                                                                                                        variant="destructive"
                                                                                                                        size="icon"
                                                                                                                  >
                                                                                                                        <Trash2 className="h-4 w-4" />
                                                                                                                  </Button>
                                                                                                            </AlertDialogTrigger>
                                                                                                            <AlertDialogContent>
                                                                                                                  <AlertDialogHeader>
                                                                                                                        <AlertDialogTitle>
                                                                                                                              Are
                                                                                                                              you
                                                                                                                              absolutely
                                                                                                                              sure?
                                                                                                                        </AlertDialogTitle>
                                                                                                                        <AlertDialogDescription>
                                                                                                                              This
                                                                                                                              action
                                                                                                                              cannot
                                                                                                                              be
                                                                                                                              undone.
                                                                                                                              This
                                                                                                                              will
                                                                                                                              permanently
                                                                                                                              delete
                                                                                                                              this
                                                                                                                              feedback.
                                                                                                                        </AlertDialogDescription>
                                                                                                                  </AlertDialogHeader>
                                                                                                                  <AlertDialogFooter>
                                                                                                                        <AlertDialogCancel>
                                                                                                                              Cancel
                                                                                                                        </AlertDialogCancel>
                                                                                                                        <AlertDialogAction
                                                                                                                              onClick={() =>
                                                                                                                                    deleteFeedback(
                                                                                                                                          item.id
                                                                                                                                    )
                                                                                                                              }
                                                                                                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                                                        >
                                                                                                                              Delete
                                                                                                                        </AlertDialogAction>
                                                                                                                  </AlertDialogFooter>
                                                                                                            </AlertDialogContent>
                                                                                                      </AlertDialog>
                                                                                                </TableCell>
                                                                                          )}
                                                                                    </TableRow>
                                                                              )
                                                                        )
                                                                  )}
                                                            </TableBody>
                                                      </Table>
                                                </div>

                                                <Pagination className="mt-4">
                                                      <PaginationContent>
                                                            <PaginationItem>
                                                                  <PaginationPrevious
                                                                        onClick={() =>
                                                                              setFeedbackPage(
                                                                                    (
                                                                                          prev
                                                                                    ) =>
                                                                                          Math.max(
                                                                                                prev -
                                                                                                      1,
                                                                                                1
                                                                                          )
                                                                              )
                                                                        }
                                                                        className={
                                                                              feedbackPage ===
                                                                              1
                                                                                    ? "pointer-events-none opacity-50"
                                                                                    : ""
                                                                        }
                                                                  />
                                                            </PaginationItem>

                                                            {[...Array(3)].map(
                                                                  (_, i) => {
                                                                        const page =
                                                                              feedbackPage -
                                                                              1 +
                                                                              i;
                                                                        if (
                                                                              page <
                                                                              1
                                                                        )
                                                                              return null;
                                                                        return (
                                                                              <PaginationItem
                                                                                    key={
                                                                                          page
                                                                                    }
                                                                              >
                                                                                    <PaginationLink
                                                                                          isActive={
                                                                                                page ===
                                                                                                feedbackPage
                                                                                          }
                                                                                          onClick={() =>
                                                                                                setFeedbackPage(
                                                                                                      page
                                                                                                )
                                                                                          }
                                                                                    >
                                                                                          {
                                                                                                page
                                                                                          }
                                                                                    </PaginationLink>
                                                                              </PaginationItem>
                                                                        );
                                                                  }
                                                            )}

                                                            <PaginationItem>
                                                                  <PaginationNext
                                                                        onClick={() =>
                                                                              setFeedbackPage(
                                                                                    (
                                                                                          prev
                                                                                    ) =>
                                                                                          prev +
                                                                                          1
                                                                              )
                                                                        }
                                                                  />
                                                            </PaginationItem>
                                                      </PaginationContent>
                                                </Pagination>
                                          </div>
                                    </TabsContent>
                              </Tabs>
                        </div>
                  </PageTransition>

                  <Footer />
            </div>
      );
};

export default Admin;
