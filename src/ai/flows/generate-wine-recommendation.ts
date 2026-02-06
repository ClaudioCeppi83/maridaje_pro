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
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  userToken: z.string().optional().describe('Google OAuth Access Token for BYOK'),
  apiKey: z.string().optional().describe('Manual Google AI API Key for BYOK'),
  availableWines: z.array(z.string()).optional().describe('List of wines available in the user\'s cellar'),
});
export type GenerateWineRecommendationInput = z.infer<typeof GenerateWineRecommendationInputSchema>;

const GenerateWineRecommendationOutputSchema = z.object({
  recommendedGrapeVarietals: z.string().describe('La(s) cepa(s) de uva recomendada(s).'),
  wineOptions: z.array(z.object({
    name: z.string().describe('Nombre del vino con productor.'),
    priceRange: z.enum(['bajo', 'medio', 'alto']).describe('Rango de precio del vino.'),
    priceHint: z.string().describe('Precio aproximado o símbolo de moneda.'),
    description: z.string().describe('Breve descripción de por qué este vino específico es una gran opción.'),
  })).describe('Tres opciones de vino: precio bajo, medio y alto.'),
  wineCharacteristics: z.object({
    body: z.string().describe('Cuerpo del vino (ligero, medio, completo).'),
    tannins: z.string().describe('Nivel de taninos.'),
    acidity: z.string().describe('Nivel de acidez.'),
    tonality: z.string().describe('Color y tonalidad visual del vino.'),
  }).describe('Características técnicas del vino.'),
  tastingNotes: z.string().describe('Notas de cata descriptivas (texto limpio, sin HTML).'),
  pairingReason: z.string().describe('Explicación técnica de por qué este maridaje funciona (texto limpio, sin HTML).'),
  servingTemperature: z.string().describe('Temperatura de servicio recomendada (ej: 16-18°C).'),
  suitableGlassware: z.object({
    type: z.string().describe('Tipo de copa (ej: Bordeaux, Borgoña, Tulipa).'),
    description: z.string().describe('Por qué esta copa es ideal.'),
  }).describe('Información sobre la cristalería.'),
});
export type GenerateWineRecommendationOutput = z.infer<typeof GenerateWineRecommendationOutputSchema>;

/**
 * Genera una recomendación de vino basada en la descripción de un plato.
 * Soporta el flujo BYOK si se proporciona un token de usuario de Google.
 * 
 * @param {GenerateWineRecommendationInput} input - Datos del plato y disponibilidad de vinos.
 * @returns {Promise<GenerateWineRecommendationOutput>} Recomendación detallada en formato JSON.
 */
export async function generateWineRecommendation(
  input: GenerateWineRecommendationInput
): Promise<GenerateWineRecommendationOutput> {
  return generateWineRecommendationFlow(input);
}

const PROMPT_TEMPLATE = `Eres un sommelier experto de clase mundial, encargado de proporcionar recomendaciones concretas y accionables de maridaje de vinos. Tu objetivo es dar al usuario información específica que pueda usar inmediatamente.

INFORMACIÓN DEL PLATO:
- Nombre: {{{dishName}}}
- Categoría: {{{dishCategory}}}{{#if otherDishCategory}} ({{{otherDishCategory}}}){{/if}}
{{#if dishDescription}}
- Descripción: {{{dishDescription}}}
{{else}}
- NOTA: No se proporcionó descripción detallada. Basa tu recomendación en el nombre y categoría del plato, haciendo las suposiciones razonables de un sommelier experimentado.
{{/if}}

{{#if availableWines}}
MI BODEGA (RESTRICCIÓN CRÍTICA):
El usuario tiene los siguientes vinos disponibles:
{{{availableWines}}}

INSTRUCCIÓN ESPECIAL: DEBES elegir tu recomendación ÚNICAMENTE de la lista de "MI BODEGA". Si ninguno encaja perfectamente, elige el que mejor armonice de entre los disponibles. Proporciona el razonamiento de por qué elegiste esos vinos de su colección.
{{/if}}

INSTRUCCIONES:

Genera una recomendación de vino estructurada en formato JSON con los siguientes campos:

1. **recommendedGrapeVarietals** (string):
   - Formato: "Nombre de la Cepa - Perfil Descriptivo"
   - Ejemplo: "Sangiovese - Tinto Vibrante y Frutal".
   - NO uses paréntesis en el título. Pon la cepa primero en mayúsculas/negrita si es posible (en el texto).

2. **wineOptions** (array de exactamente 3 objetos):
   - Cada objeto DEBE tener:
     - "name": Nombre limpio (productor + etiqueta). NO añadidas frases como "(Ideal)".
     - "priceRange": 'bajo', 'medio' o 'alto'.
     - "priceHint": Rango de precio (ej: "15-25€").
     - "description": Explicación corta y directa.

3. **wineCharacteristics** (objeto):
   - "body", "tannins", "acidity", "tonality": Descripciones breves.

4. **tastingNotes**, **pairingReason**:
   - PROHIBIDO EL USO DE <br> o <p>. 
   - Usa saltos de línea de texto estándar (\\n) para separar ideas.
   - Sé específico y evita generalidades.

5. **servingTemperature**:
   - String con el rango (ej: "16-18°C").

6. **suitableGlassware**:
   - OBJETO con:
     - "type": Nombre de la copa.
     - "description": Por qué se usa.

REGLAS DE ORO:
- SALIDA EN JSON PURO.
- SIN ETIQUETAS HTML (NADA de <br>, <p>, etc).
- Usa caracteres de escape para saltos de línea si es necesario ("\\n").
- Idioma: Español.

Responde ÚNICAMENTE con el objeto JSON. NO incluyas bloques de código markdown (\`\`\`json).`;

