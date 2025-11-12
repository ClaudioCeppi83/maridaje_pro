'use client';

import { useState } from 'react';
import type { GenerateWineRecommendationOutput } from '@/ai/flows/generate-wine-recommendation';
import type { DescribeWineDescriptorsOutput } from '@/ai/flows/describe-wine-descriptors';
import { AppHeader } from '@/components/app/app-header';
import { DishForm, type DishFormValues } from '@/components/app/dish-form';
import { WineRecommendationDisplay } from '@/components/app/wine-recommendation-display';
import { getWinePairing } from '@/app/actions';

type PairingResult = {
  recommendation: GenerateWineRecommendationOutput;
  descriptors: DescribeWineDescriptorsOutput;
  wasDescriptionProvided: boolean;
};

export default function Home() {
  const [result, setResult] = useState<PairingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleGetRecommendation = async (data: DishFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setFormSubmitted(true);
    try {
      const pairingResult = await getWinePairing(data);
      if (pairingResult.error) {
        setError(pairingResult.error);
        setResult(null);
      } else {
        setResult(pairingResult as PairingResult);
      }
    } catch (e) {
      console.error(e);
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-semibold tracking-wide text-foreground md:text-4xl lg:text-5xl">
                Descubre el Maridaje de Vino Perfecto
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Cuéntanos sobre tu plato y nuestro sommelier de IA encontrará su vino ideal.
              </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="relative top-24 w-full lg:sticky">
                <div className="bg-card p-6 rounded-2xl shadow-lg z-10">
                  <DishForm onSubmit={handleGetRecommendation} isLoading={isLoading} />
                </div>
              </div>

              <div className="min-h-[60vh] rounded-lg">
                <WineRecommendationDisplay
                  result={result}
                  isLoading={isLoading}
                  error={error}
                  formSubmitted={formSubmitted}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Impulsado por IA. Disfruta con responsabilidad.</p>
      </footer>
    </div>
  );
}
