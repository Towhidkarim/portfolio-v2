'use client';

import { cn } from '@/lib/utils';

import Image from 'next/image';
import { useState } from 'react';
import { generateUploadDropzone } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { toast } from 'sonner';

const UtUploadDropZone = generateUploadDropzone<OurFileRouter>();

export default function DropZone({
  setFile,
}: {
  setFile: React.Dispatch<
    React.SetStateAction<
      | {
          url: string;
          id: string;
        }
      | undefined
    >
  >;
}) {
  //   const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');

  // flex h-full flex-col items-center justify-center gap-4 text-center font-semibold opacity-80

  return (
    <div>
      <UtUploadDropZone
        endpoint='imageUploader'
        onClientUploadComplete={async (res) => {
          const { ok, fileID, fileUrl } = res[0].serverData;
          if (ok && fileID && fileUrl) {
            setFile({
              url: res[0].serverData.fileUrl,
              id: res[0].serverData.fileID,
            });
          }
        }}
        onUploadError={(error: Error) => {
          toast('Error', { description: error.message });
        }}
        // onUploadBegin={(name) => {}}
        onDrop={(acceptedFiles) => {
          const url = URL.createObjectURL(acceptedFiles[0]);
          setPreviewUrl(url);
        }}
        appearance={{
          container: cn(
            'flex h-full border-4  flex-col items-center justify-center gap-4 text-center font-semibold opacity-80',
          ),
        }}
      />
      <div className='relative my-10 h-64'>
        {previewUrl ? (
          <Image src={previewUrl} alt='temp' className='object-contain' fill />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
