import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import PageTransition from "@/components/transitions/PageTransition";
import { Shield, Calendar, User, Star } from "lucide-react";

const Auth: React.FC = () => {
      const benefits = [
            {
                  icon: <Calendar className="h-5 w-5" />,
                  title: "Easy Booking",
                  description:
                        "Save your details for faster checkout and manage your appointments.",
            },
            {
                  icon: <User className="h-5 w-5" />,
                  title: "Personalized Experience",
                  description:
                        "Get service recommendations based on your vehicle's history.",
            },
            {
                  icon: <Star className="h-5 w-5" />,
                  title: "Exclusive Offers",
                  description:
                        "Access member-only discounts and early booking privileges.",
            },
            {
                  icon: <Shield className="h-5 w-5" />,
                  title: "Service History",
                  description:
                        "Track your complete service history and maintenance records.",
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
                                                Account
                                          </span>
                                          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
                                                Join the Autox24 Community
                                          </h1>
                                          <p className="text-lg text-muted-foreground animate-slide-up animation-delay-100">
                                                Create an account or log in to
                                                access exclusive benefits,
                                                manage your bookings, and more.
                                          </p>
                                    </div>
                              </div>
                        </section>

                        {/* Auth Form */}
                        <section className="py-16 bg-background">
                              <div className="container mx-auto px-4">
                                    <div className="max-w-6xl mx-auto">
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                                <div className="order-2 lg:order-1">
                                                      <div className="mb-10">
                                                            <h2 className="text-2xl font-bold mb-6 animate-slide-up">
                                                                  Member
                                                                  Benefits
                                                            </h2>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                  {benefits.map(
                                                                        (
                                                                              benefit,
                                                                              index
                                                                        ) => (
                                                                              <div
                                                                                    key={
                                                                                          benefit.title
                                                                                    }
                                                                                    className={`p-6 border rounded-xl bg-white hover-lift animate-slide-up animation-delay-${
                                                                                          index *
                                                                                          100
                                                                                    }`}
                                                                              >
                                                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                                                          {
                                                                                                benefit.icon
                                                                                          }
                                                                                    </div>
                                                                                    <h3 className="text-lg font-medium mb-2">
                                                                                          {
                                                                                                benefit.title
                                                                                          }
                                                                                    </h3>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                          {
                                                                                                benefit.description
                                                                                          }
                                                                                    </p>
                                                                              </div>
                                                                        )
                                                                  )}
                                                            </div>
                                                      </div>

                                                      <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 animate-slide-up animation-delay-500">
                                                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                                                  <Shield className="h-5 w-5 mr-2 text-primary" />
                                                                  Privacy
                                                                  Commitment
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                  We value your
                                                                  privacy and
                                                                  are committed
                                                                  to protecting
                                                                  your personal
                                                                  information.
                                                                  Your data is
                                                                  securely
                                                                  stored and
                                                                  never shared
                                                                  with third
                                                                  parties
                                                                  without your
                                                                  consent.
                                                            </p>
                                                      </div>
                                                </div>

                                                <div className="order-1 lg:order-2">
                                                      <div className="bg-white p-8 rounded-xl border animate-blur-in">
                                                            <AuthForm />
                                                      </div>
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

export default Auth;
