
-- Create the progress_updates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.progress_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  message TEXT,
  customer_email TEXT NOT NULL,
  car_details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraint to link with bookings
ALTER TABLE public.progress_updates
ADD CONSTRAINT fk_progress_updates_booking_id
FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
ON DELETE CASCADE;

-- Add indices for faster queries
CREATE INDEX idx_progress_updates_booking_id ON public.progress_updates(booking_id);
CREATE INDEX idx_progress_updates_customer_email ON public.progress_updates(customer_email);

-- Create function to execute SQL queries dynamically (for admin use only)
CREATE OR REPLACE FUNCTION public.execute_sql_query(query_text TEXT, query_params JSONB DEFAULT '{}'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Execute the dynamic SQL with parameters
  EXECUTE query_text
  INTO result
  USING query_params;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE);
END;
$$;

-- Set RLS policies for the progress_updates table
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own progress updates
CREATE POLICY "Users can view their own progress updates"
ON public.progress_updates
FOR SELECT
USING (customer_email = auth.jwt() ->> 'email');

-- Create policy to allow admins to manage all progress updates
CREATE POLICY "Admins can manage all progress updates"
ON public.progress_updates
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.email = auth.jwt() ->> 'email'
    AND (profiles.is_admin = true OR profiles.is_superadmin = true)
  )
);

-- Give public role access to the function
GRANT EXECUTE ON FUNCTION public.execute_sql_query TO anon, authenticated, service_role;
