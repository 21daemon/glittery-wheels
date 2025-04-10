
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

interface RequestBody {
  bucketName: string;
  isPublic?: boolean;
  fileSizeLimit?: number;
}

serve(async (req) => {
  try {
    // Create a Supabase client with service role key (has admin privileges)
    const supabaseAdmin = createClient(
      // These environment variables are set automatically by Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { bucketName, isPublic = false, fileSizeLimit = 5242880 }: RequestBody = await req.json();
    
    if (!bucketName) {
      return new Response(
        JSON.stringify({ error: 'Missing bucketName parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Error listing buckets: ${listError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      const { data, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: fileSizeLimit
      });
      
      if (createError) {
        throw new Error(`Error creating bucket: ${createError.message}`);
      }
      
      console.log(`Created bucket: ${bucketName}`);
      return new Response(
        JSON.stringify({ message: `Bucket ${bucketName} created successfully`, data }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Bucket already exists
    return new Response(
      JSON.stringify({ message: `Bucket ${bucketName} already exists` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in ensure-storage-bucket function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error ensuring storage bucket exists',
        stack: error.stack // Include stack trace for debugging 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
