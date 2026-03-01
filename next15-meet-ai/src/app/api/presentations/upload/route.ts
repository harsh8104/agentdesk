import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { presentations, presentationSlides } from "@/db/schema";
import { auth } from "@/lib/auth";
import { parsePptx } from "@/modules/presentations/server/ppt-parser";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  // Authenticate the user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "Untitled Presentation";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".pptx")) {
      return NextResponse.json(
        { error: "Invalid file type. Only .pptx files are supported." },
        { status: 400 }
      );
    }

    // Parse the PPTX file for text extraction
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsedSlides = await parsePptx(buffer);

    // Save the original file to public/presentations/
    const uploadsDir = join(process.cwd(), "public", "presentations");
    await mkdir(uploadsDir, { recursive: true });

    // Create the presentation record first to get the ID
    const [createdPresentation] = await db
      .insert(presentations)
      .values({
        name,
        userId: session.user.id,
        totalSlides: parsedSlides.length,
      })
      .returning();

    // Save file using the ID as filename
    const fileName = `${createdPresentation.id}.pptx`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Update presentation with file URL
    const fileUrl = `/presentations/${fileName}`;
    await db
      .update(presentations)
      .set({ fileUrl })
      .where(eq(presentations.id, createdPresentation.id));

    // Insert all slides (text content for AI context)
    if (parsedSlides.length > 0) {
      await db.insert(presentationSlides).values(
        parsedSlides.map((slide) => ({
          presentationId: createdPresentation.id,
          slideNumber: slide.slideNumber,
          textContent: slide.textContent,
        }))
      );
    }

    return NextResponse.json({
      id: createdPresentation.id,
      name: createdPresentation.name,
      totalSlides: createdPresentation.totalSlides,
      fileUrl,
    });
  } catch (error) {
    console.error("Error processing PPTX:", error);
    return NextResponse.json(
      { error: "Failed to process presentation file" },
      { status: 500 }
    );
  }
}
