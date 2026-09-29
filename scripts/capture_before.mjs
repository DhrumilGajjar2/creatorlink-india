import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const TARGET_DIRS = [
  path.resolve("..", "docs", "ui-overhaul", "screenshots", "before"),
  path.resolve("docs", "ui-overhaul", "screenshots", "before"),
];

TARGET_DIRS.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function main() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const baseURL = "http://localhost:3000";

  console.log("1. Setting up demo creator account and test data...");
  const context = await browser.newContext();
  const page = await context.newPage();

  // Register demo creator if not exists
  const regRes = await page.request.post(`${baseURL}/api/auth/register`, {
    data: {
      email: "aarav@creatorlink.in",
      password: "Password123!",
      name: "Aarav Mehta",
      handle: "aarav",
      bio: "Tech reviewer & minimalist creator from Bengaluru. Honest gear recommendations ⚡",
    },
  });
  console.log("Register response status:", regRes.status());

  // Log in to get session cookie
  const loginRes = await page.request.post(`${baseURL}/api/auth/login`, {
    data: {
      email: "aarav@creatorlink.in",
      password: "Password123!",
    },
  });
  console.log("Login response status:", loginRes.status());

  // Extract cookies from response
  const cookies = await context.cookies();
  console.log("Cookies count:", cookies.length);

  // Add sample links
  await page.request.post(`${baseURL}/api/links`, {
    data: {
      title: "Sony WH-1000XM5 Wireless Headphones",
      originalUrl: "https://www.amazon.in/dp/B09XS7JWHH",
      price: 29990,
      network: "amazon",
    },
  });

  await page.request.post(`${baseURL}/api/links`, {
    data: {
      title: "Keychron K2 Wireless Mechanical Keyboard",
      originalUrl: "https://keychron.in/product/keychron-k2",
      price: 7499,
      network: "other",
    },
  });

  await page.request.post(`${baseURL}/api/links`, {
    data: {
      title: "Minimalist Felt Desk Mat - Charcoal",
      originalUrl: "https://www.flipkart.com/desk-mat",
      price: 1299,
      network: "flipkart",
    },
  });

  // Add sample products
  const p1Res = await page.request.post(`${baseURL}/api/products`, {
    data: {
      title: "Ultimate Desk & Workspace Notion Template",
      price: 499,
      deliveryType: "digital",
      description: "Complete productivity workspace for creators & engineers.",
    },
  });
  const p1Data = await p1Res.json();
  const productId = p1Data.product?.id || "demo-product-1";

  await page.request.post(`${baseURL}/api/products`, {
    data: {
      title: "1-on-1 Creator Strategy Consultation",
      price: 1999,
      deliveryType: "booking",
      description: "45-minute live consultation on monetization and equipment.",
    },
  });

  // Update creator settings with sample affiliate IDs
  await page.request.patch(`${baseURL}/api/creator/settings`, {
    data: {
      name: "Aarav Mehta",
      bio: "Tech reviewer & minimalist creator from Bengaluru. Honest gear recommendations ⚡",
      languages: ["en", "hi", "gu"],
      affiliateIds: {
        amazon: "aarav-21",
        flipkart: "aaravtech",
        myntra: "aarav_m",
      },
    },
  });

  await context.close();

  // List of pages to capture
  const PAGES = [
    { id: "landing", path: "/", auth: false },
    { id: "login", path: "/login", auth: false },
    { id: "register", path: "/register", auth: false },
    { id: "creator-profile", path: "/aarav", auth: false },
    { id: "product-buy", path: `/aarav/buy/${productId}`, auth: false },
    { id: "dashboard-links", path: "/dashboard", auth: true },
    { id: "dashboard-analytics", path: "/dashboard/analytics", auth: true },
    { id: "dashboard-products", path: "/dashboard/products", auth: true },
    { id: "dashboard-settings", path: "/dashboard/settings", auth: true },
  ];

  console.log("2. Capturing screenshots across viewports...");

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

    for (const p of PAGES) {
      const pageContext = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2, // HiDPI / retina for crisp Apple-level review
      });

      if (p.auth && cookies.length > 0) {
        await pageContext.addCookies(cookies);
      }

      const activePage = await pageContext.newPage();
      const targetUrl = `${baseURL}${p.path}`;

      try {
        await activePage.goto(targetUrl, { waitUntil: "networkidle", timeout: 15000 });
        await activePage.waitForTimeout(1000); // Allow any CSS animations/hydration to settle

        const filename = `${p.id}-${vp.name}.png`;

        for (const outDir of TARGET_DIRS) {
          const filePath = path.join(outDir, filename);
          await activePage.screenshot({
            path: filePath,
            fullPage: p.id === "landing" || p.id === "creator-profile" ? false : false, // viewport screenshot
          });
        }

        console.log(`Saved: ${filename}`);
      } catch (err) {
        console.error(`Failed to capture ${p.id} at ${vp.name}:`, err.message);
      } finally {
        await pageContext.close();
      }
    }
  }

  await browser.close();
  console.log("\nAll BEFORE screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
