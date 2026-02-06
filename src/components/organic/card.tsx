'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OrganicCardProps extends HTMLMotionProps<'div'> {
	hoverEffect?: boolean;
	delay?: number;
}

const OrganicCard = React.forwardRef<HTMLDivElement, OrganicCardProps>(
	({ className, children, hoverEffect = true, delay = 0, ...props }, ref) => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ 
					duration: 0.5, 
					delay: delay * 0.1,
					type: 'spring',
					stiffness: 100,
					damping: 15
				}}
				whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
				ref={ref}
				className={cn(
					'bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6',
					className
				)}
				{...props}
			>
				{children}
			</motion.div>
		);
	}
);

OrganicCard.displayName = 'OrganicCard';

export { OrganicCard };
