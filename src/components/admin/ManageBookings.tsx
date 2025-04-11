
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ChevronDown, ArrowUpDown, Search } from 'lucide-react';
import ManageBookingDetails from './ManageBookingDetails';

interface BookingsProps {
  bookings: any[];
  onRefresh: () => Promise<void>;
}

const ManageBookings: React.FC<BookingsProps> = ({ bookings, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const { toast } = useToast();

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    const searchString = (
      (booking.profiles?.full_name || '') +
      (booking.profiles?.email || '') +
      booking.service_name +
      booking.car_make +
      booking.car_model
    ).toLowerCase();
    
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sort bookings based on selected column and direction
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'customer') {
      const nameA = a.profiles?.full_name || '';
      const nameB = b.profiles?.full_name || '';
      return sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === 'service') {
      return sortDirection === 'asc'
        ? a.service_name.localeCompare(b.service_name)
        : b.service_name.localeCompare(a.service_name);
    } else if (sortBy === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Update the status in the selected booking
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status: newStatus
        });
      }
      
      // Refresh the bookings list
      await onRefresh();
      
      toast({
        title: "Status updated",
        description: `Booking status changed to ${newStatus.replace('_', ' ')}`,
      });
      
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update booking status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Manage Bookings</h2>
        <Button onClick={onRefresh} size="sm" variant="outline" className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-md px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 focus-visible:ring-0 bg-transparent"
        />
      </div>
      
      {selectedBooking ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setSelectedBooking(null)}
          >
            ← Back to Bookings
          </Button>
          
          <ManageBookingDetails 
            booking={selectedBooking} 
            onStatusUpdate={handleUpdateStatus} 
          />
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="cursor-pointer w-[150px]" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('customer')}>
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('service')}>
                  <div className="flex items-center gap-1">
                    Service
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.length > 0 ? (
                sortedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {new Date(booking.date).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">{booking.time_slot}</div>
                    </TableCell>
                    <TableCell>
                      {booking.profiles?.full_name || 'N/A'}
                      <div className="text-xs text-muted-foreground">{booking.car_make} {booking.car_model}</div>
                      {!booking.profiles?.email && (
                        <div className="text-xs text-amber-500">No email available</div>
                      )}
                    </TableCell>
                    <TableCell>{booking.service_name}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(booking)}
                      >
                        Details
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No bookings found matching your search." : "No bookings found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
