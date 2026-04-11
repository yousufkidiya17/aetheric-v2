import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "flzFgPJCZ39V6SExEfwY72U7fAbOBH0V",
  MISTRAL_API_URL: "https://api.mistral.ai/v1/chat/completions",
  MISTRAL_MODEL: "mistral-large-latest",
};

function uuid() { return crypto.randomUUID().slice(0, 8).toUpperCase(); }

// ═══════════════════════════════════════════════════════════════════════════════
// MCP: FOOD (Mock Zomato/Swiggy)
// ═══════════════════════════════════════════════════════════════════════════════

const restaurants = [
  {
    id: "rest_001", name: "Tandoori Nights", cuisine: "North Indian", rating: 4.6,
    deliveryTime: "30-40 min", priceRange: "₹₹", distance: "1.2 km", isOpen: true,
    menu: [
      { id: "item_001", name: "Butter Chicken", price: 320, category: "Main Course", veg: false, popular: true },
      { id: "item_002", name: "Paneer Tikka Masala", price: 280, category: "Main Course", veg: true, popular: true },
      { id: "item_003", name: "Garlic Naan", price: 60, category: "Bread", veg: true, popular: true },
      { id: "item_004", name: "Dal Makhani", price: 220, category: "Main Course", veg: true, popular: false },
      { id: "item_005", name: "Chicken Biryani", price: 350, category: "Rice", veg: false, popular: true },
    ]
  },
  {
    id: "rest_002", name: "Pizza Paradise", cuisine: "Italian", rating: 4.3,
    deliveryTime: "25-35 min", priceRange: "₹₹₹", distance: "2.5 km", isOpen: true,
    menu: [
      { id: "item_010", name: "Margherita Pizza", price: 299, category: "Pizza", veg: true, popular: true },
      { id: "item_011", name: "Pepperoni Pizza", price: 449, category: "Pizza", veg: false, popular: true },
      { id: "item_013", name: "Pasta Alfredo", price: 329, category: "Pasta", veg: true, popular: true },
    ]
  },
];

