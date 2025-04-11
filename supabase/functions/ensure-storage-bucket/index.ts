
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

interface RequestBody {
  bucketName: string;
  isPublic?: boolean;
  fileSizeLimit?: number;
}

serve(async (req) => {
  try {
    // Set CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Create a Supabase client with service role key (has admin privileges)
    const supabaseAdmin = createClient(
      // These environment variables are set automatically by Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { bucketName, isPublic = true, fileSizeLimit = 5242880 }: RequestBody = body;
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Missing bucketName parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking if bucket '${bucketName}' exists...`);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      console.error(`Error listing buckets: ${listError.message}`);
      throw new Error(`Error listing buckets: ${listError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}, public: ${isPublic}`);
      
      const { data, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: fileSizeLimit
      });
      
      if (createError) {
        console.error(`Error creating bucket: ${createError.message}`);
        throw new Error(`Error creating bucket: ${createError.message}`);
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return new Response(
        JSON.stringify({ message: `Bucket ${bucketName} created successfully`, data }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Bucket already exists, make sure it's public if needed
    if (isPublic) {
      console.log(`Bucket ${bucketName} already exists, updating public setting to ${isPublic}`);
      const { error: updateError } = await supabaseAdmin.storage.updateBucket(bucketName, {
        public: isPublic
      });
      
      if (updateError) {
        console.error(`Error updating bucket: ${updateError.message}`);
        throw new Error(`Error updating bucket: ${updateError.message}`);
      }
    }
    
    // Bucket already exists
    return new Response(
      JSON.stringify({ message: `Bucket ${bucketName} already exists` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in ensure-storage-bucket function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error ensuring storage bucket exists',
        stack: error.stack // Include stack trace for debugging 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    );
  }
});
