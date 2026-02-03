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
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  userToken: z.string().optional().describe('Google OAuth Access Token for BYOK'),
});
export type DescribeWineDescriptorsInput = z.infer<typeof DescribeWineDescriptorsInputSchema>;

const DescribeWineDescriptorsOutputSchema = z.object({
  wineDescriptors: z.string().describe('A description of the ideal wine descriptors (e.g., fruitiness, earthiness, spice level) that would complement the dish, with each descriptor in a new paragraph.'),
});
export type DescribeWineDescriptorsOutput = z.infer<typeof DescribeWineDescriptorsOutputSchema>;

export async function describeWineDescriptors(input: DescribeWineDescriptorsInput): Promise<DescribeWineDescriptorsOutput> {
  return describeWineDescriptorsFlow(input);
}

const PROMPT_TEMPLATE = `Eres un sommelier experto con 20 años de experiencia en maridajes gastronómicos. Tu tarea es proporcionar un análisis profundo y educativo sobre las características ideales del vino que complementaría un plato específico.

INFORMACIÓN DEL PLATO:
- Nombre: {{{dishName}}}
- Categoría: {{{dishCategory}}}
{{#if dishDescription}}
- Descripción detallada: {{{dishDescription}}}
{{else}}
- Sin descripción detallada disponible
{{/if}}

INSTRUCCIONES:

1. Analiza meticulosamente los siguientes aspectos del plato:
   - Ingredientes principales y secundarios
   - Perfiles de sabor dominantes (dulce, salado, amargo, ácido, umami)
   - Texturas (cremoso, crujiente, jugoso, seco)
   - Método de cocción y su impacto en el sabor
   - Intensidad general del plato
   - Componentes grasos, proteicos o ácidos

2. Basándote en este análisis, explica las características ideales del vino, cubriendo OBLIGATORIAMENTE estos descriptores:
   - **Perfil frutal**: ¿Qué tipo de frutas (cítricos, frutas rojas, negras, tropicales)? ¿Por qué complementan el plato?
   - **Notas terrosas/minerales**: ¿Son necesarias? ¿Cómo equilibran los sabores?
   - **Nivel de especias**: ¿Debe tener notas especiadas? ¿Cuáles y por qué?
   - **Acidez**: ¿Alta, media o baja? ¿Cómo interactúa con la grasa o acidez del plato?
   - **Taninos**: ¿Su presencia e intensidad? ¿Cómo afectan las proteínas del plato?
   - **Dulzura**: ¿Seco, semi-seco o dulce? ¿Por qué este nivel?
   - **Cuerpo**: ¿Ligero, medio o pleno? ¿Cómo se equilibra con la intensidad del plato?
   - **Textura en boca**: ¿Sedoso, aterciopelado, crujiente (burbujas)?

3. Para CADA descriptor, explica:
   - Por qué esta característica es importante para este plato específico
   - Qué efecto tiene en el maridaje (contraste, complemento, equilibrio)
   - Cómo mejora la experiencia gastronómica general

FORMATO DE SALIDA:
- Escribe en español formal pero accesible
- Cada descriptor principal debe iniciar en un NUEVO PÁRRAFO (usa \\n para separar párrafos)
- Usa un tono educativo y apasionado, como un sommelier compartiendo su expertise
- Longitud total: 400-600 palabras
- NO uses listas con viñetas, solo prosa fluida en párrafos
- NO menciones nombres de vinos específicos (solo características)
- Enfócate en LAS CARACTERÍSTICAS del vino, no en las variedades de uva

EJEMPLO DE ESTRUCTURA (NO COPIES, SOLO SIGUE EL FORMATO):

"Para este plato, la acidez del vino juega un papel fundamental. Una acidez vibrante cortará la riqueza de [componente del plato] y limpiará el paladar entre bocados, permitiendo que cada nuevo sabor se experimente con frescura renovada.

El perfil frutal debe tender hacia [tipo de frutas], ya que estas notas [explica la razón específica relacionada con el plato]..."

Genera ahora el razonamiento detallado del sommelier. Responde ÚNICAMENTE con el objeto JSON.`;

const prompt = ai.definePrompt({
  name: 'describeWineDescriptorsPrompt',
  input: {schema: DescribeWineDescriptorsInputSchema},
  output: {schema: DescribeWineDescriptorsOutputSchema},
  prompt: PROMPT_TEMPLATE,
});

const describeWineDescriptorsFlow = ai.defineFlow(
  {
    name: 'describeWineDescriptorsFlow',
    inputSchema: DescribeWineDescriptorsInputSchema,
    outputSchema: DescribeWineDescriptorsOutputSchema,
  },
  async input => {
    if (input.userToken) {
        // BYOK Path: Use direct REST API with OAuth Token (SDK expects API Key)
        try {
            const MODEL_ID = "gemini-2.5-flash"; 
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

            const categoryText = input.dishCategory;
            const descriptionText = input.dishDescription 
                ? input.dishDescription 
                : "Sin descripción detallada.";

            const fullPrompt = `Eres un sommelier experto con 20 años de experiencia.
            
INFORMACIÓN DEL PLATO:
- Nombre: ${input.dishName}
- Categoría: ${categoryText}
- Descripción: ${descriptionText}

INSTRUCCIONES:
Analiza el plato y explica las características ideales del vino para acompañarlo.
Genera un objeto JSON con la propiedad 'wineDescriptors' (string), donde describas las características (fruta, acidez, cuerpo, etc.) en texto fluido y persuasivo, separado por párrafos.

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON válido.`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${input.userToken}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorBody}`);
            }

            const data = await response.json();
            
            // Extract text from standard Gemini response structure
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) {
                throw new Error("Empty response from Gemini API");
            }
            
            const json = JSON.parse(text);
            return DescribeWineDescriptorsOutputSchema.parse(json);
        } catch (e: any) {
             console.error("BYOK Generation failed (descriptors):", e);
             throw new Error(`Failed to generate descriptors with user credentials: ${e.message}`);
        }
    } else {
        const {output} = await prompt(input);
        return output!;
    }
  }
);