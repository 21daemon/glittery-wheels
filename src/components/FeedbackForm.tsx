
import React, { useState } from 'react';
import { Star, Send, Check, Smile, Frown, Meh } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const initialFormState = {
  rating: 0,
  name: "",
  email: "",
  message: "",
  satisfaction: null as "positive" | "neutral" | "negative" | null,
};

const FeedbackForm: React.FC = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleStarHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleStarClick = (clickedRating: number) => {
    setFormState(prev => ({ ...prev, rating: clickedRating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { rating, name, email, message, satisfaction } = formState;
    
    if (!rating || !name || !email || !message || !satisfaction) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to submit your feedback.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        rating,
        message,
        satisfaction
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your comments are valuable to us and help improve our services.",
        variant: "default",
      });
      
      // Reset form after success animation
      setTimeout(() => {
        resetForm();
        setIsSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isSuccess ? (
        <div className="text-center p-10 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-medium mb-2">Feedback Submitted!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for sharing your experience with us.
          </p>
          <p className="text-sm text-muted-foreground">
            We appreciate your input and will use it to improve our services.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-medium">Rate Your Experience</h3>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl p-1 focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(star)}
                >
                  <Star
                    className={cn(
                      "w-8 h-8",
                      (hoverRating || formState.rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {formState.rating === 5 ? "Excellent!" : formState.rating === 4 ? "Very Good!" : formState.rating === 3 ? "Good" : formState.rating === 2 ? "Fair" : formState.rating === 1 ? "Poor" : "Select a rating"}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">How satisfied were you with our service?</h3>
            
            <div className="flex justify-between max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, satisfaction: "negative" }))}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all",
                  formState.satisfaction === "negative" 
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-2 ring-red-400"
                    : "hover:bg-secondary"
                )}
              >
                <Frown className={cn(
                  "w-8 h-8 mb-2",
                  formState.satisfaction === "negative" ? "text-red-500" : "text-muted-foreground"
                )} />
                <span className="text-sm">Unsatisfied</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, satisfaction: "neutral" }))}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all",
                  formState.satisfaction === "neutral" 
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400"
                    : "hover:bg-secondary"
                )}
              >
                <Meh className={cn(
                  "w-8 h-8 mb-2",
                  formState.satisfaction === "neutral" ? "text-amber-500" : "text-muted-foreground"
                )} />
                <span className="text-sm">Neutral</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, satisfaction: "positive" }))}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all",
                  formState.satisfaction === "positive" 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-2 ring-green-400"
                    : "hover:bg-secondary"
                )}
              >
                <Smile className={cn(
                  "w-8 h-8 mb-2",
                  formState.satisfaction === "positive" ? "text-green-500" : "text-muted-foreground"
                )} />
                <span className="text-sm">Satisfied</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Your Feedback</Label>
            <Textarea
              id="message"
              value={formState.message}
              onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your experience with our services..."
              className="min-h-[150px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full hover-lift"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
