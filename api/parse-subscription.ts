import { gemini } from "./_lib/gemini.js";
import { requireUser } from "./_lib/auth.js";

const CATEGORIES = [
  "Streaming",
  "Software",
  "Music",
  "Gaming",
  "News",
  "Fitness",
  "Cloud Storage",
  "Other",
];

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await requireUser(req);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const transcript = req.body?.transcript;
  if (typeof transcript !== "string" || !transcript.trim()) {
    res.status(400).json({ error: "Missing transcript" });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: transcript,
      config: {
        systemInstruction: `Today's date is ${today}. Extract subscription details from what the user said out loud. If they don't mention a currency, default to USD. If they don't give an exact renewal date but imply "today" or "just now", use today's date. Pick the closest matching category from the allowed list; use "Other" if nothing fits well.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Subscription/service name, e.g. Netflix" },
            price: { type: "number", description: "Price as a plain number, no currency symbol" },
            currency: { type: "string", description: "3-letter ISO currency code" },
            billingCycle: { type: "string", enum: ["weekly", "monthly", "yearly"] },
            category: { type: "string", enum: CATEGORIES },
            renewalDate: { type: "string", description: "Next renewal date, ISO format yyyy-MM-dd" },
          },
          required: ["name", "price", "currency", "billingCycle", "category", "renewalDate"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.status(422).json({ error: "Couldn't understand that. Please try again." });
      return;
    }

    const subscription = JSON.parse(text);
    res.status(200).json({ subscription });
  } catch (err) {
    console.error("parseSubscription failed:", err);
    res.status(500).json({ error: "Failed to parse subscription" });
  }
}
