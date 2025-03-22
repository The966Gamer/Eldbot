import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";

puppeteer.use(StealthPlugin());

async function startAternos() {
    console.log("🚀 Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log("🌍 Opening Aternos...");
    await page.goto("https://aternos.org/go/", { waitUntil: "networkidle2" });

    // Load cookies if available
    if (fs.existsSync("cookies.json")) {
        console.log("🍪 Loading saved cookies...");
        const cookies = JSON.parse(fs.readFileSync("cookies.json"));
        await page.setCookie(...cookies);
        await page.reload({ waitUntil: "networkidle2" });
    } else {
        console.log("⚠ No cookies found! Please run save_cookies.js first.");
        await browser.close();
        return;
    }

    // Wait for the server list to load
    console.log("⏳ Waiting for server list...");
    await page.waitForSelector(".server-body", { timeout: 30000 });

    // Click the server
    console.log("🖱 Clicking on your server...");
    await page.click(".server-body");

    // Wait for the start button and click it
    console.log("⏳ Waiting for start button...");
    await page.waitForSelector(".btn-main", { timeout: 30000 });

    console.log("✅ Starting server...");
    await page.click(".btn-main");

    console.log("🎉 Server started!");

    await browser.close();
}

startAternos();
