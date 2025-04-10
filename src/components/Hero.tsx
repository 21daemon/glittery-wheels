
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero: React.FC = () => {
      const navigate = useNavigate();
      const heroRef = useRef<HTMLDivElement>(null);
      const isMobile = useIsMobile();

      useEffect(() => {
            const handleParallax = () => {
                  if (heroRef.current) {
                        const scrollY = window.scrollY;
                        const translateY = Math.min(scrollY * 0.25, 150);
                        heroRef.current.style.transform = `translateY(${translateY}px)`;
                  }
            };

            window.addEventListener("scroll", handleParallax);
            return () => window.removeEventListener("scroll", handleParallax);
      }, []);

      return (
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
                  {/* Background with gradient */}
                  <div
                        ref={heroRef}
                        className="absolute inset-0 bg-gradient-to-b from-luxury-900 via-luxury-950 to-luxury-900"
                  />

                  {/* Light beam effects */}
                  <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] translate-y-1/4"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                        <div className="flex justify-center items-center gap-2 mb-6">
                            <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-wide bg-primary/10 text-white rounded-full backdrop-blur-md animate-fade-in">
                                  Premium Car Detailing
                            </span>
                            <span className="inline-flex items-center px-3 py-1 text-xs bg-white/10 text-white rounded-full backdrop-blur-md animate-fade-in animation-delay-200">
                                <Star className="h-3.5 w-3.5 mr-1 text-amber-400" /> 5.0 Rated Service
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
                              Exceptional Car Care for the <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">Discerning Driver</span>
                        </h1>

                        <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                              Meticulous attention to detail. Premium products.
                              Expert technicians. Experience car care that
                              transcends the ordinary.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
                              <Button
                                    size={isMobile ? "default" : "lg"}
                                    onClick={() => navigate("/booking")}
                                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black hover:text-white hover-lift group flex items-center shadow-lg"
                              >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Book Now
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                              <Button
                                    variant="outline"
                                    size={isMobile ? "default" : "lg"}
                                    onClick={() => navigate("/services")}
                                    className="bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover-lift backdrop-blur-sm"
                              >
                                    Our Services
                              </Button>
                        </div>
                        
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up animation-delay-400">
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-white text-lg font-semibold mb-1">Premium Detailing</h3>
                                <p className="text-white/70 text-sm">Using only high-end products</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-white text-lg font-semibold mb-1">Skilled Technicians</h3>
                                <p className="text-white/70 text-sm">Years of professional experience</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-white text-lg font-semibold mb-1">Satisfaction Guaranteed</h3>
                                <p className="text-white/70 text-sm">100% customer satisfaction</p>
                            </div>
                        </div>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-950 to-transparent" />
            </section>
      );
};

export default Hero;
