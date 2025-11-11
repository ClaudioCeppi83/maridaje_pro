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

const FormSchema = z.object({
  dishName: z.string(),
  dishDescription: z.string().optional(),
  dishCategory: z.enum(['appetizer', 'main course', 'dessert', 'other']),
  otherDishCategory: z.string().optional(),
});

export async function getWinePairing(data: z.infer<typeof FormSchema>) {
  try {
    const { dishName, dishDescription, dishCategory, otherDishCategory } = data;

    const recommendationInput: GenerateWineRecommendationInput = {
      dishName,
      dishDescription,
      dishCategory,
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
  } catch (error) {
    console.error('Error getting wine pairing:', error);
    return { error: 'No se pudo generar la recomendación. Es posible que el modelo de IA no esté disponible. Por favor, inténtalo de nuevo más tarde.' };
  }
}
