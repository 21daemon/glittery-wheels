import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
      const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
      };

      return (
            <footer className="bg-secondary/50 backdrop-blur-sm">
                  <div className="container mx-auto px-4 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                              {/* Brand and description */}
                              <div className="md:col-span-1">
                                    <Link
                                          to="/"
                                          className="text-2xl font-bold tracking-tight"
                                    >
                                          <span>Clean</span>
                                          <span className="text-primary dark:text-primary-foreground">
                                                Haven
                                          </span>
                                    </Link>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                          Premium car detailing services that
                                          deliver exceptional results every
                                          time.
                                    </p>
                                    <div className="flex space-x-4 mt-6">
                                          <a
                                                href="#"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                          >
                                                <Facebook className="h-5 w-5" />
                                                <span className="sr-only">
                                                      Facebook
                                                </span>
                                          </a>
                                          <a
                                                href="#"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                          >
                                                <Instagram className="h-5 w-5" />
                                                <span className="sr-only">
                                                      Instagram
                                                </span>
                                          </a>
                                          <a
                                                href="#"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                          >
                                                <Twitter className="h-5 w-5" />
                                                <span className="sr-only">
                                                      Twitter
                                                </span>
                                          </a>
                                    </div>
                              </div>

                              {/* Links */}
                              <div>
                                    <h3 className="text-sm font-medium">
                                          Services
                                    </h3>
                                    <ul className="mt-3 space-y-2">
                                          <li>
                                                <Link
                                                      to="/services"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Interior Detailing
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/services"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Exterior Washing
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/services"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Premium Waxing
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/services"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Ceramic Coating
                                                </Link>
                                          </li>
                                    </ul>
                              </div>

                              <div>
                                    <h3 className="text-sm font-medium">
                                          Company
                                    </h3>
                                    <ul className="mt-3 space-y-2">
                                          <li>
                                                <Link
                                                      to="/about"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      About Us
                                                </Link>
                                          </li>
                                          <li>
                                                <Link
                                                      to="/feedback"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Testimonials
                                                </Link>
                                          </li>
                                          <li>
                                                <a
                                                      href="#"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Careers
                                                </a>
                                          </li>
                                          <li>
                                                <a
                                                      href="#"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Contact
                                                </a>
                                          </li>
                                    </ul>
                              </div>

                              <div>
                                    <h3 className="text-sm font-medium">
                                          Legal
                                    </h3>
                                    <ul className="mt-3 space-y-2">
                                          <li>
                                                <a
                                                      href="#"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Privacy Policy
                                                </a>
                                          </li>
                                          <li>
                                                <a
                                                      href="#"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Terms of Service
                                                </a>
                                          </li>
                                          <li>
                                                <a
                                                      href="#"
                                                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                      Cookie Policy
                                                </a>
                                          </li>
                                    </ul>
                              </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
                              <p className="text-sm text-muted-foreground">
                                    &copy; {new Date().getFullYear()} Autox24.
                                    All rights reserved.
                              </p>
                              <Button
                                    variant="outline"
                                    size="icon"
                                    className="mt-4 md:mt-0 hover:translate-y-[-5px] transition-transform"
                                    onClick={scrollToTop}
                              >
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="sr-only">
                                          Scroll to top
                                    </span>
                              </Button>
                        </div>
                  </div>
            </footer>
      );
};

export default Footer;
