'use server';

import { db } from '@/db';
import { mails, MailSchema } from '@/db/schema';
import { z } from 'zod';
import { generateIdFromEntropySize } from 'lucia';

export default async function SendMailAction({
  id,
  senderEmail,
  senderName,
  message,
}: z.infer<typeof MailSchema>) {
  const validatedData = MailSchema.safeParse({
    id,
    senderEmail,
    senderName,
    message,
  });
  if (!validatedData.success) return { ok: false, message: 'Invalid Data' };
  try {
    const id = generateIdFromEntropySize(10);
    await db.insert(mails).values({ id, senderEmail, senderName, message });
    return { ok: true, message: 'Message Sent Succesfully' };
  } catch (e) {
    console.log(e);
    return { ok: false, message: 'Something went wrong' };
  }
}
