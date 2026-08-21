import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { pastes } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const [paste] = await db.select().from(pastes).where(eq(pastes.id, Number(id)));
      if (!paste) {
        return new Response("Not found", { status: 404 });
      }
      return Response.json(paste);
    }

    const allPastes = await db
      .select({ id: pastes.id, title: pastes.title, createdAt: pastes.createdAt })
      .from(pastes)
      .orderBy(desc(pastes.createdAt));

    return Response.json(allPastes);
  }

  if (req.method === "POST") {
    const { title, content } = await req.json();

    if (typeof title !== "string" || !title.trim() || title.length > 20) {
      return new Response("Title must be 1-20 characters.", { status: 400 });
    }

    if (typeof content !== "string" || content.trim().length < 100) {
      return new Response("Paste must contain at least 100 characters.", { status: 400 });
    }

    const [paste] = await db
      .insert(pastes)
      .values({ title: title.trim(), content })
      .returning();

    return Response.json(paste, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/pastes",
};
