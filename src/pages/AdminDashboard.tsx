
// This will update the function that fetches bookings in the AdminDashboard page
// to ensure we get customer emails by joining with the profiles table

// We need to update the fetchBookings function to include the profiles data
// The fetchBookings function should look like this:

const fetchBookings = async () => {
  try {
    setIsLoading(true);
    
    // Use a more complete query that joins with profiles
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    console.log("Fetched bookings with profiles:", data);
    setBookings(data || []);
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    toast({
      title: "Error",
      description: "Failed to load bookings. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
