import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import PageTransition from "@/components/transitions/PageTransition";
import { Button } from "@/components/ui/button";
import {
      Car,
      Droplets,
      Paintbrush,
      Scissors,
      SprayCan,
      SquareAsterisk,
      Shrub,
      Wind,
      Check,
      Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const Services: React.FC = () => {
      const services = [
            {
                  title: "Basic Wash",
                  description:
                        "Thorough exterior wash, wheel cleaning, and hand drying.",
                  price: "$49.99",
                  imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
                  icon: <Droplets />,
                  features: [
                        "Exterior hand wash",
                        "Wheel cleaning",
                        "Tire shine",
                        "Window cleaning",
                        "Hand drying",
                  ],
                  duration: "45 minutes",
            },
            {
                  title: "Interior Detail",
                  description:
                        "Deep cleaning of all interior surfaces, including seats, carpets, and trim.",
                  price: "$79.99",
                  imageUrl: "https://images.unsplash.com/photo-1622329821376-a19fd6002562?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0",
                  icon: <Wind />,
                  features: [
                        "Vacuum all surfaces",
                        "Clean all interior glass",
                        "Wipe down dashboard and trim",
                        "Shampoo carpets and seats",
                        "Condition leather surfaces",
                  ],
                  duration: "90 minutes",
            },
            {
                  title: "Premium Detail",
                  description:
                        "Complete interior & exterior detail with hand wax finish.",
                  price: "$99.99",
                  imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  icon: <Shrub />,
                  features: [
                        "Basic wash service",
                        "Interior detail service",
                        "Clay bar treatment",
                        "Carnauba wax application",
                        "Tire dressing",
                  ],
                  duration: "2 hours",
                  popular: true,
            },
            {
                  title: "Clay Bar Treatment",
                  description:
                        "Remove embedded contaminants for a glass-smooth finish.",
                  price: "$69.99",
                  imageUrl: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  icon: <Scissors />,
                  features: [
                        "Full exterior wash",
                        "Clay bar decontamination",
                        "Paint inspection",
                        "Final polish",
                        "Sealant application",
                  ],
                  duration: "1 hour",
            },
            {
                  title: "Paint Correction",
                  description:
                        "Machine polishing to remove swirls, scratches, and imperfections.",
                  price: "$199.99",
                  imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
                  icon: <Paintbrush />,
                  features: [
                        "Multi-stage machine polishing",
                        "Swirl and scratch removal",
                        "Paint depth measurement",
                        "Finishing polish",
                        "Sealant application",
                  ],
                  duration: "4-6 hours",
            },
            {
                  title: "Ceramic Coating",
                  description:
                        "Professional-grade ceramic coating for long-lasting protection.",
                  price: "$249.99",
                  imageUrl: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
                  icon: <SprayCan />,
                  features: [
                        "Paint decontamination",
                        "Paint correction",
                        "Professional ceramic coating application",
                        "Curing time",
                        "2-year protection guarantee",
                  ],
                  duration: "1-2 days",
            },
      ];

      const packages = [
            {
                  title: "New Car Protection",
                  description:
                        "Protect your investment from day one with our comprehensive new car package.",
                  price: "$299.99",
                  features: [
                        "Paint protection film on high-impact areas",
                        "Ceramic coating application",
                        "Interior fabric protection",
                        "Window tinting consultation",
                  ],
                  recommended: false,
            },
            {
                  title: "Pre-Sale Preparation",
                  description:
                        "Maximize your car's value with our complete pre-sale detailing package.",
                  price: "$249.99",
                  features: [
                        "Full exterior detail",
                        "Complete interior detail",
                        "Minor scratch repair",
                        "Engine bay cleaning",
                        "Professional photos for listings",
                  ],
                  recommended: true,
            },
            {
                  title: "Seasonal Protection",
                  description:
                        "Prepare your vehicle for changing weather conditions with specialized protection.",
                  price: "$179.99",
                  features: [
                        "Exterior wash and decontamination",
                        "Weather-appropriate sealant application",
                        "Undercarriage treatment",
                        "Interior conditioning",
                        "Wiper and fluids check",
                  ],
                  recommended: false,
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
                                                Our Services
                                          </span>
                                          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
                                                Premium Car Care Services
                                          </h1>
                                          <p className="text-lg text-muted-foreground animate-slide-up animation-delay-100">
                                                Experience the difference with
                                                our range of professional
                                                detailing services, each
                                                tailored to meet your specific
                                                needs and exceed expectations.
                                          </p>

                                          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slide-up animation-delay-200">
                                                <Link to="/booking">
                                                      <Button
                                                            size="lg"
                                                            className="hover-lift"
                                                      >
                                                            Book a Service
                                                      </Button>
                                                </Link>
                                                <a href="#packages">
                                                      <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="hover-lift"
                                                      >
                                                            View Packages
                                                      </Button>
                                                </a>
                                          </div>
                                    </div>
                              </div>
                        </section>

                        {/* Individual Services */}
                        <section className="py-20 bg-background">
                              <div className="container mx-auto px-4">
                                    <div className="text-center mb-16">
                                          <h2 className="text-3xl font-bold mb-4">
                                                Individual Services
                                          </h2>
                                          <p className="text-muted-foreground max-w-2xl mx-auto">
                                                Choose from our selection of
                                                individual services to keep your
                                                vehicle looking its best.
                                          </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {services.map((service, index) => (
                                                <div
                                                      key={service.title}
                                                      className={`border rounded-xl overflow-hidden bg-white hover-lift animate-blur-in animation-delay-${
                                                            index * 100
                                                      }`}
                                                >
                                                      <div className="aspect-[4/3] w-full relative img-hover-zoom">
                                                            {service.popular && (
                                                                  <div className="absolute top-4 right-4 z-10">
                                                                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full animate-pulse">
                                                                              Popular
                                                                        </span>
                                                                  </div>
                                                            )}
                                                            <img
                                                                  src={
                                                                        service.imageUrl
                                                                  }
                                                                  alt={
                                                                        service.title
                                                                  }
                                                                  className="w-full h-full object-cover"
                                                            />
                                                      </div>

                                                      <div className="p-6">
                                                            <div className="flex items-center mb-4">
                                                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                                                        {
                                                                              service.icon
                                                                        }
                                                                  </div>
                                                                  <h3 className="text-xl font-semibold">
                                                                        {
                                                                              service.title
                                                                        }
                                                                  </h3>
                                                            </div>

                                                            <p className="text-muted-foreground mb-4">
                                                                  {
                                                                        service.description
                                                                  }
                                                            </p>

                                                            <div className="mb-4 text-sm text-muted-foreground flex items-center">
                                                                  <Clock className="h-4 w-4 mr-1" />
                                                                  <span>
                                                                        {
                                                                              service.duration
                                                                        }
                                                                  </span>
                                                            </div>

                                                            <ul className="mb-6 space-y-2">
                                                                  {service.features.map(
                                                                        (
                                                                              feature,
                                                                              i
                                                                        ) => (
                                                                              <li
                                                                                    key={
                                                                                          i
                                                                                    }
                                                                                    className="flex items-start"
                                                                              >
                                                                                    <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                                                                                    <span className="text-sm">
                                                                                          {
                                                                                                feature
                                                                                          }
                                                                                    </span>
                                                                              </li>
                                                                        )
                                                                  )}
                                                            </ul>

                                                            <div className="flex items-center justify-between">
                                                                  <span className="text-xl font-medium">
                                                                        {
                                                                              service.price
                                                                        }
                                                                  </span>
                                                                  <Link to="/booking">
                                                                        <Button>
                                                                              Book
                                                                              Now
                                                                        </Button>
                                                                  </Link>
                                                            </div>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </section>
                  </PageTransition>

                  <Footer />
            </div>
      );
};

export default Services;
