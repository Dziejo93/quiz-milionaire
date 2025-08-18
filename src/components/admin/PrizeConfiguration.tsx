import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import type { EntityId } from '@/shared/types';

const prizeSchema = z.object({
  prizeStructure: z
    .array(
      z.object({
        level: z.number().min(1),
        amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
        isSafeHaven: z.boolean(),
      })
    )
    .min(1, 'Must have at least one prize level'),
});

type PrizeFormData = z.infer<typeof prizeSchema>;

interface PrizeConfigurationProps {
  quizId: EntityId;
  currentPrizes: AdminQuiz['prizeStructure'];
  onSuccess?: () => void;
}

export function PrizeConfiguration({ quizId, currentPrizes, onSuccess }: PrizeConfigurationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updatePrizeStructure = useAdminStore((state) => state.updatePrizeStructure);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrizeFormData>({
    resolver: zodResolver(prizeSchema) as any,
    defaultValues: {
      prizeStructure:
        currentPrizes.length > 0
          ? currentPrizes
          : [
              { level: 1, amount: 100, isSafeHaven: false },
              { level: 2, amount: 200, isSafeHaven: false },
              { level: 3, amount: 300, isSafeHaven: false },
              { level: 4, amount: 500, isSafeHaven: false },
              { level: 5, amount: 1000, isSafeHaven: true },
            ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'prizeStructure',
  });

  const onSubmit = async (data: any) => {
    try {
      // Sort by level to ensure proper order
      const sortedPrizes = data.prizeStructure
        .map((prize: any, index: number) => ({ ...prize, level: index + 1 }))
        .sort((a: any, b: any) => a.level - b.level);

      updatePrizeStructure(quizId, sortedPrizes);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update prize structure:', error);
    }
  };

  const addPrizeLevel = () => {
    const nextLevel = fields.length + 1;
    const lastAmount = fields[fields.length - 1]?.amount || 0;
    const suggestedAmount = Math.round(lastAmount * 1.5) || 100;

    append({
      level: nextLevel,
      amount: suggestedAmount,
      isSafeHaven: false,
    });
  };

  const toggleSafeHaven = (index: number) => {
    const currentPrize = fields[index];
    update(index, {
      ...currentPrize,
      isSafeHaven: !currentPrize.isSafeHaven,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-lg px-8 py-4 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
          💰 CONFIGURE PRIZES
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
            💰 PRIZE CONFIGURATION
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">Prize Structure</Label>
              <Button
                type="button"
                onClick={addPrizeLevel}
                className="px-4 py-2 text-sm font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
              >
                ➕ ADD LEVEL
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg p-4 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-lg w-16 text-center text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                      Level {index + 1}
                    </div>

                    <div className="flex-1">
                      <Label className="text-sm font-semibold mb-1 block">Prize Amount ($)</Label>
                      <Input
                        type="number"
                        {...register(`prizeStructure.${index}.amount`)}
                        className="text-lg p-2 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
                        min="1"
                      />
                      {errors.prizeStructure?.[index]?.amount && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.prizeStructure[index]?.amount?.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={() => toggleSafeHaven(index)}
                      className={`px-4 py-2 font-bold text-sm rounded-full ${
                        field.isSafeHaven
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : '[background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]'
                      }`}
                    >
                      {field.isSafeHaven ? '🛡️ SAFE HAVEN' : 'Mark Safe Haven'}
                    </Button>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        className="px-3 py-2 text-sm"
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.prizeStructure && typeof errors.prizeStructure.message === 'string' && (
              <p className="text-red-400 text-sm">{errors.prizeStructure.message}</p>
            )}
          </div>

          <div className="rounded-lg p-4 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <h4 className="text-lg font-semibold mb-3 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">🛡️ Safe Haven Levels</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Safe haven levels guarantee that players keep their winnings even if they answer
              incorrectly on subsequent questions.
            </p>
            <div className="text-sm text-muted-foreground">
              <strong>Current Safe Havens:</strong>{' '}
              {fields
                .filter((field) => field.isSafeHaven)
                .map((field, index, arr) => (
                  <span key={field.id} className="font-semibold text-[hsl(var(--millionaire-gold))]">
                    Level {fields.indexOf(field) + 1} (${field.amount})
                    {index < arr.length - 1 ? ', ' : ''}
                  </span>
                )) || 'None'}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-lg py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 text-lg py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
            >
              {isSubmitting ? 'Saving...' : '💾 SAVE PRIZES'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
