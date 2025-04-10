
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfMonth, subMonths } from "date-fns";

// Types for our analytics data
interface BookingData {
  id: string;
  date: string;
  service_name: string;
  price: string;
  car_make: string;
  time_slot: string;
  created_at: string;
}

interface FeedbackData {
  id: string;
  rating: number;
  created_at: string;
  message: string;
}

interface DataAnalyticsProps {
  bookings: BookingData[];
  feedback: FeedbackData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DataAnalytics: React.FC<DataAnalyticsProps> = ({ bookings, feedback }) => {
  // Process booking data for visualizations
  const bookingsByService = useMemo(() => {
    const serviceCount: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const service = booking.service_name;
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });
    
    return Object.entries(serviceCount).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Process booking data by month
  const bookingsByMonth = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(startOfMonth(now), i);
      const monthKey = format(monthDate, 'MMM yyyy');
      monthlyData[monthKey] = 0;
    }
    
    // Count bookings by month
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.created_at);
      const monthKey = format(bookingDate, 'MMM yyyy');
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      bookings: count
    }));
  }, [bookings]);

  // Process car makes data
  const carMakesData = useMemo(() => {
    const carMakesCount: Record<string, number> = {};
    
    bookings.forEach(booking => {
      const make = booking.car_make || 'Unknown';
      carMakesCount[make] = (carMakesCount[make] || 0) + 1;
    });
    
    return Object.entries(carMakesCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 car makes
  }, [bookings]);

  // Process feedback ratings
  const feedbackRatings = useMemo(() => {
    const ratings: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    
    feedback.forEach(item => {
      if (item.rating >= 1 && item.rating <= 5) {
        ratings[item.rating]++;
      }
    });
    
    return Object.entries(ratings).map(([rating, count]) => ({
      rating: `${rating} Star${parseInt(rating) !== 1 ? 's' : ''}`,
      count
    }));
  }, [feedback]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (feedback.length === 0) return 0;
    
    const sum = feedback.reduce((acc, item) => acc + item.rating, 0);
    return (sum / feedback.length).toFixed(1);
  }, [feedback]);

  const chartConfig = {
    services: { label: "Services" },
    bookings: { label: "Bookings" },
    ratings: { label: "Ratings" },
    cars: { label: "Car Makes" },
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingsByService.length}</div>
            <p className="text-xs text-muted-foreground">
              Different service types
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
            <p className="text-xs text-muted-foreground">
              Customer reviews received
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">⭐ {averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">Booking Analysis</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Service</CardTitle>
                <CardDescription>Distribution of bookings by service type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={bookingsByService}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {bookingsByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Booking trend over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig}>
                  <LineChart data={bookingsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Car Makes</CardTitle>
                <CardDescription>Most common car makes in bookings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig}>
                  <BarChart data={carMakesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Ratings</CardTitle>
                <CardDescription>Distribution of customer ratings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig}>
                  <BarChart data={feedbackRatings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="count" name="Number of Ratings" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataAnalytics;
