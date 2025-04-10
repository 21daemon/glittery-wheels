
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, MapPin, Phone, User, Clock, DollarSign, Camera } from 'lucide-react';
import ProgressPhotoUploader from './ProgressPhotoUploader';

interface Booking {
  id: string;
  user_id: string;
  date: string;
  time_slot: string;
  service_name: string;
  price: string;
  car_make: string;
  car_model: string;
  status: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  phone?: string;
  address?: string;
}

interface ManageBookingDetailsProps {
  booking: Booking;
  onStatusUpdate: (bookingId: string, newStatus: string) => Promise<void>;
}

const ManageBookingDetails: React.FC<ManageBookingDetailsProps> = ({
  booking,
  onStatusUpdate
}) => {
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'in_progress':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    await onStatusUpdate(booking.id, newStatus);
    
    // If status changed to in_progress, show the photo uploader
    if (newStatus === 'in_progress') {
      setShowPhotoUploader(true);
    }
  };

  const carDetails = `${booking.car_make} ${booking.car_model}`;

  return (
    <Card className="bg-luxury-800/50 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-amber-400">Booking Details</CardTitle>
          <Badge 
            className={`${getStatusColor(booking.status)} text-white`}
          >
            {booking.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Customer:</span>
              <span className="font-medium text-white">{booking.profiles?.full_name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Phone:</span>
              <span className="font-medium text-white">{booking.phone || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Date:</span>
              <span className="font-medium text-white">{formatDate(booking.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Time:</span>
              <span className="font-medium text-white">{booking.time_slot}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Vehicle:</span>
              <span className="font-medium text-white">{carDetails}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-white/70">Service:</span>
              <span className="font-medium text-white">{booking.service_name} - {booking.price}</span>
            </div>
            
            {booking.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-white/70">Address:</span>
                <span className="font-medium text-white">{booking.address}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              onClick={() => handleStatusChange('confirmed')}
            >
              Confirm
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => handleStatusChange('in_progress')}
            >
              In Progress
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              onClick={() => handleStatusChange('completed')}
            >
              Complete
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => handleStatusChange('cancelled')}
            >
              Cancel
            </Button>
          </div>
        </div>
        
        {booking.status === 'in_progress' && (
          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-white">Progress Updates</h3>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                onClick={() => setShowPhotoUploader(!showPhotoUploader)}
              >
                <Camera className="h-4 w-4" />
                {showPhotoUploader ? 'Hide' : 'Send Photo Update'}
              </Button>
            </div>
            
            {showPhotoUploader && (
              <ProgressPhotoUploader 
                bookingId={booking.id} 
                customerEmail={booking.profiles?.email || ''} 
                carDetails={carDetails}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageBookingDetails;
