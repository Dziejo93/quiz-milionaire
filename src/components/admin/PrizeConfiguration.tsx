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
    resolver: zodResolver(prizeSchema),
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

  const onSubmit = async (data: PrizeFormData) => {
    try {
      // Sort by level to ensure proper order
      const sortedPrizes = data.prizeStructure
        .map((prize, index) => ({ ...prize, level: index + 1 }))
        .sort((a, b) => a.level - b.level);

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
        <Button className="millionaire-button text-lg px-8 py-4 font-bold">
          💰 CONFIGURE PRIZES
        </Button>
      </DialogTrigger>
      <DialogContent className="millionaire-card max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="millionaire-title text-2xl font-bold text-center">
            💰 PRIZE CONFIGURATION
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="millionaire-prize text-lg font-semibold">Prize Structure</Label>
              <Button
                type="button"
                onClick={addPrizeLevel}
                className="millionaire-button px-4 py-2 text-sm font-bold"
              >
                ➕ ADD LEVEL
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="millionaire-card rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="millionaire-prize font-bold text-lg w-16 text-center">
                      Level {index + 1}
                    </div>

                    <div className="flex-1">
                      <Label className="text-sm font-semibold mb-1 block">Prize Amount ($)</Label>
                      <Input
                        type="number"
                        {...register(`prizeStructure.${index}.amount`)}
                        className="millionaire-card border-millionaire-gold/30 text-lg p-2"
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
                      className={`px-4 py-2 font-bold text-sm ${
                        field.isSafeHaven
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'millionaire-button'
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

          <div className="millionaire-card rounded-lg p-4">
            <h4 className="millionaire-prize text-lg font-semibold mb-3">🛡️ Safe Haven Levels</h4>
            <p className="text-muted-foreground text-sm mb-2">
              Safe haven levels guarantee that players keep their winnings even if they answer
              incorrectly on subsequent questions.
            </p>
            <div className="text-sm text-muted-foreground">
              <strong>Current Safe Havens:</strong>{' '}
              {fields
                .filter((field) => field.isSafeHaven)
                .map((field, index, arr) => (
                  <span key={field.id} className="millionaire-prize font-semibold">
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
              className="millionaire-button flex-1 text-lg py-3 font-bold"
            >
              {isSubmitting ? 'Saving...' : '💾 SAVE PRIZES'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
