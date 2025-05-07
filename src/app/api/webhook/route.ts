import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { EventType } from "svix/dist/api/eventType";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "your-secret";

export async function POST(req: Request) {
  const svix_id = headers().get("svix-id") ?? "";
  const svix_timestamp = headers().get("svix-timestamp") ?? "";
  const svix_signature = headers().get("svix-signature") ?? "";
  const payload = await req.json();
  const body = JSON.stringify(payload);
  if (!webhookSecret) {
    throw new Error("Missing webhook secret");
  }
  const sivx = new Webhook(webhookSecret);

  let msg: WebhookEvent;

  try {
    msg = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }

  const eventType = msg.type;
  if (eventType === "email.created") {
    console.log(msg.data);
  }

  return new Response("OK", { status: 200 });
}
