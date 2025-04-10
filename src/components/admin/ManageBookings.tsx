import React, { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash, Check, X, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
} from "@/components/ui/dialog";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManageBookingsProps {
      bookings: any[];
      onRefresh: () => void;
}

const services = [
      { id: "basic", name: "Basic Wash", price: "$49.99" },
      { id: "premium", name: "Premium Detail", price: "$99.99" },
      { id: "interior", name: "Interior Deep Clean", price: "$79.99" },
      { id: "exterior", name: "Exterior Polish", price: "$79.99" },
      { id: "ceramic", name: "Ceramic Coating", price: "$249.99" },
];

const timeSlots = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
];

const statusOptions = [
      { value: "confirmed", label: "Confirmed" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
];

const ManageBookings: React.FC<ManageBookingsProps> = ({
      bookings,
      onRefresh,
}) => {
      const { toast } = useToast();
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [selectedBooking, setSelectedBooking] = useState<any>(null);
      const [editDialogOpen, setEditDialogOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [bookedTimeSlots, setBookedTimeSlots] = useState<{
            [key: string]: string[];
      }>({});

      const [editForm, setEditForm] = useState({
            date: "",
            timeSlot: "",
            service: "",
            status: "",
            carMake: "",
            carModel: "",
      });

      const handleEditBooking = (booking: any) => {
            setSelectedBooking(booking);
            setEditForm({
                  date: booking.date,
                  timeSlot: booking.time_slot,
                  service: booking.service_id,
                  status: booking.status,
                  carMake: booking.car_make,
                  carModel: booking.car_model,
            });

            // Fetch booked time slots for this date, excluding the current booking
            fetchBookedTimeSlots(booking.date, booking.id);

            setEditDialogOpen(true);
      };

      const handleDeleteBooking = (booking: any) => {
            setSelectedBooking(booking);
            setDeleteDialogOpen(true);
      };

      const fetchBookedTimeSlots = async (
            date: string,
            excludeBookingId?: string
      ) => {
            try {
                  let query = supabase
                        .from("bookings")
                        .select("time_slot")
                        .eq("date", date);

                  if (excludeBookingId) {
                        query = query.neq("id", excludeBookingId);
                  }

                  const { data, error } = await query;

                  if (error) throw error;

                  const slots = data.map((booking) => booking.time_slot);
                  setBookedTimeSlots({ ...bookedTimeSlots, [date]: slots });

                  return slots;
            } catch (error: any) {
                  console.error("Error fetching booked time slots:", error);
                  return [];
            }
      };

      const confirmEdit = async () => {
            if (!selectedBooking) return;

            try {
                  setIsSubmitting(true);

                  // Check if the time slot is already booked (only if time or date changed)
                  if (
                        editForm.date !== selectedBooking.date ||
                        editForm.timeSlot !== selectedBooking.time_slot
                  ) {
                        const bookedSlots =
                              bookedTimeSlots[editForm.date] ||
                              (await fetchBookedTimeSlots(
                                    editForm.date,
                                    selectedBooking.id
                              ));

                        if (bookedSlots.includes(editForm.timeSlot)) {
                              toast({
                                    title: "Time slot unavailable",
                                    description:
                                          "This time slot is already booked. Please select another time.",
                                    variant: "destructive",
                              });
                              setIsSubmitting(false);
                              return;
                        }
                  }

                  const selectedService = services.find(
                        (s) => s.id === editForm.service
                  );

                  const { error } = await supabase
                        .from("bookings")
                        .update({
                              date: editForm.date,
                              time_slot: editForm.timeSlot,
                              service_id: editForm.service,
                              service_name: selectedService?.name || "",
                              price: selectedService?.price || "",
                              car_make: editForm.carMake,
                              car_model: editForm.carModel,
                              status: editForm.status,
                        })
                        .eq("id", selectedBooking.id);

                  if (error) throw error;

                  toast({
                        title: "Booking updated",
                        description:
                              "The booking has been successfully updated",
                  });

                  setEditDialogOpen(false);
                  onRefresh();
            } catch (error: any) {
                  console.error("Error updating booking:", error);
                  toast({
                        title: "Error",
                        description:
                              error.message || "Failed to update the booking",
                        variant: "destructive",
                  });
            } finally {
                  setIsSubmitting(false);
            }
      };

      const confirmDelete = async () => {
            if (!selectedBooking) return;

            try {
                  setIsSubmitting(true);

                  const { error } = await supabase
                        .from("bookings")
                        .delete()
                        .eq("id", selectedBooking.id);

                  if (error) throw error;

                  toast({
                        title: "Booking deleted",
                        description:
                              "The booking has been successfully removed",
                  });

                  setDeleteDialogOpen(false);
                  onRefresh();
            } catch (error: any) {
                  console.error("Error deleting booking:", error);
                  toast({
                        title: "Error",
                        description:
                              error.message || "Failed to delete the booking",
                        variant: "destructive",
                  });
            } finally {
                  setIsSubmitting(false);
            }
      };

      return (
            <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                              Manage Bookings
                        </h2>
                        <Button onClick={onRefresh} variant="outline" size="sm">
                              Refresh
                        </Button>
                  </div>

                  <Table>
                        <TableHeader>
                              <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                          Actions
                                    </TableHead>
                              </TableRow>
                        </TableHeader>
                        <TableBody>
                              {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                          <TableRow key={booking.id}>
                                                <TableCell>
                                                      {booking.profiles
                                                            ?.full_name ||
                                                            "N/A"}
                                                      <div className="text-xs text-muted-foreground">
                                                            {booking.profiles
                                                                  ?.email ||
                                                                  "No email"}
                                                      </div>
                                                </TableCell>

                                                <TableCell>
                                                      {booking.service_name}
                                                </TableCell>
                                                <TableCell>
                                                      {booking.date &&
                                                            format(
                                                                  new Date(
                                                                        booking.date
                                                                  ),
                                                                  "MMM d, yyyy"
                                                            )}
                                                </TableCell>
                                                <TableCell>
                                                      {booking.time_slot}
                                                </TableCell>
                                                <TableCell>
                                                      {booking.car_make}{" "}
                                                      {booking.car_model}
                                                </TableCell>
                                                <TableCell>
                                                      <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                  booking.status ===
                                                                  "confirmed"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : booking.status ===
                                                                          "completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-red-100 text-red-800"
                                                            }`}
                                                      >
                                                            {booking.status
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                                  booking.status.slice(
                                                                        1
                                                                  )}
                                                      </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                      <div className="flex justify-end space-x-2">
                                                            <Button
                                                                  variant="ghost"
                                                                  size="sm"
                                                                  onClick={() =>
                                                                        handleEditBooking(
                                                                              booking
                                                                        )
                                                                  }
                                                            >
                                                                  <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                  variant="ghost"
                                                                  size="sm"
                                                                  onClick={() =>
                                                                        handleDeleteBooking(
                                                                              booking
                                                                        )
                                                                  }
                                                            >
                                                                  <Trash className="h-4 w-4" />
                                                            </Button>
                                                      </div>
                                                </TableCell>
                                          </TableRow>
                                    ))
                              ) : (
                                    <TableRow>
                                          <TableCell
                                                colSpan={7}
                                                className="text-center py-6"
                                          >
                                                No bookings found
                                          </TableCell>
                                    </TableRow>
                              )}
                        </TableBody>
                  </Table>

                  {/* Edit Booking Dialog */}
                  <Dialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                  >
                        <DialogContent className="sm:max-w-[550px]">
                              <DialogHeader>
                                    <DialogTitle>Edit Booking</DialogTitle>
                                    <DialogDescription>
                                          Make changes to booking details.
                                    </DialogDescription>
                              </DialogHeader>

                              {selectedBooking && (
                                    <div className="grid gap-4 py-4">
                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-date">
                                                            Date
                                                      </Label>
                                                      <Input
                                                            id="edit-date"
                                                            type="date"
                                                            value={
                                                                  editForm.date
                                                            }
                                                            onChange={(e) => {
                                                                  const newDate =
                                                                        e.target
                                                                              .value;
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              date: newDate,
                                                                        })
                                                                  );
                                                                  fetchBookedTimeSlots(
                                                                        newDate,
                                                                        selectedBooking.id
                                                                  );
                                                            }}
                                                      />
                                                </div>

                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-time">
                                                            Time
                                                      </Label>
                                                      <Select
                                                            value={
                                                                  editForm.timeSlot
                                                            }
                                                            onValueChange={(
                                                                  value
                                                            ) =>
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              timeSlot: value,
                                                                        })
                                                                  )
                                                            }
                                                      >
                                                            <SelectTrigger id="edit-time">
                                                                  <SelectValue placeholder="Select time" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                  {timeSlots.map(
                                                                        (
                                                                              time
                                                                        ) => {
                                                                              const isBooked =
                                                                                    bookedTimeSlots[
                                                                                          editForm
                                                                                                .date
                                                                                    ] &&
                                                                                    bookedTimeSlots[
                                                                                          editForm
                                                                                                .date
                                                                                    ].includes(
                                                                                          time
                                                                                    );

                                                                              // Allow selection of the current time slot
                                                                              const isCurrentTimeSlot =
                                                                                    selectedBooking.time_slot ===
                                                                                    time;

                                                                              return (
                                                                                    <SelectItem
                                                                                          key={
                                                                                                time
                                                                                          }
                                                                                          value={
                                                                                                time
                                                                                          }
                                                                                          disabled={
                                                                                                isBooked &&
                                                                                                !isCurrentTimeSlot
                                                                                          }
                                                                                    >
                                                                                          {
                                                                                                time
                                                                                          }{" "}
                                                                                          {isBooked &&
                                                                                                !isCurrentTimeSlot &&
                                                                                                "(Booked)"}
                                                                                    </SelectItem>
                                                                              );
                                                                        }
                                                                  )}
                                                            </SelectContent>
                                                      </Select>
                                                </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-service">
                                                            Service
                                                      </Label>
                                                      <Select
                                                            value={
                                                                  editForm.service
                                                            }
                                                            onValueChange={(
                                                                  value
                                                            ) =>
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              service: value,
                                                                        })
                                                                  )
                                                            }
                                                      >
                                                            <SelectTrigger id="edit-service">
                                                                  <SelectValue placeholder="Select service" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                  {services.map(
                                                                        (
                                                                              service
                                                                        ) => (
                                                                              <SelectItem
                                                                                    key={
                                                                                          service.id
                                                                                    }
                                                                                    value={
                                                                                          service.id
                                                                                    }
                                                                              >
                                                                                    {
                                                                                          service.name
                                                                                    }{" "}
                                                                                    -{" "}
                                                                                    {
                                                                                          service.price
                                                                                    }
                                                                              </SelectItem>
                                                                        )
                                                                  )}
                                                            </SelectContent>
                                                      </Select>
                                                </div>

                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-status">
                                                            Status
                                                      </Label>
                                                      <Select
                                                            value={
                                                                  editForm.status
                                                            }
                                                            onValueChange={(
                                                                  value
                                                            ) =>
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              status: value,
                                                                        })
                                                                  )
                                                            }
                                                      >
                                                            <SelectTrigger id="edit-status">
                                                                  <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                  {statusOptions.map(
                                                                        (
                                                                              status
                                                                        ) => (
                                                                              <SelectItem
                                                                                    key={
                                                                                          status.value
                                                                                    }
                                                                                    value={
                                                                                          status.value
                                                                                    }
                                                                              >
                                                                                    {
                                                                                          status.label
                                                                                    }
                                                                              </SelectItem>
                                                                        )
                                                                  )}
                                                            </SelectContent>
                                                      </Select>
                                                </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-car-make">
                                                            Car Make
                                                      </Label>
                                                      <Input
                                                            id="edit-car-make"
                                                            value={
                                                                  editForm.carMake
                                                            }
                                                            onChange={(e) =>
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              carMake: e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                  )
                                                            }
                                                      />
                                                </div>

                                                <div className="space-y-2">
                                                      <Label htmlFor="edit-car-model">
                                                            Car Model
                                                      </Label>
                                                      <Input
                                                            id="edit-car-model"
                                                            value={
                                                                  editForm.carModel
                                                            }
                                                            onChange={(e) =>
                                                                  setEditForm(
                                                                        (
                                                                              prev
                                                                        ) => ({
                                                                              ...prev,
                                                                              carModel: e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                  )
                                                            }
                                                      />
                                                </div>
                                          </div>
                                    </div>
                              )}

                              <DialogFooter>
                                    <Button
                                          variant="outline"
                                          onClick={() =>
                                                setEditDialogOpen(false)
                                          }
                                          disabled={isSubmitting}
                                    >
                                          Cancel
                                    </Button>
                                    <Button
                                          onClick={confirmEdit}
                                          disabled={isSubmitting}
                                    >
                                          {isSubmitting
                                                ? "Saving..."
                                                : "Save Changes"}
                                    </Button>
                              </DialogFooter>
                        </DialogContent>
                  </Dialog>

                  {/* Delete Confirmation Dialog */}
                  <Dialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                  >
                        <DialogContent>
                              <DialogHeader>
                                    <DialogTitle>Delete Booking</DialogTitle>
                                    <DialogDescription>
                                          Are you sure you want to delete this
                                          booking? This action cannot be undone.
                                    </DialogDescription>
                              </DialogHeader>

                              {selectedBooking && (
                                    <div className="py-4">
                                          <div className="bg-muted p-4 rounded-md space-y-2">
                                                <div className="flex items-center">
                                                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                                      <span>
                                                            {format(
                                                                  new Date(
                                                                        selectedBooking.date
                                                                  ),
                                                                  "MMMM d, yyyy"
                                                            )}
                                                      </span>
                                                </div>
                                                <div className="flex items-center">
                                                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                      <span>
                                                            {
                                                                  selectedBooking.time_slot
                                                            }
                                                      </span>
                                                </div>
                                                <div>
                                                      <span className="font-medium">
                                                            {
                                                                  selectedBooking.service_name
                                                            }
                                                      </span>
                                                </div>
                                                <div>
                                                      <span className="text-sm text-muted-foreground">
                                                            {
                                                                  selectedBooking.car_make
                                                            }{" "}
                                                            {
                                                                  selectedBooking.car_model
                                                            }
                                                      </span>
                                                </div>
                                          </div>
                                    </div>
                              )}

                              <DialogFooter>
                                    <Button
                                          variant="outline"
                                          onClick={() =>
                                                setDeleteDialogOpen(false)
                                          }
                                          disabled={isSubmitting}
                                    >
                                          Cancel
                                    </Button>
                                    <Button
                                          variant="destructive"
                                          onClick={confirmDelete}
                                          disabled={isSubmitting}
                                    >
                                          {isSubmitting
                                                ? "Deleting..."
                                                : "Delete Booking"}
                                    </Button>
                              </DialogFooter>
                        </DialogContent>
                  </Dialog>
            </div>
      );
};

export default ManageBookings;
