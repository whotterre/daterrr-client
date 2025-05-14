import * as React from "react";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollbarClassName?: string;
  thumbClassName?: string;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, scrollbarClassName, thumbClassName, ...props }, ref) => {
    const [showScrollbar, setShowScrollbar] = React.useState(false);
    
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className || ""}`}
        onMouseEnter={() => setShowScrollbar(true)}
        onMouseLeave={() => setShowScrollbar(false)}
        {...props}
      >
        <div className="h-full w-full overflow-y-auto pr-2">
          {children}
        </div>
        
        {/* Vertical scrollbar */}
        <div 
          className={`absolute top-0 right-0 h-full w-2.5 transition-opacity duration-200 ${
            showScrollbar ? "opacity-100" : "opacity-0"
          } ${scrollbarClassName || ""}`}
        >
          <div 
            className={`relative h-full w-full rounded-full bg-gray-200 ${thumbClassName || ""}`}
          />
        </div>
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };