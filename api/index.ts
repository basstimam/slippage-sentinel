import type { VercelRequest, VercelResponse } from "@vercel/node";
import agent from "../src/agent";

// Initialize the agent app
const app = agent;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Convert Vercel request to standard Request object
    const url = new URL(
      req.url || "/",
      `https://${req.headers.host || "localhost"}`
    );

    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        const headerValue = Array.isArray(value) ? value.join(", ") : String(value);
        headers.set(key, headerValue);
      }
    });

    const request = new Request(url.toString(), {
      method: req.method || "GET",
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    });

    // Use the agent's fetch handler
    const response = await app.fetch(request);

    // Convert Response to Vercel response
    res.status(response.status);

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send response body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
