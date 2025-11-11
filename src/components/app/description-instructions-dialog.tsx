import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

type DescriptionInstructionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const instructions = [
  { title: 'Ingredientes principales', examples: 'p. ej., pollo, salmón, ternera, lentejas.' },
  { title: 'Salsas y condimentos', examples: 'p. ej., salsa de tomate, salsa de crema, glaseado de soja y jengibre, hierbas.' },
  { title: 'Método de cocción', examples: 'p. ej., a la parrilla, asado, frito, al vapor.' },
  { title: 'Sabores clave', examples: 'p. ej., picante, dulce, ácido, salado, umami.' },
  { title: 'Textura', examples: 'p. ej., cremosa, crujiente, tierna.' },
];

export function DescriptionInstructionsDialog({ open, onOpenChange }: DescriptionInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Cómo Describir Tu Plato</DialogTitle>
          <DialogDescription className="pt-2">
            Para obtener la mejor recomendación de vino, proporciona una descripción detallada. ¡Cuantos más detalles, mejor será el maridaje!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>Incluye detalles como:</p>
          <ul className="space-y-3">
            {instructions.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <span className="font-semibold">{item.title}:</span>
                  <span className="text-muted-foreground"> {item.examples}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
