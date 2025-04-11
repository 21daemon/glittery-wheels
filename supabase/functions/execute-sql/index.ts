
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Define the expected request body shape
interface RequestBody {
  query_text: string;
  query_params: Record<string, any>;
}

serve(async (req) => {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the project URL and service role key
    const supabaseClient = createClient(
      // These environment variables are set automatically by Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { query_text, query_params }: RequestBody = body;
    
    if (!query_text) {
      return new Response(
        JSON.stringify({ error: 'Missing query_text parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Executing SQL query:", query_text);
    console.log("With parameters:", query_params || {});

    // Execute the SQL query using Supabase's raw SQL execution
    const { data, error } = await supabaseClient.rpc('execute_sql_query', {
      query_text,
      query_params: query_params || {}
    });

    if (error) {
      console.error("Error executing SQL:", error);
      throw error;
    }

    // Return the result data
    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error executing SQL:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error executing SQL query',
        details: error.details || error.stack || 'No additional details'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
