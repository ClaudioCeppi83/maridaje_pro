'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Info, ChefHat, Lock, Wine } from 'lucide-react';
import { DescriptionInstructionsDialog } from './description-instructions-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SignIn } from '@/components/auth/auth-components';

const formSchema = z
  .object({
    dishName: z.string().min(2, { message: 'El nombre del plato debe tener al menos 2 caracteres.' }),
    dishDescription: z.string().optional(),
    dishCategory: z.enum(['appetizer', 'main course', 'dessert', 'other'], {
      required_error: 'Por favor selecciona una categoría de plato.',
    }),
    otherDishCategory: z.string().optional(),
    useCellar: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.dishCategory === 'other') {
        return data.otherDishCategory && data.otherDishCategory.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Por favor especifica la categoría de tu plato.',
      path: ['otherDishCategory'],
    }
  );

export type DishFormValues = z.infer<typeof formSchema>;

type DishFormProps = {
  onSubmit: (values: DishFormValues) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function DishForm({ onSubmit, isLoading, isAuthenticated }: DishFormProps) {
  console.log('DishForm isLoading:', isLoading);
  const [isInstructionsOpen, setInstructionsOpen] = useState(false);
  const [isOtherCategoryOpen, setOtherCategoryOpen] = useState(false);
  const [otherCategoryValue, setOtherCategoryValue] = useState('');


  const form = useForm<DishFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dishName: '',
      dishDescription: '',
      otherDishCategory: '',
    },
  });

  const handleCategoryChange = (value: string) => {
    form.setValue('dishCategory', value as DishFormValues['dishCategory'], { 
      shouldValidate: true 
    });
    
    if (value === 'other') {
      setOtherCategoryOpen(true);
    } else {
      form.setValue('otherDishCategory', '');
      form.clearErrors('otherDishCategory');
      setOtherCategoryValue('');
    }
  };

  const handleSaveOtherCategory = () => {
    const trimmed = otherCategoryValue.trim();
    form.setValue('otherDishCategory', trimmed, { 
      shouldValidate: true 
    });
    setOtherCategoryOpen(false);
  }

  return (
    <>
      <Card className="border-2 border-primary/20 shadow-lg shadow-primary/5 p-6 relative overflow-hidden">
        
        {!isAuthenticated && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
             <div className="rounded-xl border bg-card p-6 shadow-xl text-center max-w-sm mx-4">
                <Lock className="mx-auto h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Inicia Sesión para Usar</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Conecta tu cuenta de Google para obtener recomendaciones ilimitadas del Sommelier IA.
                </p>
                <div className="w-full">
                  <SignIn className="w-full" size="lg" />
                </div>
             </div>
           </div>
        )}

        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-3 text-3xl">
            <ChefHat className="h-8 w-8 text-primary" />
            Describe tu Plato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="dishName"
                render={({ field }) => (
                  <FormItem id="dish-name">
                    <FormLabel>Nombre del Plato</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="p. ej., Osso Buco alla Milanese" 
                        disabled={!isAuthenticated}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dishCategory"
                render={({ field }) => (
                  <FormItem id="dish-category">
                    <FormLabel>Categoría del Plato</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleCategoryChange(val);
                      }} 
                      value={field.value} 
                      disabled={!isAuthenticated}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="appetizer">Entrante</SelectItem>
                        <SelectItem value="main course">Plato Principal</SelectItem>
                        <SelectItem value="dessert">Postre</SelectItem>
                        <SelectItem value="other">Otro...</SelectItem>
                      </SelectContent>
                    </Select>
                      {field.value === 'other' && form.watch('otherDishCategory') && (
                      <FormDescription>
                        Categoría: {form.watch('otherDishCategory')}
                      </FormDescription>
                    )}
                    <FormMessage>{form.formState.errors.otherDishCategory?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dishDescription"
                render={({ field }) => (
                  <FormItem id="dish-description">
                    <div className="flex items-center justify-between">
                      <FormLabel>Descripción del Plato (Opcional)</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-accent"
                        onClick={() => setInstructionsOpen(true)}
                        disabled={!isAuthenticated}
                      >
                        <Info className="mr-1 h-4 w-4" />
                        ¿Cómo describir?
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Describe los ingredientes, sabores y método de cocción..."
                        className="min-h-[120px] resize-y"
                        disabled={!isAuthenticated}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isAuthenticated && (
                <FormField
                  control={form.control}
                  name="useCellar"
                  render={({ field }) => (
                    <FormItem id="use-cellar" className="flex flex-row items-center justify-between rounded-lg border p-4 bg-primary/5 border-primary/20">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Wine className="w-4 h-4 text-primary" /> Maridar con mi Bodega
                        </FormLabel>
                        <FormDescription>
                          Limitaremos las opciones a los vinos que has guardado en tu perfil.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="sticky bottom-0 z-10 -mx-6 -mb-6 bg-card p-6 pt-4 lg:static lg:m-0 lg:p-0 lg:bg-transparent">
                <Button type="submit" disabled={isLoading || !isAuthenticated} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                  {isLoading ? (
                    <>
                      <dotlottie-wc src="https://lottie.host/c86cdc0a-62d5-4ab9-9cd4-7f4167a0f063/mMmYpk2R4X.lottie" style={{ width: '24px', height: '24px' }} autoplay loop></dotlottie-wc>
                      Buscando el maridaje perfecto...
                    </>
                  ) : (
                    'Obtener Recomendación de Vino'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <DescriptionInstructionsDialog open={isInstructionsOpen} onOpenChange={setInstructionsOpen} />

      <Dialog open={isOtherCategoryOpen} onOpenChange={setOtherCategoryOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Especificar Categoría</DialogTitle>
            </DialogHeader>
            <Input
                placeholder="p. ej., Brunch, Guarnición"
                value={otherCategoryValue}
                onChange={(e) => setOtherCategoryValue(e.target.value)}
            />
            <DialogFooter>
                <Button onClick={handleSaveOtherCategory}>Guardar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
