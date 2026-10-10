import { validateRequest } from '@/lib/auth';
import ImageUploadAction from '@/lib/global-actions/ImageUpload';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { generateIdFromEntropySize } from 'lucia';
import { db } from '@/db';
import { images } from '@/db/schema';

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // const uploadAction = await ImageUploadAction({
      //   fileUrl: file.url,
      //   customID: file.customId,
      //   fileSize: file.size,
      //   fileName: file.name,
      //   id: '',
      // });
      try {
        const id = generateIdFromEntropySize(10);
        await db.insert(images).values({
          id,
          fileUrl: file.url,
          key: file.key,
          fileSize: file.size,
          fileName: file.name,
        });
        return {
          ok: true,
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          fileID: id,
        };
      } catch (error) {
        return { ok: false };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
