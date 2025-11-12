
'use client';

import type { GenerateWineRecommendationOutput } from '@/ai/flows/generate-wine-recommendation';
import type { DescribeWineDescriptorsOutput } from '@/ai/flows/describe-wine-descriptors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Grape, Thermometer, Wine, BrainCircuit, Sparkles, ListTree, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PairingResult = {
  recommendation: GenerateWineRecommendationOutput;
  descriptors: DescribeWineDescriptorsOutput;
  wasDescriptionProvided: boolean;
};

type WineRecommendationDisplayProps = {
  result: PairingResult | null;
  isLoading: boolean;
  error: string | null;
  formSubmitted: boolean;
};

function InfoCard({ icon, title, value }: { icon: React.ElementType, title: string, value: string | undefined }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
      <div className="rounded-full bg-primary/10 p-2 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <p className="text-lg font-bold">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <dotlottie-wc src="https://lottie.host/c86cdc0a-62d5-4ab9-9cd4-7f4167a0f063/mMmYpk2R4X.lottie" style={{ width: '300px', height: '300px' }} autoplay loop></dotlottie-wc>
      <motion.p
        key="loading-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 0.5, 1], y: 0 }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-lg font-semibold text-muted-foreground"
      >
        Preparando Maridaje para usted
      </motion.p>
    </div>
  );
}

function WelcomeScreen() {
    return (
        <div className="flex h-full items-center justify-center rounded-2xl border-2 border-dashed border-border">
            <div className="text-center">
                <div className="inline-block rounded-full bg-primary/10 p-4 text-primary">
                    <Wine className="h-12 w-12" />
                </div>
                <h2 className="mt-4 font-headline text-2xl font-semibold">Tu Maridaje Perfecto te Espera</h2>
                <p className="mt-2 text-muted-foreground">Completa el formulario para descubrir tu vino ideal.</p>
            </div>
        </div>
    )
}

export function WineRecommendationDisplay({
  result,
  isLoading,
  error,
  formSubmitted
}: WineRecommendationDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return formSubmitted ? null : <WelcomeScreen />;
  }

  const { recommendation, descriptors, wasDescriptionProvided } = result;

  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key="wine-recommendation"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6 p-6"
        >
          {!wasDescriptionProvided && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Aviso</AlertTitle>
              <AlertDescription>
                No se proporcionó una descripción detallada del plato. Para una recomendación más precisa, intenta añadir más detalles sobre tu plato.
              </AlertDescription>
            </Alert>
          )}

          <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-lg shadow-primary/5">
            <CardHeader className="bg-primary/5">
              <CardTitle className="font-headline flex items-center gap-3 text-3xl text-primary">
                <Grape className="h-8 w-8" />
                <span>{recommendation.recommendedGrapeVarietals}</span>
              </CardTitle>
              <CardDescription>
                Tu cepa de uva recomendada para el maridaje.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-lg"><Sparkles className="h-5 w-5 text-accent"/>Notas de Cata</h3>
                  <p className="mt-1 text-muted-foreground">{recommendation.tastingNotes}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-lg"><ListTree className="h-5 w-5 text-accent"/>Características Ideales</h3>
                  <p className="mt-1 text-muted-foreground">{recommendation.wineCharacteristics}</p>
                </div>
                 <Separator />
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-lg"><Wine className="h-5 w-5 text-accent"/>Vinos Recomendados</h3>
                  <ul className="mt-2 space-y-2 text-muted-foreground">
                    {recommendation.specificWineExamples.map((wine, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{wine}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard icon={Thermometer} title="Temperatura de Servicio" value={recommendation.servingTemperature} />
            <InfoCard icon={Wine} title="Cristalería Recomendada" value={recommendation.suitableGlassware} />
          </div>

          <Card className="bg-card">
             <CardHeader>
               <CardTitle className="font-headline flex items-center gap-3 text-2xl">
                 <BrainCircuit className="h-7 w-7 text-primary" />
                 Razonamiento del Sommelier
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4 text-muted-foreground">
                    {descriptors.wineDescriptors.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
             </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
