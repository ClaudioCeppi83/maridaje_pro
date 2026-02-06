'use client';

import { useState } from 'react';
import { DishForm } from '@/components/maridaje/dish-form';
import { PairingResult } from '@/components/maridaje/pairing-result';
import { getWinePairing } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { SignIn } from '@/components/auth/auth-components';

export function HomePageClient({ isAuthenticated }: { isAuthenticated: boolean }) {
	const [result, setResult] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetRecommendation = async (data: any) => {
		if (!isAuthenticated) {
			setError('Debes iniciar sesión para obtener recomendaciones personalizadas.');
			return;
		}

		setIsLoading(true);
		setError(null);
		setResult(null);
		
		try {
			const pairingResult = await getWinePairing(data);
			if (pairingResult.error) {
				setError(pairingResult.error);
			} else {
				setResult(pairingResult);
			}
		} catch (e) {
			console.error(e);
			setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-64px)] pb-12">
			<div className="container mx-auto px-4 pt-12">
				<div className="max-w-4xl mx-auto text-center mb-12">
					<motion.h1 
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4"
					>
						Encuentra el <span className="text-primary italic">Maridaje</span> Perfecto
					</motion.h1>
					<motion.p 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-lg text-muted-foreground max-w-2xl mx-auto"
					>
						Nuestro sommelier experto analiza cada ingrediente y textura para recomendarte la copa ideal.
					</motion.p>
				</div>

				<div className="flex flex-col items-center">
					{isAuthenticated ? (
						<DishForm onSubmit={handleGetRecommendation} isLoading={isLoading} />
					) : (
						<motion.div 
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="text-center p-12 bg-card rounded-3xl border border-border shadow-xl max-w-md"
						>
							<h2 className="text-2xl font-headline font-bold mb-4">Comienza tu Experiencia</h2>
							<p className="text-muted-foreground mb-8">
								Inicia sesión con tu cuenta de Google para acceder a recomendaciones personalizadas usando tu propia cuota de IA de forma totalmente gratuita.
							</p>
							<SignIn className="w-full py-6" />
						</motion.div>
					)}

					<AnimatePresence>
						{isLoading && (
							<motion.div 
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="mt-12 flex flex-col items-center gap-4 py-8"
							>
								<Loader2 className="w-12 h-12 text-primary animate-spin" />
								<p className="font-headline text-xl text-primary animate-pulse">Analizando sabores...</p>
							</motion.div>
						)}

						{error && (
							<motion.div 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-8 flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 max-w-2xl"
							>
								<AlertCircle className="w-5 h-5" />
								<p className="text-sm font-medium">{error}</p>
							</motion.div>
						)}

						{result && !isLoading && (
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="w-full"
							>
								<PairingResult 
									recommendation={result.recommendation} 
									descriptors={result.descriptors}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<footer className="mt-20 border-t border-border/50 py-12 text-center">
				<p className="text-sm text-muted-foreground font-headline italic">
					"El vino es la única obra de arte que se puede beber."
				</p>
				<p className="text-xs text-muted-foreground mt-4">Maridaje Pro &copy; 2026. Disfruta hoy, recuerda mañana.</p>
			</footer>
		</main>
	);
}