function foodHandler(tool: string, params: any) {
  switch (tool) {
    case "search_restaurants": {
      let results = [...restaurants].filter(r => r.isOpen);
      if (params.cuisine) results = results.filter(r => r.cuisine.toLowerCase().includes(params.cuisine.toLowerCase()));
      if (params.query) {
        const q = params.query.toLowerCase();
        results = results.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
      }
      return { success: true, count: results.length, restaurants: results.map(({ menu, ...r }) => ({ ...r, popularItems: menu.filter(i => i.popular).map(i => i.name).slice(0, 3) })) };
    }
    case "get_menu": {
      const rest = restaurants.find(r => r.id === params.restaurantId);
      if (!rest) return { success: false, error: "Restaurant not found" };
      const grouped: Record<string, any[]> = {};
      rest.menu.forEach(item => { if (!grouped[item.category]) grouped[item.category] = []; grouped[item.category].push(item); });
      return { success: true, restaurant: rest.name, cuisine: rest.cuisine, menuByCategory: grouped };
    }
    case "place_order": {
      const rest = restaurants.find(r => r.id === params.restaurantId);
      if (!rest) return { success: false, error: "Restaurant not found" };
      const items = (params.items || []).map((oi: any) => {
        const mi = rest.menu.find(m => m.id === oi.itemId || m.name.toLowerCase() === oi.name?.toLowerCase());
        return mi ? { ...mi, quantity: oi.quantity || 1, subtotal: mi.price * (oi.quantity || 1) } : null;
      }).filter(Boolean);
      if (!items.length) return { success: false, error: "No valid items" };
      const orderId = `ORD_${uuid()}`;
      const total = items.reduce((s: number, i: any) => s + i.subtotal, 0);
      return { success: true, order: { orderId, restaurant: rest.name, items: items.map((i: any) => `${i.quantity}x ${i.name}`), grandTotal: `₹${total + 40 + Math.round(total * 0.05)}`, estimatedDelivery: rest.deliveryTime } };
    }
    case "get_recommendations": {
      const moodMap: Record<string, string[]> = { "hungry": ["Butter Chicken", "Margherita Pizza"], "craving": ["Pepperoni Pizza"] };
      const key = Object.keys(moodMap).find(k => (params.mood || "").toLowerCase().includes(k)) || "hungry";
      const recommended: any[] = [];
      restaurants.forEach(r => r.menu.forEach(item => { if (moodMap[key]?.includes(item.name)) recommended.push({ restaurant: r.name, item: item.name, price: `₹${item.price}`, deliveryTime: r.deliveryTime, rating: r.rating }); }));
      return { success: true, mood: params.mood || "hungry", recommendations: recommended };
    }
    default: return { success: false, error: `Unknown food tool: ${tool}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MCP: RIDES (Mock Ola/Uber)
// ═══════════════════════════════════════════════════════════════════════════════

const rideTypes = [
  { id: "mini", name: "Ola Mini", icon: "🚗", basePrice: 50, perKmRate: 10, perMinRate: 1.5, capacity: 4, eta: "3-5 min" },
  { id: "sedan", name: "Ola Sedan", icon: "🚙", basePrice: 80, perKmRate: 14, perMinRate: 2, capacity: 4, eta: "5-7 min" },
  { id: "auto", name: "Ola Auto", icon: "🛺", basePrice: 30, perKmRate: 8, perMinRate: 1, capacity: 3, eta: "2-4 min" },
];
const drivers = [{ id: "drv_001", name: "Rajesh", rating: 4.8, vehicle: "Swift (DL01)", photo: "👨‍✈️" }];

function ridesHandler(tool: string, params: any) {
  const calcDist = () => 10 + Math.random() * 5;
  const calcFare = (dist: number, typeId: string) => {
    const t = rideTypes.find(r => r.id === typeId) || rideTypes[0];
    const mins = (dist / 25) * 60;
    return { finalFare: Math.round(t.basePrice + dist * t.perKmRate + mins * t.perMinRate), estimatedTime: `${Math.round(mins)} min`, distance: `${dist.toFixed(1)} km` };
  };

  switch (tool) {
    case "estimate_ride": {
      const dist = calcDist();
      const estimates = rideTypes.map(t => {
        const f = calcFare(dist, t.id);
        return { rideType: t.name, icon: t.icon, fare: `₹${f.finalFare}`, eta: t.eta, distance: f.distance };
      });
      return { success: true, pickup: params.pickup, destination: params.destination, estimates };
    }
    case "book_ride": {
      const type = rideTypes.find(r => r.name.toLowerCase().includes((params.rideType || "mini").toLowerCase())) || rideTypes[0];
      const driver = drivers[0];
      const dist = calcDist();
      const fare = calcFare(dist, type.id);
      const rideId = `RIDE_${uuid()}`;
      return {
        success: true, message: `🚕 Ride booked! ${driver.name} is heading to your pickup.`,
        ride: { rideId, driver: driver.name, vehicle: driver.vehicle, otp: 1234, rideType: type.name, fare: `₹${fare.finalFare}`, eta: type.eta, pickup: params.pickup, destination: params.destination }
      };
    }
    case "get_ride_types": return { success: true, rideTypes };
    default: return { success: false, error: `Unknown rides tool: ${tool}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MCP: WORKERS (Mock Workers)
// ═══════════════════════════════════════════════════════════════════════════════

const mockWorkers = [
  { id: "wrk_001", name: "Ramesh Kumar", skills: ["electrician", "wiring"], rating: 4.7, experience: "5 years", hourlyRate: 350, verified: true, availability: true, photo: "⚡" },
  { id: "wrk_002", name: "Suresh Plumber", skills: ["plumber", "pipe fitting"], rating: 4.5, experience: "8 years", hourlyRate: 400, verified: true, availability: true, photo: "🔧" },
  { id: "wrk_003", name: "Arjun Carpenter", skills: ["carpenter", "furniture"], rating: 4.8, experience: "10 years", hourlyRate: 500, verified: true, availability: true, photo: "🪚" },
  { id: "wrk_004", name: "Priya Cleaner", skills: ["cleaner", "deep cleaning"], rating: 4.6, experience: "3 years", hourlyRate: 250, verified: false, availability: true, photo: "🧹" },
  { id: "wrk_005", name: "Vikram Driver", skills: ["driver", "delivery"], rating: 4.9, experience: "6 years", hourlyRate: 300, verified: true, availability: true, photo: "🚗" },
];

function workersHandler(tool: string, params: any) {
  switch (tool) {
    case "search_workers": {
      let workers = [...mockWorkers].filter(w => w.availability);
      if (params.skill) workers = workers.filter(w => w.skills.some(s => s.toLowerCase().includes(params.skill.toLowerCase())));
      if (params.query) {
        const q = params.query.toLowerCase();
        workers = workers.filter(w => w.name.toLowerCase().includes(q) || w.skills.some(s => s.toLowerCase().includes(q)));
      }
      return { success: true, count: workers.length, workers: workers.map(w => ({ id: w.id, name: w.name, skill: w.skills[0], photo: w.photo, rating: `⭐ ${w.rating}`, experience: w.experience, hourlyRate: `₹${w.hourlyRate}/hr`, verified: w.verified ? "✅ Verified" : "Unverified" })) };
    }
    case "book_worker": {
      const worker = mockWorkers.find(w => w.id === params.workerId);
      if (!worker) return { success: false, error: "Worker not found" };
      const bookingId = `BKG_${uuid()}`;
      return { success: true, message: `📋 Booking sent to ${worker.name}!`, booking: { bookingId, worker: worker.name, skill: worker.skills[0], rate: `₹${worker.hourlyRate}/hr`, status: "pending" } };
    }
    case "get_skills_list": {
      const skillsMap: Record<string, number> = {};
      mockWorkers.forEach(w => w.skills.forEach(s => { skillsMap[s] = (skillsMap[s] || 0) + (w.availability ? 1 : 0); }));
      return { success: true, skills: Object.entries(skillsMap).map(([skill, count]) => ({ skill, availableWorkers: count })) };
    }
    default: return { success: false, error: `Unknown workers tool: ${tool}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MCP ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

function callMCP(intent: string, tool: string, params: any) {
  switch (intent) {
    case "food": return foodHandler(tool, params);
    case "rides": return ridesHandler(tool, params);
    case "workers": return workersHandler(tool, params);
    default: return { success: false, error: `Unknown service: ${intent}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MISTRAL AI + CHAT PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

const conversations = new Map<string, { role: string; content: string }[]>();

const SYSTEM_PROMPT = `You are Aetheric, a premium AI assistant for an Indian service marketplace. You help users:
1. **Order Food** — Search restaurants, browse menus, place orders
2. **Book Rides** — Estimate fares, book cabs/autos/bikes
3. **Hire Workers** — Find electricians, plumbers, tutors, carpenters

LANGUAGE & STYLE RULES (VERY IMPORTANT):
- **Mirror the user's language exactly.** If they speak Hinglish (Hindi+English mix), reply in Hinglish. If pure Hindi, reply in Hindi. If English, reply in English. Match their exact tone, slang, and vibe.
- **Default/preferred language is Hinglish** — casual, friendly, desi style. Example: "Bhai, tere liye best restaurants dhundh raha hoon! 🍕"
- Use emojis naturally to keep it fun and engaging
- Be warm, friendly, and talk like a smart desi friend — not a corporate bot
- Use Indian Rupees (₹) for all prices
- Keep responses concise but helpful

RESPONSE FORMAT (always return valid JSON):
{
  "reply": "Your conversational response in the user's language style",
  "intent": "food" | "rides" | "workers" | "general" | "clarify",
  "action": { "tool": "the MCP tool to call", "params": { "key": "value" } },
  "suggestions": ["suggestion 1", "suggestion 2"]
}

TOOL MAPPING:
- Food: search_restaurants, get_menu, place_order, get_recommendations
- Rides: estimate_ride, book_ride, get_ride_types
- Workers: search_workers, book_worker, get_skills_list
`;

async function callMistral(messages: { role: string; content: string }[]) {
  const response = await fetch(CONFIG.MISTRAL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${CONFIG.MISTRAL_API_KEY}` },
    body: JSON.stringify({ model: CONFIG.MISTRAL_MODEL, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages], temperature: 0.7, max_tokens: 1024, response_format: { type: "json_object" } })
  });
  if (!response.ok) throw new Error(`Mistral API error: ${response.status}`);
  const data = await response.json() as any;
  try { return JSON.parse(data.choices[0]?.message?.content); }
  catch { return { reply: data.choices[0]?.message?.content, intent: "general", action: null, suggestions: [] }; }
}

function getFallbackResponse(message: string) {
  const msg = message.toLowerCase();
  if (msg.includes("food") || msg.includes("hungry") || msg.includes("bhook") || msg.includes("khana")) return { reply: "Bhai bhook lagi hai? 🍕 Bata kya khayega, abhi best restaurants dhundh ke deta hoon!", intent: "food", suggestions: ["Nearby restaurants dikhao", "Pizza manga do"] };
  if (msg.includes("ride") || msg.includes("cab") || msg.includes("gaadi") || msg.includes("auto")) return { reply: "Chal bhai, ride book karte hain! 🚕 Kahan jaana hai bata?", intent: "rides", suggestions: ["Airport jaana hai", "Auto book karo"] };
  if (msg.includes("plumber") || msg.includes("worker") || msg.includes("electrician") || msg.includes("kaam")) return { reply: "Sahi hai bhai! 🔧 Kaunsa kaam karwana hai? Plumber, electrician, carpenter — sab milega!", intent: "workers", suggestions: ["Plumber chahiye", "Electrician dhundho"] };
  return { reply: "Hey bhai! Main hoon Aetheric 🌟 Tera apna AI assistant! Food order karna ho, ride book karni ho, ya koi worker chahiye — bas bol de!", intent: "general", suggestions: ["Bhook lagi hai", "Ride book karo", "Plumber chahiye"] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER
// ═══════════════════════════════════════════════════════════════════════════════

async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = path.resolve(__dirname, "public");

  app.use(express.static(staticPath));
  app.use(express.json());

  // ━━━ Main Chat API ━━━
  app.post("/api/chat", async (req, res) => {
    const { message, sessionId: reqSessionId } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const sessionId = reqSessionId || crypto.randomUUID();
    if (!conversations.has(sessionId)) conversations.set(sessionId, []);
    const history = conversations.get(sessionId)!;
    history.push({ role: "user", content: message });

    const recentMessages = history.slice(-20);

    try {
      console.log(`\n[Chat] User: "${message}"`);
      const aiResponse = await callMistral(recentMessages);
      console.log(`[Chat] Intent: ${aiResponse.intent}, Tool: ${aiResponse.action?.tool || "none"}`);

      let mcpResult = null;
      let finalReply = aiResponse.reply;

      if (aiResponse.action?.tool && aiResponse.intent !== "general" && aiResponse.intent !== "clarify") {
        try {
          mcpResult = callMCP(aiResponse.intent, aiResponse.action.tool, aiResponse.action.params || {});
          console.log(`[Chat] MCP Result:`, JSON.stringify(mcpResult).slice(0, 200));

          const followUp = [...recentMessages, { role: "assistant", content: JSON.stringify(aiResponse) }, { role: "user", content: `Results: ${JSON.stringify(mcpResult)}. Friendly reply:` }];
          const enriched = await callMistral(followUp);
          finalReply = enriched.reply || finalReply;
        } catch (e: any) {
          console.error("[Chat] MCP call failed:", e.message);
          finalReply += `\n\n_(Note: ${aiResponse.intent} service unavailable right now.)_`;
        }
      }

      history.push({ role: "assistant", content: finalReply });

      res.json({ sessionId, reply: finalReply, intent: aiResponse.intent, mcpData: mcpResult, suggestions: aiResponse.suggestions || [], timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("[Chat] Error:", error.message);
      const fallback = getFallbackResponse(message);
      history.push({ role: "assistant", content: fallback.reply });
      res.json({ sessionId, ...fallback, timestamp: new Date().toISOString() });
    }
  });

  // ━━━ Worker Registration (In-Memory for MVP) ━━━
  app.post("/api/worker/register", (req, res) => {
    const { name, skills, experience, hourlyRate, phone, location } = req.body;
    if (!name || !skills || skills.length === 0) return res.status(400).json({ error: "Name and skills required" });
    const workerId = `wrk_custom_${uuid()}`;
    const newWorker = { id: workerId, name, skills, experience: experience || "Not specified", hourlyRate: hourlyRate || 0, phone: phone || "", location: location || "Not specified", rating: 0, verified: false, availability: true, photo: "👷" };
    mockWorkers.push(newWorker);
    res.json({ success: true, message: `Welcome to Aetheric, ${name}!`, worker: newWorker });
  });

  // ━━━ Health Check ━━━
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", workers: mockWorkers.length, restaurants: restaurants.length, timestamp: new Date().toISOString() });
  });

  // ━━━ SPA Fallback ━━━
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`\n${"═".repeat(56)}`);
    console.log(`  🌟 AETHERIC V2 — AI Service Marketplace`);
    console.log(`${"═".repeat(56)}`);
    console.log(`  📡 Server:      http://localhost:${port}`);
    console.log(`  🤖 Model:       ${CONFIG.MISTRAL_MODEL}`);
    console.log(`  🍕 Food MCP:    ${restaurants.length} restaurants`);
    console.log(`  🚗 Rides MCP:   ${rideTypes.length} ride types`);
    console.log(`  👷 Workers MCP: ${mockWorkers.length} workers`);
    console.log(`${"─".repeat(56)}`);
  });
}

startServer().catch(console.error);
