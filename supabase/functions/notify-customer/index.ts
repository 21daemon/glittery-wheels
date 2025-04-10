
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface RequestBody {
  customerEmail: string;
  bookingId: string;
  message: string;
  imageUrl: string;
  carDetails: string;
}

serve(async (req) => {
  try {
    const { customerEmail, bookingId, message, imageUrl, carDetails } = await req.json() as RequestBody;
    
    if (!customerEmail || !bookingId || !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you would use an email service like SendGrid, Postmark, etc.
    // For now, we'll just log the notification and return a success response
    console.log(`
      Would send email to: ${customerEmail}
      Subject: Update on Your Vehicle Service (Booking #${bookingId})
      Body: 
        ${message}
        
        View your progress photo: ${imageUrl}
        
        Car Details: ${carDetails}
        
        This is an automated message from CleanHaven.
    `);

    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing notification request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Server error processing notification' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
