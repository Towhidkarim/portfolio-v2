'use server';

import { db } from '@/db';
import { mails } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { validateRequest } from '../auth';
import { redirect } from 'next/navigation';
import { routes } from '../constants';

export default async function FetchMailsAction(limit: number, offset: number) {
  const { user } = await validateRequest();
  if (user?.role !== 'admin') redirect(routes.login);
  try {
    const result = await db
      .select()
      .from(mails)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(mails.sentAt));
    return result;
  } catch (e) {
    console.log(e);
  }
}
