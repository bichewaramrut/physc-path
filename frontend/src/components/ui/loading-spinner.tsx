"use client";

import { Loader2, RefreshCw, CircleOff, Hourglass, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'default' | 'pulse' | 'dots' | 'pill' | 'skeleton' | 'ring' | 'spinner' | 'wave' | 'breathe';
  timeout?: number; // Time in ms after which to show a timeout message
  onTimeout?: () => void;
  onRetry?: () => void;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'muted' | 'success' | 'warning' | 'info';
  glassmorphism?: boolean;
  includeBackground?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '',
  variant = 'default',
  timeout,
  onTimeout,
  onRetry,
  color = 'primary',
  glassmorphism = false,
  includeBackground = false
}: LoadingSpinnerProps) {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    destructive: 'text-destructive',
    muted: 'text-muted-foreground',
    success: 'text-success-500',
    warning: 'text-warning-500',
    info: 'text-info-500'
  };
  
  const backgroundClasses = {
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    accent: 'bg-accent-50',
    destructive: 'bg-destructive-50',
    muted: 'bg-muted',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    info: 'bg-info-50'
  };
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    if (timeout) {
      // Create a progress interval
      const updateInterval = timeout / 100;
      intervalId = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          return newProgress <= 100 ? newProgress : 100;
        });
      }, updateInterval);
      
      // Set the timeout
      timeoutId = setTimeout(() => {
        setIsTimedOut(true);
        if (onTimeout) onTimeout();
      }, timeout);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeout, onTimeout]);

  // Add haptic feedback on timeout if supported
  useEffect(() => {
    if (isTimedOut && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(200);
      } catch (e) {
        console.log("Vibration API not supported");
      }
    }
  }, [isTimedOut]);
  
  if (isTimedOut) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-4 rounded-md animate-fadeIn",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className="relative">
          <CircleOff className={cn(sizeClasses[size], "text-destructive/70")} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-destructive/40 animate-ping-subtle"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        </div>
        <p className="mt-2 text-sm text-destructive/90 font-medium">
          {text || "Request timed out"}
        </p>
        {(onTimeout || onRetry) && (
          <button 
            onClick={onTimeout || onRetry}
            className="mt-3 text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors hover:scale-105 transform"
          >
            <RefreshCw className="h-3 w-3 animate-spin-slow" /> Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className="flex space-x-2">
          <div className={cn(
            "rounded-full animate-bounce",
            colorClasses[color],
            size === 'xs' ? 'h-1.5 w-1.5' : 
            size === 'sm' ? 'h-2 w-2' : 
            size === 'md' ? 'h-3 w-3' : 
            size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
          )} style={{ animationDelay: '0ms' }}></div>
          <div className={cn(
            "rounded-full animate-bounce",
            colorClasses[color],
            size === 'xs' ? 'h-1.5 w-1.5' : 
            size === 'sm' ? 'h-2 w-2' : 
            size === 'md' ? 'h-3 w-3' : 
            size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
          )} style={{ animationDelay: '150ms' }}></div>
          <div className={cn(
            "rounded-full animate-bounce",
            colorClasses[color],
            size === 'xs' ? 'h-1.5 w-1.5' : 
            size === 'sm' ? 'h-2 w-2' : 
            size === 'md' ? 'h-3 w-3' : 
            size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
          )} style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground animate-pulse">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'pulse') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className={`relative ${sizeClasses[size]}`}>
          <div className={cn("absolute inset-0 rounded-full animate-pulse-ring opacity-75", colorClasses[color])}></div>
          <div className={cn("relative rounded-full animate-breathe", colorClasses[color], sizeClasses[size])}></div>
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground animate-pulse">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'skeleton') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? 'bg-muted/30' : '',
        glassmorphism ? 'backdrop-blur-md bg-white/20 dark:bg-gray-900/20 border border-white/10' : '',
        className
      )}>
        <div className={cn(
          "rounded-md bg-muted animate-shimmer relative overflow-hidden",
          size === 'xs' ? 'h-6 w-6' : 
          size === 'sm' ? 'h-10 w-10' : 
          size === 'md' ? 'h-16 w-16' : 
          size === 'lg' ? 'h-24 w-24' : 'h-32 w-32'
        )}>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    );
  }
  
  if (variant === 'pill') {
    return (
      <div className={cn(
        "inline-flex items-center px-3 py-1 rounded-full animate-scale-in shadow-sm",
        `bg-${color}-100/70 dark:bg-${color}-900/30`,
        glassmorphism ? 'backdrop-blur-sm border border-white/20' : '',
        className
      )}>
        <Loader2 className={cn(
          "animate-spin mr-2", 
          colorClasses[color],
          size === 'xs' ? 'h-3 w-3' : 
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
        )} />
        <span className={cn(
          colorClasses[color],
          size === 'xs' ? 'text-xs' : 
          size === 'sm' ? 'text-sm' : 'text-base'
        )}>{text || "Loading..."}</span>
      </div>
    );
  }
  
  if (variant === 'ring') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className={`relative ${sizeClasses[size]}`}>
          <svg 
            className={cn(
              "animate-spin", 
              colorClasses[color],
              sizeClasses[size]
            )} 
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading</span>
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'wave') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className="flex space-x-1 items-center justify-center">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              className={cn(
                "animate-bounce", 
                colorClasses[color],
                size === 'xs' ? 'h-1 w-1' : 
                size === 'sm' ? 'h-1.5 w-1.5' : 
                size === 'md' ? 'h-2 w-2' : 
                size === 'lg' ? 'h-3 w-3' : 'h-4 w-4',
                "rounded-full"
              )} 
              style={{ 
                animationDelay: `${index * 0.15}s`,
                animationDuration: "0.6s"
              }}
            ></div>
          ))}
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'breathe') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <div className={cn(
          "rounded-full animate-breathe shadow-glow", 
          `bg-${color}-500/20`,
          size === 'xs' ? 'h-4 w-4' : 
          size === 'sm' ? 'h-8 w-8' : 
          size === 'md' ? 'h-12 w-12' : 
          size === 'lg' ? 'h-16 w-16' : 'h-20 w-20'
        )}>
          <Sparkles className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse", 
            colorClasses[color],
            size === 'xs' ? 'h-2 w-2' : 
            size === 'sm' ? 'h-4 w-4' : 
            size === 'md' ? 'h-6 w-6' : 
            size === 'lg' ? 'h-8 w-8' : 'h-10 w-10'
          )} />
        </div>
        {text && <p className="mt-2 text-sm text-muted-foreground animate-pulse">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }

  // Default spinner variant
  if (variant === 'spinner') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-md",
        includeBackground ? backgroundClasses[color] : '',
        glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
        className
      )}>
        <Hourglass className={cn(
          "animate-rotate-pulse",
          colorClasses[color], 
          sizeClasses[size]
        )} />
        {text && <p className="mt-2 text-sm text-muted-foreground animate-fadeIn">{text}</p>}
        
        {timeout && (
          <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden">
            <div 
              className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", `bg-${color}-500`)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-3 rounded-md animate-fadeIn transition-all",
      includeBackground ? backgroundClasses[color] : '',
      glassmorphism ? 'backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20' : '',
      className
    )}>
      <Loader2 className={cn(
        "animate-spin", 
        colorClasses[color], 
        sizeClasses[size]
      )} />
      {text && <p className="mt-2 text-sm text-muted-foreground animate-fadeIn">{text}</p>}
      
      {timeout && (
        <div className="w-full mt-3 bg-muted rounded-full h-1.5 max-w-[120px] overflow-hidden shadow-inner-glow">
          <div 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 ease-in-out relative",
              `bg-${color}-500`
            )}
            style={{ width: `${progress}%` }}
          >
            {progress > 30 && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
