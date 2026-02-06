'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrganicButtonProps extends ShadcnButtonProps {
	motionProps?: HTMLMotionProps<'button'>;
}

const OrganicButton = React.forwardRef<HTMLButtonElement, OrganicButtonProps>(
	({ className, motionProps, ...props }, ref) => {
		return (
			<motion.div
				whileTap={{ scale: 0.98 }}
				transition={{ type: 'spring', stiffness: 400, damping: 17 }}
				className="w-fit inline-block"
			>
				<ShadcnButton
					ref={ref}
					className={cn('rounded-xl font-headline transition-all duration-300', className)}
					{...props}
				/>
			</motion.div>
		);
	}
);

OrganicButton.displayName = 'OrganicButton';

export { OrganicButton };
