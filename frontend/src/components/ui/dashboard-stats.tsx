"use client";

import React, { useState, useEffect } from 'react';
import { Card } from './card';
import { LoadingSpinner } from './loading-spinner';
import { ErrorAlert } from './error-alert';
import { DashboardStatsSkeleton } from './skeleton';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp, 
  MessageSquare,
  Pill,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface DashboardStatsProps {
  stats?: StatItem[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export function DashboardStats({
  stats,
  isLoading = false,
  error,
  onRetry,
  className
}: DashboardStatsProps) {
  const [isInitializing, setIsInitializing] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isInitializing) {
    return <DashboardStatsSkeleton />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 flex items-center justify-center h-32">
            <LoadingSpinner 
              variant="dots" 
              color="primary" 
              size="md" 
              glassmorphism={true}
            />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title="Couldn't load dashboard stats"
        message={error}
        variant="error"
        onRetry={onRetry}
        glassmorphism={true}
        animationVariant="fade"
        className="max-w-lg mx-auto"
        actions={[
          {
            label: "Refresh",
            onClick: onRetry || (() => {}),
            icon: <RefreshCw className="h-4 w-4" />,
            variant: "button"
          }
        ]}
      />
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No stats available at this time.
      </Card>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            className={cn(
              "p-6 flex flex-col transition-all hover:shadow-lg",
              "border-l-4",
              `border-l-${stat.color}-500`,
              "hover:scale-[1.01]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-2 rounded-md",
                `bg-${stat.color}-100 dark:bg-${stat.color}-900/30`,
                `text-${stat.color}-500`
              )}>
                {stat.icon}
              </div>
              
              {stat.change !== undefined && (
                <div className={cn(
                  "text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full",
                  stat.change > 0 
                    ? "bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400"
                    : stat.change < 0 
                      ? "bg-destructive-100 dark:bg-destructive-900/20 text-destructive-600 dark:text-destructive-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    stat.change < 0 && "transform rotate-180"
                  )} />
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Default data set for demonstration
export const defaultDashboardStats = [
  {
    label: "Upcoming Appointments",
    value: 3,
    change: 20,
    icon: <Calendar className="h-5 w-5" />,
    color: "blue"
  },
  {
    label: "Recent Consultations",
    value: 12,
    change: -5,
    icon: <MessageSquare className="h-5 w-5" />,
    color: "purple"
  },
  {
    label: "Active Prescriptions",
    value: 4,
    change: 0,
    icon: <Pill className="h-5 w-5" />,
    color: "green"
  },
  {
    label: "Wellness Score",
    value: "86%",
    change: 12,
    icon: <Activity className="h-5 w-5" />,
    color: "amber"
  }
];
