'use client';

import React from 'react';
import { OrganicCard } from '@/components/organic/card';
import { motion } from 'framer-motion';
import { 
	Wine, 
	Thermometer, 
	GlassWater, 
	Info, 
	Droplets, 
	CircleDot, 
	Waves, 
	Sparkles,
	Coins,
	Star,
	TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PairingResultProps {
	recommendation: {
		recommendedGrapeVarietals: string;
		wineOptions: Array<{
			name: string;
			priceRange: 'bajo' | 'medio' | 'alto';
			priceHint: string;
			description: string;
		}>;
		wineCharacteristics: {
			body: string;
			tannins: string;
			acidity: string;
			tonality: string;
		};
		tastingNotes: string;
		pairingReason: string;
		servingTemperature: string;
		suitableGlassware: {
			type: string;
			description: string;
		};
	};
	descriptors: {
		wineDescriptors: string;
	};
}

export function PairingResult({ recommendation, descriptors }: PairingResultProps) {
	// Helper para limpiar posibles etiquetas HTML y convertirlas a saltos de línea reales
	const cleanText = (text: string) => {
		if (!text) return "";
		return text
			.replace(/<br\s*\/?>/gi, "\n")
			.replace(/<\/p>/gi, "\n")
			.replace(/<[^>]*>?/gm, "")
			.trim();
	};

	const renderParagraphs = (text: string, className?: string) => {
		return cleanText(text).split('\n').filter(p => p.trim() !== '').map((para, i) => (
			<p key={i} className={className}>
				{para}
			</p>
		));
	};

	const [cepa, perfil] = recommendation.recommendedGrapeVarietals.includes(" - ") 
		? recommendation.recommendedGrapeVarietals.split(" - ") 
		: [recommendation.recommendedGrapeVarietals, ""];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 15
			}
		}
	};

	return (
		<div className="max-w-6xl mx-auto space-y-8 mt-12 px-4 pb-20">
			{/* Header con Cepa Principal */}
			<motion.div 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center space-y-2"
			>
				<Badge variant="outline" className="px-6 py-1.5 rounded-full border-primary/30 text-primary bg-primary/5 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">
					Selección del Sommelier
				</Badge>
				<h2 className="font-headline text-5xl md:text-6xl font-black text-foreground tracking-tighter">
					{cepa.trim()}
				</h2>
				{perfil && (
					<p className="text-xl md:text-2xl font-medium text-muted-foreground/80 tracking-tight font-body italic">
						{perfil.trim()}
					</p>
				)}
			</motion.div>

			{/* Bento Grid Layout */}
			<motion.div 
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]"
			>
				{/* 1. Por qué funciona (Grande - Principal) */}
				<OrganicCard className="md:col-span-6 lg:col-span-8 p-8 border-none bg-primary/5 relative overflow-hidden group">
					<div className="relative z-10 flex flex-col h-full">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-2 bg-primary/10 rounded-lg text-primary">
								<Sparkles className="w-5 h-5" />
							</div>
							<h3 className="font-headline text-xl font-bold uppercase tracking-wider text-primary/80">Veredicto Técnico</h3>
						</div>
						<div className="space-y-4">
							{renderParagraphs(recommendation.pairingReason, "text-xl md:text-2xl font-body leading-relaxed text-foreground/90 font-medium")}
						</div>
					</div>
					<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
				</OrganicCard>

				{/* 2. Características (Largo) */}
				<OrganicCard className="md:col-span-6 lg:col-span-4 p-8 flex flex-col justify-center bg-card border-border/50">
					<div className="flex items-center gap-2 mb-6">
						<div className="p-1.5 bg-secondary/10 rounded-md text-secondary">
							<TrendingUp className="w-4 h-4" />
						</div>
						<h3 className="font-headline font-bold text-sm uppercase tracking-wider text-muted-foreground">Perfil Técnico</h3>
					</div>
					<div className="space-y-4">
						<CharacteristicItem 
							icon={<Waves className="w-4 h-4" />} 
							label="Cuerpo (densidad)" 
							value={recommendation.wineCharacteristics.body} 
							color="text-amber-600"
						/>
						<CharacteristicItem 
							icon={<Droplets className="w-4 h-4" />} 
							label="Acidez (frescura)" 
							value={recommendation.wineCharacteristics.acidity} 
							color="text-blue-500"
						/>
						<CharacteristicItem 
							icon={<CircleDot className="w-4 h-4" />} 
							label="Taninos (estructura)" 
							value={recommendation.wineCharacteristics.tannins} 
							color="text-red-800"
						/>
						<CharacteristicItem 
							icon={<Sparkles className="w-4 h-4" />} 
							label="Tonalidad visual" 
							value={recommendation.wineCharacteristics.tonality} 
							color="text-purple-600"
						/>
					</div>
				</OrganicCard>

				{/* 3. Notas de Cata (Medio) */}
				<OrganicCard className="md:col-span-3 lg:col-span-4 p-8 bg-accent/5 border-none">
					<div className="flex items-center gap-3 mb-4">
						<Wine className="w-6 h-6 text-accent" />
						<h3 className="font-headline font-bold text-accent italic">Sensaciones</h3>
					</div>
					<div className="space-y-3">
						{renderParagraphs(recommendation.tastingNotes, "text-muted-foreground leading-relaxed text-lg")}
					</div>
				</OrganicCard>

				{/* 4. Temperatura y Copa (Pequeños) */}
				<OrganicCard className="md:col-span-3 lg:col-span-4 p-8 flex flex-col items-center text-center justify-center border-border/40 group hover:border-primary/20 transition-colors">
					<div className="p-3 bg-primary/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
						<Thermometer className="w-8 h-8 text-primary" />
					</div>
					<div className="space-y-2">
						<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60">Servir a</span>
						<p className="text-4xl font-headline font-black text-foreground tracking-tighter">
							{recommendation.servingTemperature}
						</p>
					</div>
				</OrganicCard>

				<OrganicCard className="md:col-span-3 lg:col-span-4 p-8 flex flex-col items-center text-center justify-center border-border/40 group hover:border-primary/20 transition-colors">
					<div className="p-3 bg-primary/5 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
						<Wine className="w-8 h-8 text-primary" />
					</div>
					<div className="space-y-2">
						<span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60">Copa Ideal</span>
						<h4 className="text-xl font-headline font-bold text-foreground leading-tight px-4">
							{recommendation.suitableGlassware.type}
						</h4>
						<p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
							{cleanText(recommendation.suitableGlassware.description)}
						</p>
					</div>
				</OrganicCard>

				{/* 5. Opciones de Vino (Tres Columnas en la Base) */}
				<div className="md:col-span-6 lg:col-span-12 space-y-6 mt-8">
					<div className="flex flex-col items-center gap-2 mb-2">
						<Badge variant="secondary" className="rounded-md px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
							Elegidos para ti
						</Badge>
						<h3 className="font-headline text-3xl md:text-4xl font-bold text-center">Tres etiquetas recomendadas</h3>
						<p className="text-base text-muted-foreground text-center max-w-2xl leading-relaxed">
							Estas botellas armonizarán perfectamente con tu plato. He seleccionado opciones reales que varían según su complejidad y precio.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{recommendation.wineOptions.map((option, idx) => (
							<WineOptionCard key={idx} option={option} index={idx} cleanText={cleanText} />
						))}
					</div>
				</div>

				{/* 6. Descripción Detallada */}
				<OrganicCard className="md:col-span-6 lg:col-span-12 p-10 bg-muted/20 border-border/30 mt-8">
					<div className="flex items-center gap-3 mb-6">
						<Info className="w-6 h-6 text-muted-foreground" />
						<h3 className="font-headline text-2xl font-bold text-muted-foreground">Análisis de Profundidad</h3>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
						<div className="space-y-4">
							{renderParagraphs(descriptors.wineDescriptors, "text-foreground/80 leading-relaxed font-body text-lg mb-4 last:mb-0")}
						</div>
						<div className="hidden lg:flex items-center justify-center opacity-10 pointer-events-none transform rotate-12 scale-150">
							<Wine className="w-64 h-64" />
						</div>
					</div>
				</OrganicCard>
			</motion.div>
		</div>
	);
}

function CharacteristicItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
	return (
		<div className="flex items-center justify-between group">
			<div className="flex items-center gap-3">
				<div className={cn("p-1.5 rounded-full bg-muted transition-colors group-hover:bg-white/10", color)}>
					{icon}
				</div>
				<span className="text-sm font-medium text-muted-foreground">{label}</span>
			</div>
			<span className="text-sm font-headline font-bold text-foreground">{value}</span>
		</div>
	);
}

function WineOptionCard({ option, index, cleanText }: { option: PairingResultProps['recommendation']['wineOptions'][0], index: number, cleanText: (text: string) => string }) {
	const badges = {
		bajo: { label: 'Básico / Diario', icon: <Coins className="w-3 h-3" />, class: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
		medio: { label: 'Reserva / Selección', icon: <Star className="w-3 h-3" />, class: 'bg-amber-50 text-amber-700 border-amber-100' },
		alto: { label: 'Icono / Gran Reserva', icon: <TrendingUp className="w-3 h-3" />, class: 'bg-purple-50 text-purple-700 border-purple-100' }
	};

	const config = badges[option.priceRange];

	return (
		<OrganicCard className="p-6 h-full flex flex-col justify-between border-border/30 hover:shadow-2xl transition-all duration-500">
			<div className="space-y-4">
				<div className="flex justify-between items-start">
					<Badge className={cn("px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold uppercase", config.class)}>
						{config.icon}
						{config.label}
					</Badge>
					<span className="text-xs font-bold text-muted-foreground opacity-50">{option.priceHint}</span>
				</div>
				<div className="space-y-1">
					<h4 className="font-headline font-bold text-lg leading-tight line-clamp-2">{option.name}</h4>
				</div>
				<p className="text-xs text-muted-foreground leading-relaxed italic">
					"{cleanText(option.description)}"
				</p>
			</div>
		</OrganicCard>
	);
}