// Fallback prompt definition for Genkit server usage (if standard setup is preserved)
const prompt = ai.definePrompt({
  name: 'generateWineRecommendationPrompt',
  input: {schema: GenerateWineRecommendationInputSchema},
  output: {schema: GenerateWineRecommendationOutputSchema},
  prompt: PROMPT_TEMPLATE, // reusing template logic might require Handlebars compliance check if manual interpolation differs. 
  // Wait, Genkit prompt definitions use Handlebars syntax. 
  // Manual string interpolation below needs to match or we use a helper.
});

const generateWineRecommendationFlow = ai.defineFlow(
  {
    name: 'generateWineRecommendationFlow',
    inputSchema: GenerateWineRecommendationInputSchema,
    outputSchema: GenerateWineRecommendationOutputSchema,
  },
  async input => {
    if (input.userToken || input.apiKey) {
        // BYOK Path: Use direct REST API
        try {
            // Updated to gemini-1.5-flash for maximum stability with OAuth, 
            // as 2.5 might have specific preview restrictions.
            const MODEL_ID = "gemini-2.5-flash"; 
            const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;
            const API_URL = input.apiKey ? `${baseUrl}?key=${input.apiKey}` : baseUrl;

            // ... (prompt interpolation stays the same)
            let fullPrompt = PROMPT_TEMPLATE.replace('{{{dishName}}}', input.dishName)
                .replace('{{{dishCategory}}}', input.dishCategory)
                .replace('{{#if otherDishCategory}}', input.otherDishCategory ? '' : '<!--')
                .replace('({{{otherDishCategory}}})', input.otherDishCategory ? `(${input.otherDishCategory})` : '')
                .replace('{{#if dishDescription}}', input.dishDescription ? '' : '<!--')
                .replace('{{else}}', input.dishDescription ? '<!--' : '')
                .replace('{{/if}}', '-->')
                .replace('{{{dishDescription}}}', input.dishDescription || '');

            // Handle availableWines section
            if (input.availableWines && input.availableWines.length > 0) {
                fullPrompt = fullPrompt.replace('{{#if availableWines}}', '')
                    .replace('{{{availableWines}}}', input.availableWines.join(', '))
                    .replace('{{/if}}', '')
                    .replace('{{#if availableWines}}', '') // 2nd occurrence for specificWineExamples logic
                    .replace('{{else}}', '<!--')
                    .replace('{{/if}}', '-->');
            } else {
                fullPrompt = fullPrompt.replace('{{#if availableWines}}', '<!--')
                    .replace('{{/if}}', '-->')
                    .replace('{{#if availableWines}}', '<!--')
                    .replace('{{else}}', '')
                    .replace('{{/if}}', '');
            }

            fullPrompt += "\n\nIMPORTANTE: Responde ÚNICAMENTE con el objeto JSON.";

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (input.userToken) {
                headers['Authorization'] = `Bearer ${input.userToken}`;
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.3
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
            
            // Validate and parse JSON
            const json = JSON.parse(text);
            return GenerateWineRecommendationOutputSchema.parse(json);
        } catch (e: any) {
            console.error("BYOK Generation failed (recommendation):", e);
            throw new Error(`Failed to generate recommendation with user credentials: ${e.message}`);
        }
    } else {
        const {output} = await prompt(input);
        return output!;
    }
  }
);