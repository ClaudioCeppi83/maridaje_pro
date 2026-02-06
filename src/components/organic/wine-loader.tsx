'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import styles from './wine-loader.module.css';

interface WineLoaderProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	glassColor?: string;
	liquidColor?: string;
}

export function WineLoader({ className, size = 'md', glassColor, liquidColor }: WineLoaderProps) {
	// Ajustamos el tamaño usando un contenedor con scale para mantener las proporciones del dibujo CSS
	const scale = size === 'sm' ? 0.4 : size === 'md' ? 0.7 : 1;
	
	return (
		<div 
			className={cn("flex items-center justify-center", className)}
			style={{ 
				height: `${120 * scale}px`, 
				width: `${50 * scale}px`,
				// @ts-ignore - CSS variables in style object
				'--wine-glass-color': glassColor,
				'--wine-liquid-color': liquidColor
			} as React.CSSProperties}
		>
			<div 
				className={styles.loaderCopa}
				style={{ 
					transform: `scale(${scale})`,
					transformOrigin: 'top center'
				}}
			>
				<div className={styles.copaBowl}>
					<div className={styles.vino}></div>
				</div>
			</div>
		</div>
	);
}
