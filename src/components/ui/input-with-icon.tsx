
import React from 'react';
import { Input } from './input';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <Input
          ref={ref}
          className={`pl-10 ${className || ''}`}
          {...props}
        />
      </div>
    );
  }
);

InputWithIcon.displayName = 'InputWithIcon';

export { InputWithIcon };
