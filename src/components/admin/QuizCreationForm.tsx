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
        <Button className="text-lg px-8 py-4 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
          ✨ CREATE NEW QUIZ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
            🎯 CREATE NEW QUIZ
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
              placeholder="Enter quiz title (e.g., 'Geography Challenge')"
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
              placeholder="Describe your quiz (e.g., 'Test your knowledge of world geography with these challenging questions')"
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
              onClick={() => setIsOpen(false)}
              className="flex-1 text-lg py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 text-lg py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
            >
              {isSubmitting ? 'Creating...' : '🚀 CREATE QUIZ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
