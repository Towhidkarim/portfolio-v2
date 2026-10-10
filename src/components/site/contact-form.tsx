import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactSection } from '@/content/site';
import { ContactSchema, type TContact } from '@/lib/schemas';
import { sendContactMail } from '@/server/fns/contact.functions';

// Own module so react-hook-form, zod and the resolver load as a separate chunk.
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TContact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { senderName: '', senderEmail: '', message: '' },
  });
  const f = contactSection.fields;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendContactMail({ data });
      toast.success(contactSection.success.title, {
        description: contactSection.success.description,
      });
      reset();
    } catch (e) {
      toast.error(contactSection.failure, {
        description: e instanceof Error ? e.message : undefined,
      });
    }
  });

  const err = (id: string, msg?: string) =>
    msg ? (
      <p id={id} role='alert' className='mt-1.5 text-[13px] text-[#FCA5A5]'>
        {msg}
      </p>
    ) : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className='space-y-5 rounded-project border border-[#1D2733] bg-[#0E161E] p-6 sm:p-8'
    >
      <div>
        <Label htmlFor='c-name' tone='panel'>
          {f.name.label}
        </Label>
        <Input
          id='c-name'
          tone='panel'
          autoComplete='name'
          placeholder={f.name.placeholder}
          aria-invalid={errors.senderName ? true : undefined}
          aria-describedby={errors.senderName ? 'c-name-err' : undefined}
          {...register('senderName')}
        />
        {err('c-name-err', errors.senderName?.message)}
      </div>
      <div>
        <Label htmlFor='c-email' tone='panel'>
          {f.email.label}
        </Label>
        <Input
          id='c-email'
          type='email'
          tone='panel'
          autoComplete='email'
          placeholder={f.email.placeholder}
          aria-invalid={errors.senderEmail ? true : undefined}
          aria-describedby={errors.senderEmail ? 'c-email-err' : undefined}
          {...register('senderEmail')}
        />
        {err('c-email-err', errors.senderEmail?.message)}
      </div>
      <div>
        <Label htmlFor='c-message' tone='panel'>
          {f.message.label}
        </Label>
        <Textarea
          id='c-message'
          tone='panel'
          rows={5}
          placeholder={f.message.placeholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'c-message-err' : undefined}
          {...register('message')}
        />
        {err('c-message-err', errors.message?.message)}
      </div>
      <Button
        type='submit'
        variant='brand'
        className='w-full'
        disabled={isSubmitting}
      >
        <Send aria-hidden='true' />
        {isSubmitting ? contactSection.sending : contactSection.submit}
      </Button>
    </form>
  );
}
