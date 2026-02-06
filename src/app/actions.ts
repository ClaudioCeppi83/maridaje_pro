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
import { getWineCellar, getUserProfile } from "./actions/user";

const FormSchema = z.object({
  dishName: z.string(),
  dishDescription: z.string().optional(),
  dishCategory: z.enum(['appetizer', 'main course', 'dessert', 'other']),
  otherDishCategory: z.string().optional(),
  useCellar: z.boolean().optional(),
  apiKey: z.string().optional(),
});

export async function getWinePairing(data: z.infer<typeof FormSchema>) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userToken = (session as any)?.accessToken as string | undefined;

    let availableWines: string[] | undefined = undefined;
    
    // If user is logged in, we check if they want to use their cellar
    if (session?.user?.id) {
        const profile = await getUserProfile();
        if (profile?.isCellarModeEnabled || data.useCellar) {
            availableWines = await getWineCellar();
        }
    }

    const { dishName, dishDescription, dishCategory, otherDishCategory, apiKey } = data;

    const recommendationInput: GenerateWineRecommendationInput = {
      dishName,
      dishDescription,
      dishCategory,
      userToken,
      apiKey,
      availableWines,
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
      apiKey,
    };

    const [recommendationResult, descriptorsResult] = await Promise.all([
      generateWineRecommendation(recommendationInput),
      describeWineDescriptors(descriptorInput),
    ]);

    return {
      recommendation: recommendationResult,
      descriptors: descriptorsResult,
      wasDescriptionProvided: !!dishDescription,
      dishName,
      dishDescription,
      dishCategory: dishCategory === 'other' ? otherDishCategory : dishCategory,
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
