'use server';

import { z } from 'zod';
import {
  generateWineRecommendation,
  type GenerateWineRecommendationInput,
} from '@/ai/flows/generate-wine-recommendation';
import {
  describeWineDescriptors,
  type DescribeWineDescriptorsInput,
} from '@/ai/flows/describe-wine-descriptors';
import { auth } from "@/auth";

const FormSchema = z.object({
  dishName: z.string(),
  dishDescription: z.string().optional(),
  dishCategory: z.enum(['appetizer', 'main course', 'dessert', 'other']),
  otherDishCategory: z.string().optional(),
});

export async function getWinePairing(data: z.infer<typeof FormSchema>) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userToken = (session as any)?.accessToken as string | undefined;

    const { dishName, dishDescription, dishCategory, otherDishCategory } = data;

    const recommendationInput: GenerateWineRecommendationInput = {
      dishName,
      dishDescription,
      dishCategory,
      userToken,
    };
    if (dishCategory === 'other' && otherDishCategory) {
      recommendationInput.otherDishCategory = otherDishCategory;
    }

    const descriptorInput: DescribeWineDescriptorsInput = {
      dishName,
      dishDescription,
      dishCategory:
        dishCategory === 'other' && otherDishCategory
          ? otherDishCategory
          : dishCategory,
      userToken,
    };

    const [recommendationResult, descriptorsResult] = await Promise.all([
      generateWineRecommendation(recommendationInput),
      describeWineDescriptors(descriptorInput),
    ]);

    return {
      recommendation: recommendationResult,
      descriptors: descriptorsResult,
      wasDescriptionProvided: !!dishDescription,
      error: null,
    };
  } catch (error: any) {
    console.error('Error getting wine pairing:', error);
    if (error?.message) console.error('Error Message:', error.message);
    if (error?.response) {
        console.error('Error Response:', JSON.stringify(error.response, null, 2));
    }
    // Check if it's a candidate safety error or other specific API error structure
    if (error?.statusText) console.error('Error Status:', error.statusText);
    
    return { error: `No se pudo generar la recomendación. Error: ${error.message || 'Desconocido'}` };
  }
}
