import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';

const quizEditSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
});

type QuizEditFormData = z.infer<typeof quizEditSchema>;

interface QuizEditFormProps {
  quiz: AdminQuiz;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function QuizEditForm({ quiz, onSuccess, trigger }: QuizEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateQuiz = useAdminStore((state) => state.updateQuiz);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuizEditFormData>({
    resolver: zodResolver(quizEditSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description,
    },
  });

  const onSubmit = async (data: QuizEditFormData) => {
    try {
      updateQuiz(quiz.id, {
        title: data.title,
        description: data.description,
        updatedAt: new Date(),
      });

      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  const defaultTrigger = (
    <Button className="px-3 py-2 text-sm rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
      ✏️ EDIT
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
            ✏️ EDIT QUIZ DETAILS
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
              Quiz Title
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter quiz title"
              className="text-lg p-3 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
              Quiz Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your quiz"
              className="text-lg p-3 min-h-[100px] [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              className="flex-1 text-lg py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 text-lg py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
            >
              {isSubmitting ? 'Saving...' : '💾 SAVE CHANGES'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
