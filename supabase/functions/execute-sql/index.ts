
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Define the expected request body shape
interface RequestBody {
  query_text: string;
  query_params: Record<string, any>;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the project URL and service role key
    const supabaseClient = createClient(
      // These environment variables are set automatically by Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract the request body
    const { query_text, query_params }: RequestBody = await req.json();
    
    if (!query_text) {
      return new Response(
        JSON.stringify({ error: 'Missing query_text parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Execute the SQL query using Supabase's raw SQL execution
    const { data, error } = await supabaseClient.rpc('execute_sql_query', {
      query_text,
      query_params: query_params || {}
    });

    if (error) {
      throw error;
    }

    // Return the result data
    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error executing SQL:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Error executing SQL query' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
