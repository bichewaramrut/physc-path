"use client";

import { useState, useEffect, useRef } from 'react';
import { XCircle, AlertTriangle, Info, CheckCircle, RefreshCw, X, ExternalLink, ArrowRight, Shield, Code, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info' | 'success';
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'link' | 'button' | 'ghost';
    color?: string;
  }>;
  autoHideDuration?: number;
  showIcon?: boolean;
  className?: string;
  bordered?: boolean;
  elevated?: boolean;
  compact?: boolean;
  helpLink?: string;
  errorCode?: string;
  glassmorphism?: boolean;
  animationVariant?: 'fade' | 'slide' | 'scale' | 'shake' | 'none';
  children?: React.ReactNode;
}

export function ErrorAlert({ 
  message, 
  title,
  onRetry, 
  onDismiss,
  variant = 'error',
  actions = [],
  autoHideDuration,
  showIcon = true,
  className = '',
  bordered = true,
  elevated = false,
  compact = false,
  helpLink,
  errorCode,
  glassmorphism = false,
  animationVariant = 'fade',
  children
}: ErrorAlertProps) {
  const [visible, setVisible] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  
  // Handle auto-hide with fade out animation
  useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        setExitAnimation(true);
        setTimeout(() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }, 300); // Animation duration
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onDismiss]);
  
  // Haptic feedback on error if supported
  useEffect(() => {
    if (variant === 'error' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate([100, 50, 100]);
      } catch (e) {
        console.log("Vibration API not supported");
      }
    }
  }, [variant]);

  const handleRetry = () => {
    setIsShaking(true);
    
    // Vibration feedback
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(100);
      } catch (e) {
        console.log("Vibration API not supported");
      }
    }
    
    setTimeout(() => setIsShaking(false), 500);
    if (onRetry) onRetry();
  };
  
  const handleDismiss = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (!visible) return null;

  // Enhanced variant styles with more visual feedback
  const variantStyles = {
    error: {
      bg: glassmorphism 
        ? 'bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm' 
        : 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      iconColor: 'text-red-500 dark:text-red-400',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      buttonClass: 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-800/40 dark:hover:bg-red-800/60 dark:text-red-200 transition-all hover:shadow-md',
      icon: <XCircle className="h-5 w-5" />
    },
    warning: {
      bg: glassmorphism 
        ? 'bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm' 
        : 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-500 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      iconColor: 'text-amber-500 dark:text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      buttonClass: 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-800/40 dark:hover:bg-amber-800/60 dark:text-amber-200 transition-all hover:shadow-md',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    info: {
      bg: glassmorphism 
        ? 'bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm' 
        : 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      iconColor: 'text-blue-500 dark:text-blue-400',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      buttonClass: 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-800/40 dark:hover:bg-blue-800/60 dark:text-blue-200 transition-all hover:shadow-md',
      icon: <Info className="h-5 w-5" />
    },
    success: {
      bg: glassmorphism 
        ? 'bg-green-50/80 dark:bg-green-900/30 backdrop-blur-sm' 
        : 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      iconColor: 'text-green-500 dark:text-green-400',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]',
      buttonClass: 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-800/40 dark:hover:bg-green-800/60 dark:text-green-200 transition-all hover:shadow-md',
      icon: <CheckCircle className="h-5 w-5 animate-pulse" />
    }
  };

  const currentStyles = variantStyles[variant];
  
  // Animation classes based on the selected variant
  const animationClasses = {
    fade: exitAnimation ? 'animate-fadeOut' : 'animate-fadeIn',
    slide: exitAnimation ? 'animate-slide-out-left' : 'animate-slide-in-right',
    scale: exitAnimation ? 'animate-fadeOut scale-95' : 'animate-scale-in',
    shake: '',
    none: ''
  };

  // Add shake animation if needed
  const shakeClass = (isShaking || (animationVariant === 'shake' && !exitAnimation)) 
    ? 'animate-shake' 
    : '';

  return (
    <div 
      ref={alertRef}
      className={cn(
        currentStyles.bg, 
        bordered ? `border-l-4 ${currentStyles.border}` : '',
        elevated ? `shadow-md ${currentStyles.glow}` : '',
        compact ? 'p-2' : 'p-4',
        'mb-4 rounded-md transition-all duration-300',
        animationClasses[animationVariant],
        shakeClass,
        glassmorphism && 'border border-white/20 backdrop-blur-sm',
        className
      )}
      style={{ 
        transformOrigin: 'center left'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex">
          {showIcon && (
            <div className={cn(
              "flex-shrink-0", 
              currentStyles.iconColor,
              variant === 'error' && "animate-pulse",
              variant === 'success' && "animate-bounce-light"
            )}>
              {currentStyles.icon}
              {variant === 'error' && (
                <span className="absolute inline-flex h-full w-full rounded-full opacity-50 bg-red-400 animate-ping"></span>
              )}
            </div>
          )}
          
          <div className={cn(
            "flex-1",
            showIcon ? 'ml-3' : '',
          )}>
            {title && (
              <h3 className={cn(
                "text-sm font-medium flex items-center gap-1",
                currentStyles.text
              )}>
                {title}
                {variant === 'success' && <Sparkles className="h-3 w-3 animate-pulse" />}
              </h3>
            )}
            
            <div className={cn(
              "text-sm mt-1",
              currentStyles.text
            )}>
              {message}
              {children && <div className="mt-2">{children}</div>}
              {errorCode && (
                <div className="flex items-center mt-1 text-xs opacity-80 font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                  <Code className="h-3 w-3 mr-1" />
                  Error code: {errorCode}
                </div>
              )}
            </div>
            
            <div className={cn(
              "flex flex-wrap gap-2",
              compact ? 'mt-1' : 'mt-3'
            )}>
              {onRetry && (
                <button
                  className={cn(
                    "inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-md",
                    currentStyles.buttonClass,
                    "transform hover:scale-105 active:scale-95"
                  )}
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
                  Try again
                </button>
              )}

              {actions.map((action, index) => {
                // Determine button style based on variant
                const buttonStyle = action.variant === 'link' 
                  ? cn("text-xs hover:underline transition-colors", currentStyles.text)
                  : action.variant === 'ghost'
                    ? cn("inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-md", 
                        "bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-all")
                    : cn("inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-md", 
                        currentStyles.buttonClass);
                
                return (
                  <button
                    key={index}
                    className={cn(
                      buttonStyle,
                      "transform hover:scale-105 active:scale-95"
                    )}
                    onClick={action.onClick}
                  >
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </button>
                );
              })}
              
              {helpLink && (
                <a 
                  href={helpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center text-xs hover:underline transition-colors",
                    currentStyles.text
                  )}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Help
                </a>
              )}
            </div>
          </div>
        </div>
        
        {onDismiss && (
          <button 
            onClick={handleDismiss} 
            className={cn(
              currentStyles.text,
              "hover:opacity-70 transition-opacity rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
            )}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
