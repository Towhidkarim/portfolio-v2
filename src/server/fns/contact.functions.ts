import { createServerFn } from '@tanstack/react-start';
import { ContactSchema } from '@/lib/schemas';
import { getDb } from '../db.server';
import { createMail } from '../queries/mails.server';

export const sendContactMail = createServerFn({ method: 'POST' })
  .inputValidator(ContactSchema)
  .handler(async ({ data }) => {
    await createMail(getDb(), data);
    return { ok: true as const };
  });
