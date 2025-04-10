
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Car, Check, Mail, Phone, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const initialFormState = {
  date: undefined as Date | undefined,
  service: "",
  timeSlot: "",
  name: "",
  email: "",
  phone: "",
  carMake: "",
  carModel: "",
};

const BookingForm: React.FC = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<{[key: string]: string[]}>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFormState(prev => ({ 
              ...prev, 
              name: data.full_name || '',
              email: data.email || user.email || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);

  const resetForm = () => {
    setFormState(initialFormState);
    setBookedTimeSlots({});
  };

  const fetchBookedTimeSlots = async (date: Date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('bookings')
        .select('time_slot')
        .eq('date', formattedDate);
      
      if (error) throw error;
      
      const slots = data.map(booking => booking.time_slot);
      setBookedTimeSlots({...bookedTimeSlots, [formattedDate]: slots});
      
      return slots;
    } catch (error: any) {
      console.error('Error fetching booked time slots:', error);
      return [];
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      await fetchBookedTimeSlots(date);
    }
    
    setFormState(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { date, service, timeSlot, name, email, phone, carMake, carModel } = formState;
    
    if (!date || !service || !timeSlot || !name || !email || !phone || !carMake || !carModel) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Check if the time slot is already booked
    const formattedDate = format(date, 'yyyy-MM-dd');
    const bookedSlots = bookedTimeSlots[formattedDate] || await fetchBookedTimeSlots(date);
    
    if (bookedSlots.includes(timeSlot)) {
      toast({
        title: "Time slot unavailable",
        description: "This time slot is already booked. Please select another time.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    const selectedService = services.find(s => s.id === service);
    
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        date: format(date, 'yyyy-MM-dd'),
        time_slot: timeSlot,
        service_id: service,
        service_name: selectedService?.name || "",
        price: selectedService?.price || "",
        car_make: carMake,
        car_model: carModel,
        phone: phone,
        status: 'confirmed'
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      
      toast({
        title: "Booking confirmed!",
        description: `Your appointment is scheduled for ${format(date, "PPP")} at ${timeSlot}`,
        variant: "default",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        resetForm();
        setIsSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "There was a problem with your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === formState.service);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {isSuccess ? (
        <div className="text-center p-10 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-medium mb-2">Booking Confirmed!</h3>
          <p className="text-muted-foreground mb-6">
            Your appointment has been scheduled for {formState.date && format(formState.date, "PPP")} at {formState.timeSlot}
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {formState.email}
          </p>
          <div className="mt-6">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/my-bookings'}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {!user && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You must be logged in to book a service. Please <a href="/auth" className="font-medium underline">sign in</a> or <a href="/auth?tab=register" className="font-medium underline">create an account</a>.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select 
                  value={formState.service} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, service: value }))}
                >
                  <SelectTrigger id="service">
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
                <Label htmlFor="date">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formState.date && "text-muted-foreground"
                      )}
                      id="date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formState.date ? format(formState.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formState.date}
                      onSelect={handleDateChange}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select 
                  value={formState.timeSlot} 
                  onValueChange={(value) => setFormState(prev => ({ ...prev, timeSlot: value }))}
                  disabled={!formState.date}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => {
                      const isBooked = formState.date && 
                        bookedTimeSlots[format(formState.date, 'yyyy-MM-dd')] && 
                        bookedTimeSlots[format(formState.date, 'yyyy-MM-dd')].includes(time);
                      
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
              
              {selectedService && (
                <div className="md:col-span-2 p-4 bg-secondary/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{selectedService.name}</span> - 
                    Approximately {selectedService.duration} minutes • {selectedService.price}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <InputWithIcon
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  icon={<User className="h-4 w-4" />}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <InputWithIcon
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <InputWithIcon
                  id="phone"
                  value={formState.phone}
                  onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 555-5555"
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="carMake">Car Make</Label>
                <InputWithIcon
                  id="carMake"
                  value={formState.carMake}
                  onChange={(e) => setFormState(prev => ({ ...prev, carMake: e.target.value }))}
                  placeholder="Toyota"
                  icon={<Car className="h-4 w-4" />}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={formState.carModel}
                  onChange={(e) => setFormState(prev => ({ ...prev, carModel: e.target.value }))}
                  placeholder="Camry"
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full hover-lift"
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By confirming your booking, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
