import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'gradient' | 'breathe';
  height?: string | number;
  width?: string | number;
  rounded?: boolean | string;
  glassmorphism?: boolean;
  darkMode?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted';
}

export function Skeleton({
  className,
  variant = 'default',
  height,
  width,
  rounded = "md",
  glassmorphism = false,
  darkMode = false,
  color = 'default'
}: SkeletonProps) {
  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  const roundedClass = typeof rounded === 'string' 
    ? `rounded-${rounded}` 
    : rounded ? 'rounded-md' : '';

  // Color variations
  const colorClasses = {
    default: 'bg-muted/70 dark:bg-muted/40',
    primary: 'bg-primary-100/70 dark:bg-primary-900/30',
    secondary: 'bg-secondary-100/70 dark:bg-secondary-900/30',
    accent: 'bg-accent-100/70 dark:bg-accent-900/30',
    muted: 'bg-slate-200/70 dark:bg-slate-800/40'
  };
  
  const baseColorClass = colorClasses[color];

  // Different animation variants with enhanced effects
  const variantClass = 
    variant === 'shimmer' ? `animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent ${baseColorClass} relative overflow-hidden` :
    variant === 'pulse' ? `animate-pulse ${baseColorClass}` :
    variant === 'wave' ? `animate-wave ${baseColorClass} relative overflow-hidden` :
    variant === 'gradient' ? `bg-gradient-to-r from-muted/60 via-muted/80 to-muted/60 dark:from-muted/40 dark:via-muted/60 dark:to-muted/40 animate-shimmer bg-[length:200%_100%]` :
    variant === 'breathe' ? `animate-breathe ${baseColorClass}` :
    `${baseColorClass} animate-pulse`; // default

  return (
    <div 
      className={cn(
        variantClass, 
        roundedClass, 
        glassmorphism && 'backdrop-blur-sm border border-white/10',
        className
      )} 
      style={style}
    >
      {(variant === 'wave' || variant === 'shimmer') && (
        <div className="absolute inset-0 -translate-x-full animate-[wave_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

export function MedicationCardSkeleton({ glassmorphism = false } = {}) {
  return (
    <div className={cn(
      "border p-4 rounded-lg shadow-sm animate-fadeIn transition-all duration-300",
      "bg-card dark:bg-card/80",
      glassmorphism && "backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-white/20"
    )}>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton 
            variant="gradient" 
            className="h-6 w-2/3" 
            glassmorphism={glassmorphism}
            color="primary"
          />
          <Skeleton 
            variant="pulse" 
            className="h-5 w-20" 
            rounded="full" 
            glassmorphism={glassmorphism} 
            color="accent"
          />
        </div>
        
        <Skeleton 
          variant="shimmer" 
          className="h-4 w-1/2" 
          glassmorphism={glassmorphism}
          color="secondary"
        />
        
        <div className="pt-2">
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-full" 
            glassmorphism={glassmorphism}
          />
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-5/6 mt-2" 
            glassmorphism={glassmorphism}
          />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Skeleton 
            variant="wave" 
            className="h-4 w-1/4" 
            glassmorphism={glassmorphism}
            color="primary"
          />
          <Skeleton 
            variant="breathe" 
            className="h-8 w-24 shadow-sm" 
            rounded="md" 
            glassmorphism={glassmorphism}
            color="accent"
          />
        </div>
      </div>
    </div>
  );
}

export function CalendarEventSkeleton({ variant = 'dose' } = {}) {
  const bgColor = variant === 'dose' ? 'bg-blue-50/50 dark:bg-blue-900/20' : 
                 variant === 'refill' ? 'bg-amber-50/50 dark:bg-amber-900/20' :
                 variant === 'appointment' ? 'bg-purple-50/50 dark:bg-purple-900/20' :
                 'bg-red-50/50 dark:bg-red-900/20';
  
  const color = variant === 'dose' ? 'primary' : 
               variant === 'refill' ? 'warning' :
               variant === 'appointment' ? 'accent' : 
               'destructive';
               
  return (
    <div className={cn(
      "p-3 rounded-md mb-2 animate-pulse transition-all hover:shadow-md",
      bgColor
    )}>
      <div className="flex justify-between items-center">
        <Skeleton 
          variant="wave" 
          className="h-4 w-16" 
          color={color}
        />
        <Skeleton 
          variant="gradient" 
          className="h-5 w-24" 
          rounded="full" 
          color={color}
        />
      </div>
      <div className="mt-2">
        <Skeleton 
          variant="shimmer" 
          className="h-5 w-3/4" 
          color={color}
        />
        <Skeleton 
          variant="pulse" 
          className="h-4 w-1/2 mt-1" 
          color={color}
        />
      </div>
      <div className="absolute top-0 right-0 -mt-1 -mr-1 opacity-50">
        <div className="animate-ping w-2 h-2 rounded-full bg-blue-400"></div>
      </div>
    </div>
  );
}

export function PaymentCardSkeleton({ glassmorphism = false } = {}) {
  return (
    <div className={cn(
      "border p-6 rounded-lg shadow-sm animate-fadeIn transition-all hover:shadow-card-hover",
      "bg-card dark:bg-card/90",
      glassmorphism && "backdrop-blur-md bg-white/40 dark:bg-gray-900/40 border-white/20"
    )}>
      <div className="space-y-4">
        <Skeleton 
          variant="gradient" 
          className="h-6 w-40" 
          rounded="md" 
          glassmorphism={glassmorphism}
          color="primary"
        />
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-24" 
            glassmorphism={glassmorphism}
          />
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-16" 
            glassmorphism={glassmorphism}
          />
        </div>
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-24" 
            glassmorphism={glassmorphism}
          />
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-28" 
            glassmorphism={glassmorphism}
          />
        </div>
        
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-24" 
            glassmorphism={glassmorphism}
          />
          <Skeleton 
            variant="shimmer" 
            className="h-4 w-8" 
            glassmorphism={glassmorphism}
          />
        </div>
        
        <div className="flex justify-between py-2">
          <Skeleton 
            variant="wave" 
            className="h-5 w-28 font-bold" 
            glassmorphism={glassmorphism}
            color="primary"
          />
          <Skeleton 
            variant="pulse" 
            className="h-5 w-20 font-bold" 
            glassmorphism={glassmorphism}
            color="primary"
          />
        </div>
        
        <Skeleton 
          variant="breathe" 
          className="h-10 w-full shadow-sm" 
          rounded="md" 
          glassmorphism={glassmorphism}
          color="accent"
        />
      </div>
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="animate-fadeIn border-b border-gray-100 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
      <div className="flex items-start gap-3">
        <Skeleton variant="pulse" className="h-10 w-10 rounded-full" color="primary" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton variant="shimmer" className="h-4 w-1/3" />
            <Skeleton variant="shimmer" className="h-3 w-16" />
          </div>
          <Skeleton variant="shimmer" className="h-3 w-5/6" />
          <Skeleton variant="shimmer" className="h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function VideoCallSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
      <div className="relative aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton variant="breathe" className="h-20 w-20 rounded-full" color="primary" />
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Skeleton variant="pulse" className="h-10 w-10 rounded-full" color="accent" />
          <Skeleton variant="pulse" className="h-10 w-10 rounded-full" color="destructive" />
          <Skeleton variant="pulse" className="h-10 w-10 rounded-full" color="secondary" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <Skeleton variant="shimmer" className="h-5 w-1/2" />
        <div className="flex gap-2">
          <Skeleton variant="shimmer" className="h-4 w-20 rounded-full" />
          <Skeleton variant="shimmer" className="h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton({ glassmorphism = false } = {}) {
  return (
    <div className={cn(
      "border rounded-lg p-5",
      "bg-card dark:bg-card/90 animate-fadeIn transition-all duration-300",
      glassmorphism && "backdrop-blur-md bg-white/40 dark:bg-gray-900/40 border-white/20"
    )}>
      <div className="flex flex-col items-center space-y-4">
        <Skeleton 
          variant="pulse" 
          className="h-20 w-20 rounded-full" 
          glassmorphism={glassmorphism} 
          color="primary"
        />
        <Skeleton 
          variant="shimmer" 
          className="h-6 w-40 mx-auto" 
          glassmorphism={glassmorphism}
        />
        <Skeleton 
          variant="shimmer" 
          className="h-4 w-32 mx-auto" 
          glassmorphism={glassmorphism}
          color="secondary"
        />
        
        <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton 
                variant="wave" 
                className="h-4 w-full" 
                glassmorphism={glassmorphism} 
              />
              <Skeleton 
                variant="wave" 
                className="h-4 w-3/4 mt-2" 
                glassmorphism={glassmorphism} 
              />
            </div>
            <div>
              <Skeleton 
                variant="wave" 
                className="h-4 w-full" 
                glassmorphism={glassmorphism} 
              />
              <Skeleton 
                variant="wave" 
                className="h-4 w-3/4 mt-2" 
                glassmorphism={glassmorphism} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2 w-full">
          <Skeleton 
            variant="breathe" 
            className="h-9 flex-1" 
            glassmorphism={glassmorphism}
            color="primary"
            rounded="md"
          />
          <Skeleton 
            variant="breathe" 
            className="h-9 flex-1" 
            glassmorphism={glassmorphism}
            color="accent"
            rounded="md"
          />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton variant="shimmer" className="h-5 w-24" />
              <Skeleton variant="gradient" className="h-8 w-16 mt-2" color="primary" />
            </div>
            <Skeleton variant="pulse" className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
