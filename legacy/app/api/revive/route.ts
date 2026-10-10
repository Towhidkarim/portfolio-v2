import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const res = await db
      .select({ projectName: projects.projectName })
      .from(projects)
      .where(eq(projects.enabled, true))
      .limit(1);
    return Response.json({ res });
  } catch (error) {
    console.log(error);
  }
}
