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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type AdminQuestion, useAdminStore } from '@/lib/adminStore';
import type { EntityId } from '@/shared/types';

const questionSchema = z
  .object({
    text: z
      .string()
      .min(1, 'Question text is required')
      .max(500, 'Question must be less than 500 characters'),
    type: z.enum(['text', 'image']),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    difficulty: z.coerce.number().min(1).max(5),
    answers: z
      .array(
        z.object({
          text: z.string().min(1, 'Answer text is required'),
          isCorrect: z.boolean(),
        })
      )
      .length(4, 'Must have exactly 4 answers'),
  })
  .refine(
    (data) => {
      const correctAnswers = data.answers.filter((answer) => answer.isCorrect);
      return correctAnswers.length === 1;
    },
    {
      message: 'Must have exactly one correct answer',
      path: ['answers'],
    }
  );

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  quizId: EntityId;
  question?: AdminQuestion;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function QuestionForm({ quizId, question, onSuccess, trigger }: QuestionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [questionType, setQuestionType] = useState<'text' | 'image'>(question?.type || 'text');
  const addQuestion = useAdminStore((state) => state.addQuestion);
  const updateQuestion = useAdminStore((state) => state.updateQuestion);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: question
      ? {
          text: question.text,
          type: question.type,
          imageUrl: question.imageUrl || '',
          difficulty: question.difficulty,
          answers: question.answers,
        }
      : {
          text: '',
          type: 'text',
          imageUrl: '',
          difficulty: 1,
          answers: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
  });

  const { fields, update } = useFieldArray({
    control,
    name: 'answers',
  });

  const watchedImageUrl = watch('imageUrl');

  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (question) {
        updateQuestion(quizId, question.id, {
          text: data.text,
          type: data.type,
          imageUrl: data.type === 'image' ? data.imageUrl : undefined,
          difficulty: data.difficulty,
          answers: data.answers,
        });
      } else {
        addQuestion(quizId, {
          text: data.text,
          type: data.type,
          imageUrl: data.type === 'image' ? data.imageUrl : undefined,
          difficulty: data.difficulty,
          answers: data.answers,
        });
      }

      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleCorrectAnswerChange = (index: number) => {
    fields.forEach((_, i) => {
      update(i, { ...fields[i], isCorrect: i === index });
    });
  };

  const defaultTrigger = (
    <Button className="millionaire-button text-lg px-6 py-3 font-bold">
      {question ? '✏️ EDIT QUESTION' : '➕ ADD QUESTION'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="millionaire-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="millionaire-title text-2xl font-bold text-center">
            {question ? '✏️ EDIT QUESTION' : '➕ ADD NEW QUESTION'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="millionaire-prize text-lg font-semibold">Question Type</Label>
              <Select
                value={questionType}
                onValueChange={(value: 'text' | 'image') => {
                  setQuestionType(value);
                  setValue('type', value);
                }}
              >
                <SelectTrigger className="millionaire-card border-millionaire-gold/30 text-lg p-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="millionaire-card">
                  <SelectItem value="text">📝 Text Question</SelectItem>
                  <SelectItem value="image">🖼️ Image Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="millionaire-prize text-lg font-semibold">Difficulty Level</Label>
              <Select
                value={watch('difficulty')?.toString()}
                onValueChange={(value) =>
                  setValue('difficulty', parseInt(value) as 1 | 2 | 3 | 4 | 5)
                }
              >
                <SelectTrigger className="millionaire-card border-millionaire-gold/30 text-lg p-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="millionaire-card">
                  <SelectItem value="1">⭐ Level 1 - Easy</SelectItem>
                  <SelectItem value="2">⭐⭐ Level 2 - Medium</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Level 3 - Hard</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Level 4 - Expert</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Level 5 - Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text" className="millionaire-prize text-lg font-semibold">
              Question Text
            </Label>
            <Textarea
              id="text"
              {...register('text')}
              placeholder="Enter your question here..."
              className="millionaire-card border-millionaire-gold/30 text-lg p-3 min-h-[100px]"
            />
            {errors.text && <p className="text-red-400 text-sm">{errors.text.message}</p>}
          </div>

          {questionType === 'image' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="millionaire-prize text-lg font-semibold">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  {...register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                  className="millionaire-card border-millionaire-gold/30 text-lg p-3"
                />
                {errors.imageUrl && (
                  <p className="text-red-400 text-sm">{errors.imageUrl.message}</p>
                )}
              </div>

              {watchedImageUrl && (
                <div className="millionaire-card rounded-lg p-4">
                  <Label className="millionaire-prize text-lg font-semibold mb-2 block">
                    🖼️ Image Preview
                  </Label>
                  <img
                    src={watchedImageUrl}
                    alt="Question preview"
                    className="max-w-full h-auto rounded-lg border-2 border-millionaire-gold/30"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label className="millionaire-prize text-lg font-semibold">
              Answer Options (Select the correct answer)
            </Label>
            {fields.map((field, index) => (
              <div key={field.id} className="millionaire-card rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="millionaire-prize font-bold text-lg w-8 h-8 rounded-full bg-millionaire-gold/20 flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    {...register(`answers.${index}.text`)}
                    placeholder={`Answer ${String.fromCharCode(65 + index)}`}
                    className="flex-1 millionaire-card border-millionaire-gold/30 text-lg p-3"
                  />
                  <Button
                    type="button"
                    onClick={() => handleCorrectAnswerChange(index)}
                    className={`px-4 py-2 font-bold ${
                      watch(`answers.${index}.isCorrect`)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'millionaire-button'
                    }`}
                  >
                    {watch(`answers.${index}.isCorrect`) ? '✅ CORRECT' : 'Mark Correct'}
                  </Button>
                </div>
                {errors.answers?.[index]?.text && (
                  <p className="text-red-400 text-sm ml-11">
                    {errors.answers[index]?.text?.message}
                  </p>
                )}
              </div>
            ))}
            {errors.answers && typeof errors.answers.message === 'string' && (
              <p className="text-red-400 text-sm">{errors.answers.message}</p>
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
              {isSubmitting ? 'Saving...' : question ? '💾 UPDATE QUESTION' : '🚀 ADD QUESTION'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
