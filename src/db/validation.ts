import { createInsertSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { mails, projects } from './schema';

// One definition shared by the admin form and the server functions.
export const ProjectSchema = createInsertSchema(projects, {
  id: z.string().optional(),
  projectName: z.string().min(3).max(64),
  imgUrl: z.string().url(),
  displayIndex: z.number(),
  imgID: z.string(),
  description: z.string().min(10).max(2048),
  tags: z.array(z.string()),
  summary: z.string().min(10).max(512),
  demoLink: z.string().url(),
  sourceLink: z.string().url(),
});

export const MailSchema = createInsertSchema(mails);

export type TProject = z.infer<typeof ProjectSchema>;
