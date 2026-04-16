import { NextRequest, NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { presentations, presentationSlides } from "@/db/schema";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { parsePptx } from "@/modules/presentations/server/ppt-parser";
import { MAX_FREE_PRESENTATIONS } from "@/modules/premium/constants";
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
    // Check free trial limit
    const customer = await polarClient.customers.getStateExternal({
      externalId: session.user.id,
    });
    const isPremium = customer.activeSubscriptions.length > 0;

    if (!isPremium) {
      const [userPresentations] = await db
        .select({ count: count(presentations.id) })
        .from(presentations)
        .where(eq(presentations.userId, session.user.id));

      if (userPresentations.count >= MAX_FREE_PRESENTATIONS) {
        return NextResponse.json(
          { error: "You have reached the maximum number of free presentations. Upgrade to upload more." },
          { status: 403 }
        );
      }
    }

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

    // Parse the PPTX file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsedSlides = await parsePptx(buffer);

    // Create the presentation record
    const [createdPresentation] = await db
      .insert(presentations)
      .values({
        name,
        userId: session.user.id,
        totalSlides: parsedSlides.length,
      })
      .returning();

    // Insert all slides
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
    });
  } catch (error) {
    console.error("Error processing PPTX:", error);
    return NextResponse.json(
      { error: "Failed to process presentation file" },
      { status: 500 }
    );
  }
}
