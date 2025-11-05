'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1 rounded-xl bg-gray-100 p-1 text-gray-600',
      'w-fit mx-auto',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex min-w-[90px] items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
      'data-[state=active]:bg-white data-[state=active]:text-primaryAccentColor data-[state=active]:shadow',
      'hover:text-primaryAccentColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primaryAccentColor',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animated?: boolean;
  }
>(({ className, children, value, animated = true, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    value={value}
    asChild={animated}
    className={cn('mt-3', className)}
    {...props}
  >
    {animated ? (
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    ) : (
      children
    )}
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
