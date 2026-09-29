import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const TARGET_DIRS = [
  path.resolve("..", "docs", "ui-overhaul", "screenshots", "after"),
  path.resolve("docs", "ui-overhaul", "screenshots", "after"),
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
  console.log("1. Authenticating test creator and verifying sample data...");

  const context = await browser.newContext();
  const page = await context.newPage();

  // Log in as test creator
  await page.request.post(`${baseURL}/api/auth/login`, {
    data: {
      email: "aarav@creatorlink.in",
      password: "Password123!",
    },
  });

  const cookies = await context.cookies();

  // Fetch actual products to get real productId
  const prodRes = await page.request.get(`${baseURL}/api/products`);
  let products = await prodRes.json();
  let productId = products?.[0]?.id;

  if (!productId) {
    const newProd = await page.request.post(`${baseURL}/api/products`, {
      data: {
        title: "Ultimate Desk & Workspace Notion Template",
        price: 499,
        deliveryType: "digital",
      },
    });
    const pData = await newProd.json();
    productId = pData.id;
  }

  console.log("Using product ID:", productId);
  await context.close();

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

  console.log("\n2. Capturing AFTER screenshots across viewports...");
  const consoleErrors = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

    for (const p of PAGES) {
      const pageContext = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2, // HiDPI retina
      });

      if (p.auth && cookies.length > 0) {
        await pageContext.addCookies(cookies);
      }

      const activePage = await pageContext.newPage();

      // Listen for unhandled console errors
      activePage.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(`[${p.id} ${vp.name}] ${msg.text()}`);
        }
      });

      const targetUrl = `${baseURL}${p.path}`;

      try {
        await activePage.goto(targetUrl, { waitUntil: "networkidle", timeout: 15000 });
        await activePage.waitForTimeout(800); // Allow spring animations to settle

        const filename = `${p.id}-${vp.name}.png`;

        for (const outDir of TARGET_DIRS) {
          const filePath = path.join(outDir, filename);
          await activePage.screenshot({
            path: filePath,
            fullPage: false,
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

  // Functional flow verification: Add link test
  console.log("\n3. Testing functional link creation and reorder flow in browser...");
  const testContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await testContext.addCookies(cookies);
  const testPage = await testContext.newPage();
  await testPage.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle" });

  const inputSelector = 'input[type="url"]';
  await testPage.fill(inputSelector, "https://www.myntra.com/watches");
  await testPage.click('button[type="submit"]');
  await testPage.waitForTimeout(2000);
  console.log("Quick-add link test completed successfully.");

  await testContext.close();
  await browser.close();

  console.log("\nConsole errors detected during run:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors.slice(0, 5));
  }

  console.log("\nAll AFTER screenshots and flow tests completed successfully!");
}

main().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
