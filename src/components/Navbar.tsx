import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: "Book Now", href: "/booking" },
      { name: "Feedback", href: "/feedback" },
];

const Navbar = () => {
      const { pathname } = useLocation();
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const { user, isAdmin, signOut } = useAuth();
      const { toast } = useToast();
      const isMobile = useIsMobile();
      const [adminVisible, setAdminVisible] = useState(false);

      useEffect(() => {
            const checkAdminStatus = async () => {
                  if (user) {
                        try {
                              const { data, error } = await supabase
                                    .from("profiles")
                                    .select("is_admin")
                                    .eq("id", user.id)
                                    .single();

                              if (error) {
                                    console.error(
                                          "Error fetching admin status:",
                                          error
                                    );
                                    setAdminVisible(false);
                              } else {
                                    setAdminVisible(data?.is_admin || false);
                              }
                        } catch (error) {
                              console.error(
                                    "Error checking admin status:",
                                    error
                              );
                              setAdminVisible(false);
                        }
                  } else {
                        setAdminVisible(false);
                  }
            };

            checkAdminStatus();
      }, [user]);

      const handleSignOut = async () => {
            try {
                  await signOut();
                  toast({
                        title: "Signed out successfully",
                  });
            } catch (error) {
                  console.error("Error signing out:", error);
                  toast({
                        title: "Failed to sign out",
                        variant: "destructive",
                  });
            }
      };

      // Define user navigation items
      const userNavItems = [
            {
                  name: "My Bookings",
                  href: "/my-bookings",
                  icon: <User className="mr-2 h-4 w-4" />,
            },
      ];

      // Add admin dashboard link if user is admin
      if (adminVisible) {
            userNavItems.push({
                  name: "Admin Dashboard",
                  href: "/admin",
                  icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            });
      }

      return (
            <div
                  className={cn(
                        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60",
                        pathname === "/"
                              ? "border-b border-transparent"
                              : "border-b"
                  )}
            >
                  <nav className="flex items-center justify-between mx-auto p-4 max-w-screen-xl">
                        <div className="flex items-center">
                              <Link
                                    to="/"
                                    className="flex-shrink-0 flex items-center mr-8"
                              >
                                    <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                          CarDetailing
                                    </span>
                              </Link>

                              {/* Desktop menu */}
                              <div className="hidden md:flex space-x-8">
                                    {navItems.map((item) => (
                                          <Link
                                                key={item.name}
                                                to={item.href}
                                                className={cn(
                                                      "text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:rounded-full after:origin-left after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                                                      pathname === item.href
                                                            ? "text-primary after:bg-primary after:scale-x-100"
                                                            : "text-muted-foreground hover:text-foreground after:bg-primary/60"
                                                )}
                                          >
                                                {item.name}
                                          </Link>
                                    ))}

                                    {/* Show Admin link in desktop menu if user is admin */}
                                    {adminVisible && (
                                          <Link
                                                to="/admin"
                                                className={cn(
                                                      "text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:rounded-full after:origin-left after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                                                      pathname === "/admin"
                                                            ? "text-primary after:bg-primary after:scale-x-100"
                                                            : "text-muted-foreground hover:text-foreground after:bg-primary/60",
                                                      "flex items-center"
                                                )}
                                          >
                                                <span className="relative">
                                                      Admin
                                                      <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-primary"></span>
                                                </span>
                                          </Link>
                                    )}
                              </div>
                        </div>

                        <div className="flex items-center space-x-4">
                              <ModeToggle />

                              {user ? (
                                    <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                                <Button
                                                      variant="ghost"
                                                      className="relative rounded-full hover:bg-muted"
                                                >
                                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-primary" />
                                                      </div>
                                                      {adminVisible && (
                                                            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary"></span>
                                                      )}
                                                </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                                align="end"
                                                className="w-56"
                                          >
                                                <DropdownMenuLabel>
                                                      My Account{" "}
                                                      {adminVisible && (
                                                            <span className="ml-2 text-xs font-normal text-primary">
                                                                  (Admin)
                                                            </span>
                                                      )}
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                {userNavItems.map((item) => (
                                                      <DropdownMenuItem
                                                            key={item.name}
                                                            asChild
                                                      >
                                                            <Link
                                                                  to={item.href}
                                                                  className="flex items-center"
                                                            >
                                                                  {item.icon}
                                                                  <span>
                                                                        {
                                                                              item.name
                                                                        }
                                                                  </span>
                                                            </Link>
                                                      </DropdownMenuItem>
                                                ))}

                                                <DropdownMenuItem
                                                      onClick={handleSignOut}
                                                      className="text-destructive"
                                                >
                                                      <LogOut className="mr-2 h-4 w-4" />
                                                      <span>Log out</span>
                                                </DropdownMenuItem>
                                          </DropdownMenuContent>
                                    </DropdownMenu>
                              ) : (
                                    <Button
                                          asChild
                                          size="sm"
                                          className="hover-lift"
                                    >
                                          <Link to="/auth">Sign In</Link>
                                    </Button>
                              )}

                              <button
                                    type="button"
                                    className="md:hidden inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                          setMobileMenuOpen(!mobileMenuOpen)
                                    }
                              >
                                    <span className="sr-only">
                                          Open main menu
                                    </span>
                                    {mobileMenuOpen ? (
                                          <X className="h-6 w-6" />
                                    ) : (
                                          <Menu className="h-6 w-6" />
                                    )}
                              </button>
                        </div>
                  </nav>

                  {/* Mobile menu */}
                  {mobileMenuOpen && (
                        <div className="md:hidden px-4 pb-4 pt-2 border-t animate-fade-in">
                              <div className="flex flex-col space-y-3">
                                    {navItems.map((item) => (
                                          <Link
                                                key={item.name}
                                                to={item.href}
                                                className={cn(
                                                      "px-3 py-2 text-base font-medium rounded-md transition-colors",
                                                      pathname === item.href
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-muted"
                                                )}
                                                onClick={() =>
                                                      setMobileMenuOpen(false)
                                                }
                                          >
                                                {item.name}
                                          </Link>
                                    ))}

                                    {/* Show Admin link in mobile menu if user is admin */}
                                    {adminVisible && (
                                          <Link
                                                to="/admin"
                                                className={cn(
                                                      "px-3 py-2 text-base font-medium rounded-md transition-colors flex items-center",
                                                      pathname === "/admin"
                                                            ? "bg-primary/10 text-primary"
                                                            : "hover:bg-muted"
                                                )}
                                                onClick={() =>
                                                      setMobileMenuOpen(false)
                                                }
                                          >
                                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                                <span>Admin Dashboard</span>
                                                <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                                          </Link>
                                    )}

                                    {user && (
                                          <>
                                                <Link
                                                      to="/my-bookings"
                                                      className="px-3 py-2 text-base font-medium rounded-md hover:bg-muted flex items-center"
                                                      onClick={() =>
                                                            setMobileMenuOpen(
                                                                  false
                                                            )
                                                      }
                                                >
                                                      <User className="h-4 w-4 mr-2" />
                                                      <span>My Bookings</span>
                                                </Link>

                                                <button
                                                      onClick={() => {
                                                            handleSignOut();
                                                            setMobileMenuOpen(
                                                                  false
                                                            );
                                                      }}
                                                      className="px-3 py-2 text-base font-medium rounded-md text-left hover:bg-muted flex items-center text-destructive"
                                                >
                                                      <LogOut className="h-4 w-4 mr-2" />
                                                      <span>Log out</span>
                                                </button>
                                          </>
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Navbar;
