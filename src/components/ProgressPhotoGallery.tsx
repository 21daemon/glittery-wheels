
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressUpdate {
  id: string;
  booking_id: string;
  image_url: string;
  message: string;
  created_at: string;
  car_details: string;
  customer_email?: string;
}

const ProgressPhotoGallery: React.FC<{ bookingId?: string }> = ({ bookingId }) => {
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<ProgressUpdate | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Use RPC to avoid TypeScript issues with table not defined in schema
        let query = `
          SELECT * FROM progress_updates
          WHERE 1=1
        `;
        
        const queryParams: any = {};
        
        // Add conditional filtering
        if (bookingId) {
          query += ` AND booking_id = :bookingId`;
          queryParams.bookingId = bookingId;
        } else if (user.email) {
          query += ` AND customer_email = :customerEmail`;
          queryParams.customerEmail = user.email;
        }
        
        query += ` ORDER BY created_at DESC`;
        
        const { data, error } = await supabase.functions.invoke('execute-sql', {
          body: {
            query_text: query,
            query_params: queryParams
          }
        });
        
        if (error) throw error;
        
        console.log("Progress updates response:", data);
        
        // Handle the case where data might be null or not contain data property
        let updates: ProgressUpdate[] = [];
        if (data && Array.isArray(data.data)) {
          updates = data.data as ProgressUpdate[];
        }
        
        setProgressUpdates(updates);
        
        if (updates.length > 0) {
          setActivePhoto(updates[0]);
        }
        
      } catch (error: any) {
        console.error("Error fetching progress updates:", error);
        toast({
          title: "Could not load progress updates",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgressUpdates();
  }, [user, bookingId, toast]);

  // Ensure progressUpdates is always an array
  const safeProgressUpdates = Array.isArray(progressUpdates) ? progressUpdates : [];

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (safeProgressUpdates.length === 0) {
    return (
      <Card className="bg-luxury-800/50 backdrop-blur-sm border border-white/10">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-amber-500 bg-amber-500/10 p-3 rounded-full mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Progress Updates Yet</h3>
          <p className="text-white/70 text-center max-w-md">
            When your vehicle service is in progress, photos and updates will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-luxury-800/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          {activePhoto && (
            <div>
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={activePhoto.image_url} 
                  alt="Progress photo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{activePhoto.car_details}</h3>
                    <p className="text-sm text-white/70">
                      {new Date(activePhoto.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                    onClick={() => window.open(activePhoto.image_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Full Size
                  </Button>
                </div>
                
                {activePhoto.message && (
                  <div className="bg-luxury-900/50 p-3 rounded-md border border-white/10 flex gap-3">
                    <MessageSquare className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-white/90">{activePhoto.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-white">All Progress Photos</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {safeProgressUpdates.map((update) => (
              <div 
                key={update.id}
                className={`flex gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                  activePhoto?.id === update.id 
                    ? 'bg-amber-500/20 border border-amber-500/30' 
                    : 'bg-luxury-800/50 hover:bg-luxury-700/50 border border-white/10'
                }`}
                onClick={() => setActivePhoto(update)}
              >
                <div className="w-20 h-20 shrink-0 rounded overflow-hidden">
                  <img 
                    src={update.image_url} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{update.car_details}</p>
                  <p className="text-xs text-white/70">
                    {new Date(update.created_at).toLocaleString()}
                  </p>
                  {update.message && (
                    <p className="text-sm text-white/80 line-clamp-2 mt-1">
                      {update.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotoGallery;
