'use server';

/**
 * @fileOverview A flow to describe the ideal wine descriptors for a given dish.
 *
 * - describeWineDescriptors - A function that handles the wine descriptor generation process.
 * - DescribeWineDescriptorsInput - The input type for the describeWineDescriptors function.
 * - DescribeWineDescriptorsOutput - The return type for the describeWineDescriptors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeWineDescriptorsInputSchema = z.object({
  dishName: z.string().describe('The name of the dish.'),
  dishDescription: z
    .string()
    .describe('A detailed description of the dish, including ingredients, flavors, and cooking methods.')
    .optional(),
  dishCategory: z
    .string()
    .describe(
      "The category of the dish (e.g., 'appetizer', 'main course', 'dessert'). If 'other', a specific category must be provided."
    ),
});
export type DescribeWineDescriptorsInput = z.infer<typeof DescribeWineDescriptorsInputSchema>;

const DescribeWineDescriptorsOutputSchema = z.object({
  wineDescriptors: z.string().describe('A description of the ideal wine descriptors (e.g., fruitiness, earthiness, spice level) that would complement the dish, with each descriptor in a new paragraph.'),
});
export type DescribeWineDescriptorsOutput = z.infer<typeof DescribeWineDescriptorsOutputSchema>;

export async function describeWineDescriptors(input: DescribeWineDescriptorsInput): Promise<DescribeWineDescriptorsOutput> {
  return describeWineDescriptorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeWineDescriptorsPrompt',
  input: {schema: DescribeWineDescriptorsInputSchema},
  output: {schema: DescribeWineDescriptorsOutputSchema},
  prompt: `Eres un sommelier con años de experiencia. Un usuario ha descrito el siguiente plato:

Nombre del Plato: {{{dishName}}}
Categoría del Plato: {{{dishCategory}}}
Descripción del Plato: {{{dishDescription}}}

Basado en esta información, describe en español los descriptores de vino ideales que complementarían el plato. Explica el razonamiento detrás de tus elecciones. Considera aspectos como frutosidad, terrosidad, nivel de especias, acidez, taninos y dulzura.

**Importante**: Formatea tu respuesta para que cada descriptor principal (ej. Frutosidad, Terrosidad, etc.) comience en un nuevo párrafo. Usa un salto de línea (\\n) para separar los párrafos.
`,
});

const describeWineDescriptorsFlow = ai.defineFlow(
  {
    name: 'describeWineDescriptorsFlow',
    inputSchema: DescribeWineDescriptorsInputSchema,
    outputSchema: DescribeWineDescriptorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
