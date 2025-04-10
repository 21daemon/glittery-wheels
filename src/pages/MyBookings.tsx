
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  Car, 
  Clock, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/transitions/PageTransition';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const services = [
  { id: "basic", name: "Basic Wash", duration: 60, price: "$49.99" },
  { id: "premium", name: "Premium Detail", duration: 120, price: "$99.99" },
  { id: "interior", name: "Interior Deep Clean", duration: 90, price: "$79.99" },
  { id: "exterior", name: "Exterior Polish", duration: 90, price: "$79.99" },
  { id: "ceramic", name: "Ceramic Coating", duration: 180, price: "$249.99" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", 
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const MyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    date: undefined as Date | undefined,
    service: "",
    timeSlot: "",
    carMake: "",
    carModel: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<{[key: string]: string[]}>({}); 

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch your bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedTimeSlots = async (date: Date, excludeBookingId?: string) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      let query = supabase
        .from('bookings')
        .select('time_slot')
        .eq('date', formattedDate);
      
      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const slots = data.map(booking => booking.time_slot);
      setBookedTimeSlots({...bookedTimeSlots, [formattedDate]: slots});
      
      return slots;
    } catch (error: any) {
      console.error('Error fetching booked time slots:', error);
      return [];
    }
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setEditForm({
      date: new Date(booking.date),
      service: booking.service_id,
      timeSlot: booking.time_slot,
      carMake: booking.car_make,
      carModel: booking.car_model,
    });
    
    // Fetch booked time slots for this date, excluding the current booking
    fetchBookedTimeSlots(new Date(booking.date), booking.id);
    
    setEditDialogOpen(true);
  };

  const handleDeleteBooking = (booking: any) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedBooking.id);
      
      if (error) throw error;
      
      toast({
        title: 'Booking canceled',
        description: 'Your booking has been successfully canceled',
      });
      
      setDeleteDialogOpen(false);
      fetchBookings();
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel your booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      const bookedSlots = await fetchBookedTimeSlots(date, selectedBooking?.id);
      console.log('Booked slots for this date:', bookedSlots);
    }
    
    setEditForm(prev => ({ ...prev, date }));
  };

  const confirmEdit = async () => {
    if (!selectedBooking || !editForm.date || !editForm.service || !editForm.timeSlot) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if the time slot is already booked
      const formattedDate = format(editForm.date, 'yyyy-MM-dd');
      const bookedSlots = bookedTimeSlots[formattedDate] || await fetchBookedTimeSlots(editForm.date, selectedBooking.id);
      
      if (bookedSlots.includes(editForm.timeSlot)) {
        toast({
          title: 'Time slot unavailable',
          description: 'This time slot is already booked. Please select another time.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      const selectedService = services.find(s => s.id === editForm.service);
      
      const { error } = await supabase
        .from('bookings')
        .update({
          date: formattedDate,
          time_slot: editForm.timeSlot,
          service_id: editForm.service,
          service_name: selectedService?.name || "",
          price: selectedService?.price || "",
          car_make: editForm.carMake,
          car_model: editForm.carModel,
        })
        .eq('id', selectedBooking.id);
      
      if (error) throw error;
      
      toast({
        title: 'Booking updated',
        description: 'Your booking has been successfully updated',
      });
      
      setEditDialogOpen(false);
      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update your booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication required</AlertTitle>
            <AlertDescription>
              Please log in to view your bookings.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any active bookings at the moment.
              </p>
              <Button onClick={() => window.location.href = '/booking'}>
                Book a Service
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{booking.service_name}</h3>
                      <span className="text-primary font-medium">{booking.price}</span>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">
                          {format(new Date(booking.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{booking.time_slot}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">
                          {booking.car_make} {booking.car_model}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t flex space-x-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditBooking(booking)}
                        className="flex items-center"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteBooking(booking)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {selectedBooking && (
                <div className="py-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p><strong>Service:</strong> {selectedBooking.service_name}</p>
                    <p><strong>Date:</strong> {format(new Date(selectedBooking.date), 'MMMM d, yyyy')}</p>
                    <p><strong>Time:</strong> {selectedBooking.time_slot}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Keep Booking
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    'Cancel Booking'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Booking Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogDescription>
                  Make changes to your booking details.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-service">Service</Label>
                  <Select 
                    value={editForm.service} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger id="edit-service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editForm.date && "text-muted-foreground"
                        )}
                        id="edit-date"
                      >
                        <CalendarComponent className="mr-2 h-4 w-4" />
                        {editForm.date ? format(editForm.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={editForm.date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Select 
                    value={editForm.timeSlot} 
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, timeSlot: value }))}
                    disabled={!editForm.date}
                  >
                    <SelectTrigger id="edit-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => {
                        const isBooked = editForm.date && 
                          bookedTimeSlots[format(editForm.date, 'yyyy-MM-dd')] && 
                          bookedTimeSlots[format(editForm.date, 'yyyy-MM-dd')].includes(time);
                        
                        return (
                          <SelectItem 
                            key={time} 
                            value={time}
                            disabled={isBooked}
                          >
                            {time} {isBooked && '(Unavailable)'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-car-make">Car Make</Label>
                    <Input
                      id="edit-car-make"
                      value={editForm.carMake}
                      onChange={(e) => setEditForm(prev => ({ ...prev, carMake: e.target.value }))}
                      placeholder="Toyota"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-car-model">Car Model</Label>
                    <Input
                      id="edit-car-model"
                      value={editForm.carModel}
                      onChange={(e) => setEditForm(prev => ({ ...prev, carModel: e.target.value }))}
                      placeholder="Camry"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={confirmEdit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default MyBookings;
