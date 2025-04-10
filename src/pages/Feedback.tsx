
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeedbackForm from '@/components/FeedbackForm';
import PageTransition from '@/components/transitions/PageTransition';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const Feedback: React.FC = () => {
  const testimonials = [
    {
      name: "Michael Thompson",
      service: "Premium Detail",
      content: "Absolutely incredible service! My car looks better than when I bought it. The attention to detail is unmatched.",
      rating: 5,
      date: "August 15, 2023",
    },
    {
      name: "Sarah Johnson",
      service: "Interior Deep Clean",
      content: "I've tried multiple detailing services, and Autox24 stands above them all. Professional, thorough, and worth every penny.",
      rating: 5,
      date: "August 3, 2023",
    },
    {
      name: "David Chen",
      service: "Ceramic Coating",
      content: "The ceramic coating has kept my car looking fantastic for months. Highly recommend their premium services.",
      rating: 5,
      date: "July 22, 2023",
    },
    {
      name: "Emily Wilson",
      service: "Premium Detail",
      content: "Exceptional service from start to finish. The team was professional, friendly, and my car looks amazing!",
      rating: 5,
      date: "July 10, 2023",
    },
    {
      name: "James Rodriguez",
      service: "Basic Wash",
      content: "Good service overall, though I think the premium packages offer better value for money.",
      rating: 4,
      date: "June 28, 2023",
    },
    {
      name: "Olivia Martinez",
      service: "Paint Correction",
      content: "I had deep scratches on my hood that I thought were permanent. After the paint correction service, they're completely gone. Magic!",
      rating: 5,
      date: "June 15, 2023",
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
                Customer Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
                What Our Customers Say
              </h1>
              <p className="text-lg text-muted-foreground animate-slide-up animation-delay-100">
                Read testimonials from satisfied customers and share your own experience with our services.
              </p>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h2 className="text-2xl font-bold">Customer Testimonials</h2>
                
                <div className="flex items-center mt-4 md:mt-0 space-x-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <span className="block font-medium">4.9/5</span>
                      <span className="block text-xs text-muted-foreground">Average Rating</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <span className="block font-medium">200+</span>
                      <span className="block text-xs text-muted-foreground">Reviews</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <span className="block font-medium">98%</span>
                      <span className="block text-xs text-muted-foreground">Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.name + index}
                    className={`bg-white p-6 rounded-xl border hover-lift animate-blur-in animation-delay-${index * 100}`}
                  >
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-sm mb-4 italic">"{testimonial.content}"</p>
                    
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-primary">{testimonial.service}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Feedback Form */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-4 animate-fade-in">
                  Your Feedback
                </span>
                <h2 className="text-3xl font-bold mb-4 animate-slide-up">
                  Share Your Experience
                </h2>
                <p className="text-muted-foreground animate-slide-up animation-delay-100">
                  We value your feedback and continuously strive to improve our services.
                  Please take a moment to share your experience with us.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border animate-blur-in">
                <FeedbackForm />
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Feedback;
