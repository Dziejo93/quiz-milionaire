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
          id: z.string().optional(),
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
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    register,
  } = useForm({
    resolver: zodResolver(questionSchema) as any,
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

  const onSubmit = async (data: any) => {
    try {
      const answersWithIds = data.answers.map((answer: any, index: number) => ({
        ...answer,
        id: answer.id || `answer-${Date.now()}-${index}`,
      }));

      if (question) {
        updateQuestion(quizId, question.id, {
          text: data.text,
          type: data.type,
          imageUrl: data.type === 'image' ? data.imageUrl : undefined,
          difficulty: data.difficulty as 1 | 2 | 3 | 4 | 5,
          answers: answersWithIds,
        });
      } else {
        addQuestion(quizId, {
          text: data.text,
          type: data.type,
          imageUrl: data.type === 'image' ? data.imageUrl : undefined,
          difficulty: data.difficulty as 1 | 2 | 3 | 4 | 5,
          answers: answersWithIds,
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
    <Button className="text-lg px-6 py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
      {question ? '✏️ EDIT QUESTION' : '➕ ADD QUESTION'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
            {question ? '✏️ EDIT QUESTION' : '➕ ADD NEW QUESTION'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">Question Type</Label>
              <Select
                value={questionType}
                onValueChange={(value: 'text' | 'image') => {
                  setQuestionType(value);
                  setValue('type', value);
                }}
              >
                <SelectTrigger className="text-lg p-3 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="[background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white">
                  <SelectItem value="text">📝 Text Question</SelectItem>
                  <SelectItem value="image">🖼️ Image Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">Difficulty Level</Label>
              <Select
                value={watch('difficulty')?.toString()}
                onValueChange={(value) =>
                  setValue('difficulty', parseInt(value) as 1 | 2 | 3 | 4 | 5)
                }
              >
                <SelectTrigger className="text-lg p-3 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="[background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white">
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
            <Label htmlFor="text" className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
              Question Text
            </Label>
            <Textarea
              id="text"
              {...register('text')}
              placeholder="Enter your question here..."
              className="text-lg p-3 min-h-[100px] [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
            />
            {errors.text && <p className="text-red-400 text-sm">{errors.text.message}</p>}
          </div>

          {questionType === 'image' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  {...register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                  className="text-lg p-3 bg-gradient-to-r from-[hsl(var(--millionaire-blue-light))] to-[hsl(var(--millionaire-blue))] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
                />
                {errors.imageUrl && (
                  <p className="text-red-400 text-sm">{errors.imageUrl.message}</p>
                )}
              </div>

              {watchedImageUrl && (
                <div className="rounded-lg p-4 bg-gradient-to-r from-[hsl(var(--millionaire-blue-light))] to-[hsl(var(--millionaire-blue))] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <Label className="text-lg font-semibold mb-2 block text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                    🖼️ Image Preview
                  </Label>
                  <img
                    src={watchedImageUrl}
                    alt="Question preview"
                    className="max-w-full h-auto rounded-lg border-2 border-[hsl(var(--millionaire-gold)/0.3)]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
              Answer Options (Select the correct answer)
            </Label>
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg p-4 space-y-3 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center text-[hsl(var(--millionaire-gold))] bg-[hsl(var(--millionaire-gold)/0.2)] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    {...register(`answers.${index}.text`)}
                    placeholder={`Answer ${String.fromCharCode(65 + index)}`}
                    className="flex-1 text-lg p-3 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => handleCorrectAnswerChange(index)}
                    className={`px-4 py-2 font-bold rounded-full ${
                      watch(`answers.${index}.isCorrect`)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : '[background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]'
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
              className="flex-1 text-lg py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
            >
              {isSubmitting ? 'Saving...' : question ? '💾 UPDATE QUESTION' : '🚀 ADD QUESTION'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
