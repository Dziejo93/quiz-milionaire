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

const quizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizCreationFormProps {
  onSuccess?: (quiz: AdminQuiz) => void;
}

export function QuizCreationForm({ onSuccess }: QuizCreationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createQuiz = useAdminStore((state) => state.createQuiz);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      const newQuiz = createQuiz({
        title: data.title,
        description: data.description,
        questions: [],
        prizeStructure: [],
      });

      reset();
      setIsOpen(false);
      onSuccess?.(newQuiz);
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="millionaire-button text-lg px-8 py-4 font-bold">
          ✨ CREATE NEW QUIZ
        </Button>
      </DialogTrigger>
      <DialogContent className="millionaire-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="millionaire-title text-2xl font-bold text-center">
            🎯 CREATE NEW QUIZ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="millionaire-prize text-lg font-semibold">
              Quiz Title
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter quiz title (e.g., 'Geography Challenge')"
              className="millionaire-card border-millionaire-gold/30 text-lg p-3"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="millionaire-prize text-lg font-semibold">
              Quiz Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your quiz (e.g., 'Test your knowledge of world geography with these challenging questions')"
              className="millionaire-card border-millionaire-gold/30 text-lg p-3 min-h-[100px]"
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description.message}</p>
            )}
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
              {isSubmitting ? 'Creating...' : '🚀 CREATE QUIZ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
