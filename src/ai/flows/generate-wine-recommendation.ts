'use server';

/**
 * @fileOverview Generates a wine recommendation based on a dish description.
 *
 * - generateWineRecommendation - A function that generates the wine recommendation.
 * - GenerateWineRecommendationInput - The input type for the generateWineRecommendation function.
 * - GenerateWineRecommendationOutput - The return type for the generateWineRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWineRecommendationInputSchema = z.object({
  dishName: z.string().describe('The name of the dish.'),
  dishDescription: z
    .string()
    .describe(
      'A detailed description of the dish, including ingredients, flavors, and cooking methods.'
    )
    .optional(),
  dishCategory: z
    .enum(['appetizer', 'main course', 'dessert', 'other'])
    .describe('The category of the dish.'),
  otherDishCategory: z.string().optional().describe('Specification if dish category is other'),
});
export type GenerateWineRecommendationInput = z.infer<
  typeof GenerateWineRecommendationInputSchema
>;

const GenerateWineRecommendationOutputSchema = z.object({
  recommendedGrapeVarietals: z.string().describe('La(s) cepa(s) de uva recomendada(s).'),
  specificWineExamples: z.array(z.string()).describe('Una lista de 2 a 3 vinos específicos como ejemplos.'),
  wineCharacteristics: z.string().describe('Características ideales del vino.'),
  tastingNotes: z.string().describe('Notas de cata para los vinos recomendados.'),
  servingTemperature: z.string().describe('Temperatura de servicio recomendada'),
  suitableGlassware: z.string().describe('Cristalería adecuada para servir'),
});
export type GenerateWineRecommendationOutput = z.infer<
  typeof GenerateWineRecommendationOutputSchema
>;

export async function generateWineRecommendation(
  input: GenerateWineRecommendationInput
): Promise<GenerateWineRecommendationOutput> {
  return generateWineRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWineRecommendationPrompt',
  input: {schema: GenerateWineRecommendationInputSchema},
  output: {schema: GenerateWineRecommendationOutputSchema},
  prompt: `Eres un sommelier con amplio conocimiento en maridaje de vinos y comidas. Basado en la información del plato proporcionada, recomienda en español una o varias cepas de uva que mariden bien con el plato. Luego, proporciona 2 o 3 ejemplos de vinos específicos.

Nombre del Plato: {{{dishName}}}
Categoría del Plato: {{{dishCategory}}}{{#if otherDishCategory}} ({{{otherDishCategory}}}){{/if}}
{{#if dishDescription}}
Descripción del Plato: {{{dishDescription}}}
{{else}}
Descargo de responsabilidad: No se proporcionó una descripción detallada del plato. La recomendación de vino será más precisa con una descripción detallada.
{{/if}}

Considera lo siguiente al hacer tu recomendación:
- Cepa(s) de uva principal(es).
- 2 o 3 ejemplos de vinos específicos.
- Características ideales del vino (e.g., acidez, taninos, dulzura, cuerpo)
- Notas de cata que complementarían el plato
- Temperatura de servicio recomendada
- Cristalería adecuada

Genera la recomendación en formato JSON. Asegúrate de que la respuesta esté en español. Asegúrate de incluir las unidades para servingTemperature. e.g. "15-18°C"

Aquí está la descripción del esquema de salida:
{{outputSchemaDescription}}`,
});

const generateWineRecommendationFlow = ai.defineFlow(
  {
    name: 'generateWineRecommendationFlow',
    inputSchema: GenerateWineRecommendationInputSchema,
    outputSchema: GenerateWineRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
