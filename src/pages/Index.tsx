import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import PageTransition from "@/components/transitions/PageTransition";
import { Button } from "@/components/ui/button";
import {
      ArrowRight,
      Car,
      Check,
      Clock,
      CreditCard,
      Shield,
      Star,
      Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
      // Featured services
      const services = [
            {
                  title: "Basic Wash",
                  description:
                        "Thorough exterior wash, wheel cleaning, and hand drying.",
                  price: "$49.99",
                  imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
                  popular: false,
            },
            {
                  title: "Premium Detail",
                  description:
                        "Complete interior & exterior detail with hand wax finish.",
                  price: "$99.99",
                  imageUrl: "https://images.unsplash.com/photo-1622329821376-a19fd6002562?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  popular: true,
            },
            {
                  title: "Ceramic Coating",
                  description:
                        "Professional-grade ceramic coating for long-lasting protection.",
                  price: "$249.99",
                  imageUrl: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
                  popular: false,
            },
      ];

      // Reviews
      const reviews = [
            {
                  name: "Michael Thompson",
                  content: "Absolutely incredible service! My car looks better than when I bought it. The attention to detail is unmatched.",
                  rating: 5,
            },
            {
                  name: "Sarah Johnson",
                  content: "I've tried multiple detailing services, and Autox24 stands above them all. Professional, thorough, and worth every penny.",
                  rating: 5,
            },
            {
                  name: "David Chen",
                  content: "The ceramic coating has kept my car looking fantastic for months. Highly recommend their premium services.",
                  rating: 5,
            },
      ];

      // Features
      const features = [
            {
                  icon: <Check className="w-5 h-5" />,
                  title: "Guaranteed Quality",
                  description:
                        "Every service comes with our satisfaction guarantee",
            },
            {
                  icon: <Shield className="w-5 h-5" />,
                  title: "Premium Products",
                  description:
                        "We use only the highest quality cleaning products",
            },
            {
                  icon: <Clock className="w-5 h-5" />,
                  title: "Efficient Service",
                  description: "Most services completed in under 2 hours",
            },
            {
                  icon: <CreditCard className="w-5 h-5" />,
                  title: "Easy Payment",
                  description: "Secure payment options for your convenience",
            },
      ];

      return (
            <div className="min-h-screen flex flex-col">
                  <Navbar />

                  <PageTransition>
                        {/* Hero Section */}
                        <Hero />

                        {/* Featured Services */}
                        <section className="py-20 bg-background">
                              <div className="container mx-auto px-4">
                                    <div className="text-center mb-12">
                                          <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-4 animate-fade-in">
                                                Our Services
                                          </span>
                                          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
                                                Detail Packages for Every Need
                                          </h2>
                                          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
                                                Choose from our range of premium
                                                car detailing services, each
                                                designed to restore and protect
                                                your vehicle.
                                          </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                          {services.map((service, index) => (
                                                <ServiceCard
                                                      key={service.title}
                                                      {...service}
                                                      className={`animate-blur-in animation-delay-${
                                                            index * 100
                                                      }`}
                                                />
                                          ))}
                                    </div>

                                    <div className="text-center">
                                          <Link to="/services">
                                                <Button
                                                      variant="outline"
                                                      size="lg"
                                                      className="animate-fade-in animation-delay-500 hover-lift group"
                                                >
                                                      View All Services
                                                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                          </Link>
                                    </div>
                              </div>
                        </section>

                        {/* Why Choose Us */}
                        <section className="py-20 bg-secondary/50">
                              <div className="container mx-auto px-4">
                                    <div className="text-center mb-12">
                                          <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-4 animate-fade-in">
                                                Why Choose Us
                                          </span>
                                          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
                                                The Autox24 Difference
                                          </h2>
                                          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
                                                We're not just cleaning cars;
                                                we're providing an experience
                                                that redefines what car care
                                                should be.
                                          </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                          {features.map((feature, index) => (
                                                <div
                                                      key={feature.title}
                                                      className={`p-6 border rounded-xl bg-white shadow-sm hover-lift animate-slide-up animation-delay-${
                                                            index * 100
                                                      }`}
                                                >
                                                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                                            {feature.icon}
                                                      </div>
                                                      <h3 className="text-lg font-medium mb-2">
                                                            {feature.title}
                                                      </h3>
                                                      <p className="text-muted-foreground text-sm">
                                                            {
                                                                  feature.description
                                                            }
                                                      </p>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </section>

                        {/* Testimonials */}
                        <section className="py-20 bg-background">
                              <div className="container mx-auto px-4">
                                    <div className="text-center mb-12">
                                          <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide inline-block mb-4 animate-fade-in">
                                                Testimonials
                                          </span>
                                          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
                                                What Our Customers Say
                                          </h2>
                                          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-up animation-delay-100">
                                                Don't just take our word for
                                                it—hear from customers who've
                                                experienced the Autox24
                                                difference.
                                          </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                          {reviews.map((review, index) => (
                                                <div
                                                      key={review.name}
                                                      className={`p-6 border rounded-xl bg-white shadow-sm animate-blur-in animation-delay-${
                                                            index * 100
                                                      }`}
                                                >
                                                      <div className="flex mb-4">
                                                            {[...Array(5)].map(
                                                                  (_, i) => (
                                                                        <Star
                                                                              key={
                                                                                    i
                                                                              }
                                                                              className={`h-4 w-4 ${
                                                                                    i <
                                                                                    review.rating
                                                                                          ? "fill-yellow-400 text-yellow-400"
                                                                                          : "text-gray-300"
                                                                              }`}
                                                                        />
                                                                  )
                                                            )}
                                                      </div>
                                                      <p className="text-sm mb-4 italic">
                                                            "{review.content}"
                                                      </p>
                                                      <p className="text-sm font-medium">
                                                            {review.name}
                                                      </p>
                                                </div>
                                          ))}
                                    </div>

                                    <div className="text-center mt-12">
                                          <Link to="/feedback">
                                                <Button
                                                      variant="outline"
                                                      size="lg"
                                                      className="animate-fade-in animation-delay-500 hover-lift"
                                                >
                                                      Read More Reviews
                                                </Button>
                                          </Link>
                                    </div>
                              </div>
                        </section>

                        {/* CTA */}
                        <section className="py-16 bg-primary text-primary-foreground">
                              <div className="container mx-auto px-4">
                                    <div className="flex flex-col md:flex-row items-center justify-between">
                                          <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                                                <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-slide-up">
                                                      Ready to Transform Your
                                                      Car?
                                                </h2>
                                                <p className="max-w-lg opacity-90 animate-slide-up animation-delay-100">
                                                      Book your appointment
                                                      today and experience the
                                                      premium car care that's
                                                      setting a new standard.
                                                </p>
                                          </div>
                                          <Link to="/booking">
                                                <Button
                                                      size="lg"
                                                      variant="outline"
                                                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover-lift animate-slide-up animation-delay-200 group"
                                                >
                                                      Book Now
                                                      <Zap className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                </Button>
                                          </Link>
                                    </div>
                              </div>
                        </section>
                  </PageTransition>

                  <Footer />
            </div>
      );
};

export default Index;
