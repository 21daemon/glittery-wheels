
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import PageTransition from '@/components/transitions/PageTransition';
import { CalendarCheck, Clock, CreditCard, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Booking: React.FC = () => {
  const { user } = useAuth();
  const businessHours = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const infoCards = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Standard Service Times",
      description: "Most of our services take between 1-3 hours depending on the package and vehicle size."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payment Methods",
      description: "We accept all major credit cards, digital payments, and cash."
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "Appointment Policy",
      description: "Please arrive 10 minutes before your scheduled time. 24-hour cancellation notice required."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition>
        {/* Header */}
        <section className="pt-24 pb-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-4 animate-fade-in">
                Book Your Service
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
                Schedule Your Car's Transformation
              </h1>
              <p className="text-lg text-muted-foreground animate-slide-up animation-delay-100">
                Select your preferred service, date, and time, and let us handle the rest.
                Your vehicle deserves the best care available.
              </p>
              
              {user && (
                <div className="mt-6 animate-slide-up animation-delay-200">
                  <Button variant="outline" onClick={() => window.location.href = '/my-bookings'} className="flex items-center gap-2">
                    View My Bookings <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Booking Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white p-8 rounded-xl border animate-blur-in">
                    <h2 className="text-2xl font-bold mb-6">Book Your Appointment</h2>
                    <BookingForm />
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Business Hours */}
                  <div className="bg-white p-6 rounded-xl border animate-slide-up">
                    <h3 className="text-lg font-medium mb-4">Business Hours</h3>
                    <ul className="space-y-2">
                      {businessHours.map((item) => (
                        <li key={item.day} className="flex justify-between text-sm">
                          <span className="font-medium">{item.day}</span>
                          <span className={item.day === "Sunday" ? "text-red-500" : "text-muted-foreground"}>
                            {item.hours}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Location */}
                  <div className="bg-white p-6 rounded-xl border animate-slide-up animation-delay-100">
                    <h3 className="text-lg font-medium mb-4">Our Location</h3>
                    <div className="flex items-start mb-3">
                      <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm">123 Detail Street</p>
                        <p className="text-sm">Carville, CA 90210</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-2" />
                      <p className="text-sm">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  {infoCards.map((card, index) => (
                    <div 
                      key={card.title} 
                      className={`bg-white p-6 rounded-xl border animate-slide-up animation-delay-${(index + 2) * 100}`}
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                          {card.icon}
                        </div>
                        <h3 className="text-lg font-medium">{card.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Booking;
