import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert accountant and billing specialist. Based on the client name, service description, amount, due date, payment terms, and currency provided, generate a complete invoice and AR management package including:
1. Professional formatted invoice (with invoice number, date, due date, line items, subtotal, tax, total)
2. Payment reminder schedule (7-day, 14-day, 30-day overdue notices)
3. AR aging report (current, 30/60/90+ days buckets)
4. Late fee policy (interest calculation, penalty structure)
5. Reconciliation notes (how to match payments, common discrepancies to watch for)
6. Professional email templates for follow-up

Format output as structured markdown.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.75,
    });
    const output = completion.choices[0]?.message?.content || "No output generated.";
    return NextResponse.json({ output });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
