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
import { Loader2, Info, ChefHat } from 'lucide-react';
import { DescriptionInstructionsDialog } from './description-instructions-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const formSchema = z
  .object({
    dishName: z.string().min(2, { message: 'El nombre del plato debe tener al menos 2 caracteres.' }),
    dishDescription: z.string().optional(),
    dishCategory: z.enum(['appetizer', 'main course', 'dessert', 'other'], {
      required_error: 'Por favor selecciona una categoría de plato.',
    }),
    otherDishCategory: z.string().optional(),
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
};

export function DishForm({ onSubmit, isLoading }: DishFormProps) {
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
    form.setValue('dishCategory', value as DishFormValues['dishCategory']);
    if (value === 'other') {
      setOtherCategoryOpen(true);
    } else {
        form.setValue('otherDishCategory', '');
        form.clearErrors('otherDishCategory');
    }
  };
  
  const handleSaveOtherCategory = () => {
    form.setValue('otherDishCategory', otherCategoryValue);
    if(otherCategoryValue.trim().length > 0) {
        form.clearErrors('otherDishCategory');
    }
    setOtherCategoryOpen(false);
  }

  return (
    <>
      <Card className="border-2 border-primary/20 shadow-lg shadow-primary/5">
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
                  <FormItem>
                    <FormLabel>Nombre del Plato</FormLabel>
                    <FormControl>
                      <Input placeholder="p. ej., Osso Buco alla Milanese" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dishCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría del Plato</FormLabel>
                    <Select onValueChange={handleCategoryChange} defaultValue={field.value}>
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
                     {form.watch('dishCategory') === 'other' && form.watch('otherDishCategory') && (
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
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Descripción del Plato (Opcional)</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-accent"
                        onClick={() => setInstructionsOpen(true)}
                      >
                        <Info className="mr-1 h-4 w-4" />
                        ¿Cómo describir?
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Describe los ingredientes, sabores y método de cocción..."
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando Maridaje...
                  </>
                ) : (
                  'Obtener Recomendación de Vino'
                )}
              </Button>
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
