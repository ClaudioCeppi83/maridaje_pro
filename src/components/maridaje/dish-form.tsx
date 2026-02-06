'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OrganicButton } from '@/components/organic/button';
import { OrganicCard } from '@/components/organic/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

const formSchema = z.object({
	dishName: z.string().min(2, {
		message: 'El nombre del plato debe tener al menos 2 caracteres.',
	}),
	dishDescription: z.string().optional(),
	dishCategory: z.string({
		required_error: 'Por favor selecciona una categoría.',
	}),
});

interface DishFormProps {
	onSubmit: (values: z.infer<typeof formSchema>) => void;
	isLoading?: boolean;
}

export function DishForm({ onSubmit, isLoading }: DishFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dishName: '',
			dishDescription: '',
			dishCategory: 'main course',
		},
	});

	return (
		<OrganicCard className="w-full max-w-2xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-primary/10 rounded-lg">
					<Sparkles className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h2 className="text-2xl font-headline font-semibold">¿Qué vamos a comer hoy?</h2>
					<p className="text-muted-foreground text-sm">Dame los detalles y encontraré tu maridaje ideal.</p>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="dishName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre del Plato</FormLabel>
								<FormControl>
									<Input placeholder="Ej: Risotto de setas silvestres" {...field} className="rounded-xl border-border/50 focus:ring-primary/20" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dishCategory"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Categoría</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl border-border/50">
											<SelectValue placeholder="Selecciona una categoría" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="rounded-xl">
										<SelectItem value="appetizer">Entrante</SelectItem>
										<SelectItem value="main course">Plato Principal</SelectItem>
										<SelectItem value="dessert">Postre</SelectItem>
										<SelectItem value="other">Otro</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="dishDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descripción o Ingredientes (Opcional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Cuéntame más sobre los sabores, salsas o método de cocción..."
										className="min-h-[100px] rounded-xl border-border/50 focus:ring-primary/20 resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end pt-2">
						<OrganicButton 
							type="submit" 
							disabled={isLoading}
							className="px-8 py-6 h-auto text-lg"
						>
							{isLoading ? 'Consultando al Sommelier...' : 'Encontrar Maridaje'}
						</OrganicButton>
					</div>
				</form>
			</Form>
		</OrganicCard>
	);
}
