
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
        "group relative rounded-xl overflow-hidden transition-all duration-300 hover-lift bg-luxury-800/50 backdrop-blur-sm",
        popular ? "border-2 border-amber-500/50" : "border border-white/10",
        className
      )}
    >
      {popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full animate-pulse">
            Popular
          </span>
        </div>
      )}

      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-white/70 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-amber-500">
            {price}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="group/btn text-white hover:text-amber-400 hover:bg-white/5"
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
