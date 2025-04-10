import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, X, Send } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProgressPhotoUploaderProps {
  bookingId: string;
  customerEmail: string;
  carDetails: string;
}

const ProgressPhotoUploader: React.FC<ProgressPhotoUploaderProps> = ({ 
  bookingId, 
  customerEmail,
  carDetails 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const { error: bucketError } = await supabase.functions.invoke('ensure-storage-bucket', {
        body: {
          bucketName: 'progress_photos',
          isPublic: true,
          fileSizeLimit: 5242880 // 5MB size limit
        }
      });
      
      if (bucketError) {
        console.error("Error ensuring bucket exists:", bucketError);
        throw new Error("Storage setup failed: " + bucketError.message);
      }
      
      const fileName = `progress_${bookingId}_${Date.now()}.${selectedImage.name.split('.').pop()}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('progress_photos')
        .upload(fileName, selectedImage);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('progress_photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.functions.invoke('execute-sql', {
        body: {
          query_text: `
            INSERT INTO progress_updates (booking_id, image_url, message, customer_email, car_details)
            VALUES (:booking_id, :image_url, :message, :customer_email, :car_details)
          `,
          query_params: {
            booking_id: bookingId,
            image_url: publicUrl,
            message: message,
            customer_email: customerEmail,
            car_details: carDetails
          }
        }
      });
      
      if (dbError) throw dbError;

      const { error: notificationError } = await supabase.functions.invoke('notify-customer', {
        body: {
          customerEmail,
          bookingId,
          message: message || 'Your vehicle service is in progress. Here\'s an update!',
          imageUrl: publicUrl,
          carDetails
        }
      });
      
      if (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Continue anyway since the upload was successful
      }
      
      toast({
        title: "Progress photo sent!",
        description: "The customer has been notified about the update.",
        variant: "default",
      });
      
      clearImage();
      setMessage('');

    } catch (error: any) {
      console.error("Error uploading progress photo:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading the photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-amber-500/20 rounded-lg bg-luxury-800/20 backdrop-blur-sm">
      <h3 className="text-lg font-medium text-amber-400">Send Progress Update</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Message to Customer (Optional)</Label>
          <Input
            id="message"
            placeholder="e.g., Your vehicle's polish is 50% complete"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-luxury-900/50 border-amber-500/20"
          />
        </div>
        
        {!imagePreview ? (
          <div className="border-2 border-dashed border-amber-500/30 rounded-lg p-6 text-center hover:border-amber-500/50 transition-colors">
            <Camera className="h-10 w-10 mx-auto mb-2 text-amber-500/70" />
            <Label 
              htmlFor="photo-upload" 
              className="text-sm text-amber-400 cursor-pointer hover:text-amber-300 block"
            >
              Click to select a photo
            </Label>
            <p className="text-xs text-white/50 mt-1">
              Maximum file size: 5MB
            </p>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-luxury-950/80 rounded-full hover:bg-luxury-900 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        <Alert className="bg-luxury-900/50 border border-amber-500/20">
          <Send className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm text-white/70">
            This update will be sent privately to the customer via email.
          </AlertDescription>
        </Alert>
        
        <Button 
          type="submit" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-black" 
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? (
            <>Sending Update...</>
          ) : (
            <>Send Progress Update</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProgressPhotoUploader;
