
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  popular?: boolean;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  popular = false,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300 hover-lift",
        popular ? "border-2 border-primary/30" : "border border-border",
        className
      )}
    >
      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full animate-pulse">
            Popular
          </span>
        </div>
      )}

      <div className="aspect-[4/3] w-full img-hover-zoom">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">
            {price}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="group/btn"
            onClick={() => navigate('/booking')}
          >
            Book
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
