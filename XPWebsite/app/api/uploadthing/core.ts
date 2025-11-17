import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Beat cover images
  beatCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Beat cover uploaded:", file.url);
      return { url: file.url };
    }),

  // Beat preview files (60-second MP3)
  beatPreview: f({ audio: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Beat preview uploaded:", file.url);
      return { url: file.url };
    }),

  // Full beat files (MP3/WAV)
  beatFile: f({ 
    "audio/mpeg": { maxFileSize: "32MB", maxFileCount: 1 },
    "audio/wav": { maxFileSize: "128MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Beat file uploaded:", file.url);
      return { url: file.url };
    }),

  // Trackout packages (ZIP files)
  trackouts: f({ 
    "application/zip": { maxFileSize: "256MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Trackouts uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;