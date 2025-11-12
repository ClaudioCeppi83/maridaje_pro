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
export type GenerateWineRecommendationInput = z.infer<typeof GenerateWineRecommendationInputSchema>;

const GenerateWineRecommendationOutputSchema = z.object({
  recommendedGrapeVarietals: z.string().describe('La(s) cepa(s) de uva recomendada(s).'),
  specificWineExamples: z.array(z.string()).describe('Una lista de 2 a 3 vinos específicos como ejemplos.'),
  wineCharacteristics: z.string().describe('Características ideales del vino.'),
  tastingNotes: z.string().describe('Notas de cata para los vinos recomendados.'),
  servingTemperature: z.string().describe('Temperatura de servicio recomendada'),
  suitableGlassware: z.string().describe('Cristalería adecuada para servir'),
});
export type GenerateWineRecommendationOutput = z.infer<typeof GenerateWineRecommendationOutputSchema>;

export async function generateWineRecommendation(
  input: GenerateWineRecommendationInput
): Promise<GenerateWineRecommendationOutput> {
  return generateWineRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWineRecommendationPrompt',
  input: {schema: GenerateWineRecommendationInputSchema},
  output: {schema: GenerateWineRecommendationOutputSchema},
  prompt: `Eres un sommelier profesional con 20 años de experiencia, encargado de proporcionar recomendaciones concretas y accionables de maridaje de vinos. Tu objetivo es dar al usuario información específica que pueda usar inmediatamente.

INFORMACIÓN DEL PLATO:
- Nombre: {{{dishName}}}
- Categoría: {{{dishCategory}}}{{#if otherDishCategory}} ({{{otherDishCategory}}}){{/if}}
{{#if dishDescription}}
- Descripción: {{{dishDescription}}}
{{else}}
- NOTA: No se proporcionó descripción detallada. Basa tu recomendación en el nombre y categoría del plato, haciendo las suposiciones razonables de un sommelier experimentado.
{{/if}}

INSTRUCCIONES:

Genera una recomendación de vino estructurada en formato JSON con los siguientes campos:

1. **recommendedGrapeVarietals** (string):
   - Especifica 1-3 variedades de uva principales (ej: "Albariño", "Tempranillo", "Chardonnay y Sauvignon Blanc")
   - Formato: "Variedad(es)"

2. **specificWineExamples** (array de 2-3 strings):
   - Proporciona nombres REALES Y ESPECÍFICOS de vinos comerciales
   - Incluye productor y denominación cuando sea relevante
   - Menciona el pais de origen del vino
   - Varía los rangos de precio (accesible, medio, premium) y distingelos con el simbolo $
   - Ejemplo: ["Martín Códax Albariño $$ (Rías Baixas)", "Pazo de Señorans $ (Rías Baixas)", "Lagar de Cervera $$$ (Rías Baixas)"]

3. **wineCharacteristics** (string):
   - Resume en 1-2 frases las características principales del vino ideal
   - Incluye: color, nivel de sequedad, cuerpo, 1-2 descriptores clave
   - Ejemplo: "Vino blanco seco con cuerpo medio, alta acidez y carácter mineral refrescante"

4. **tastingNotes** (string):
   - Describe aromas y sabores específicos que complementan el plato (2-3 frases)
   - Conecta directamente estos sabores con elementos del plato
   - Ejemplo: "Notas de manzana verde y cítricos que equilibran la salinidad del marisco, con un final mineral que realza los sabores del océano"

5. **servingTemperature** (string):
   - Proporciona rango de temperatura SIEMPRE con unidades en Celsius
   - Formato obligatorio: "X-Y°C" o "X°C"
   - Ejemplo: "8-10°C" o "9°C"

6. **suitableGlassware** (string):
   - Especifica el tipo de copa más adecuado
   - Añade una breve justificación (opcional)
   - Ejemplo: "Copa de vino blanco tipo tulipa, para concentrar los aromas frescos"

PRINCIPIOS DE MARIDAJE A CONSIDERAR:
- Equilibrio de intensidades (plato delicado = vino delicado)
- Acidez del vino para cortar grasa o complementar sabores ácidos
- Taninos para proteínas
- Dulzura para picante o salado
- Contraste o complemento según el caso

CRÍTICO:
- TODO el contenido debe estar en español
- Asegúrate de que sea JSON válido (comillas correctas, sin comas finales)
- Los ejemplos de vinos deben ser REALES, no inventados
- SIEMPRE incluye unidades en servingTemperature (°C)
- El array specificWineExamples debe contener entre 2 y 3 elementos

Aquí está la descripción del esquema de salida:
{{outputSchemaDescription}}

Genera ahora la recomendación en formato JSON:`,
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