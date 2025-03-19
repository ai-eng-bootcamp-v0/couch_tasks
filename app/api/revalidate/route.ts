import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// This API route is used to revalidate specific cache tags
export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json(
        { error: "Missing tag parameter" },
        { status: 400 }
      );
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, tag }, { status: 200 });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { revalidated: false, error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
