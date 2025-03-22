import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";

puppeteer.use(StealthPlugin());

async function startAternos() {
    console.log("🚀 Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();

    console.log("🌍 Opening Aternos...");
    await page.goto("https://aternos.org/go/", { waitUntil: "networkidle2", timeout: 60000 });

    // Load cookies if available
    if (fs.existsSync("cookies.json")) {
        const cookies = JSON.parse(fs.readFileSync("cookies.json"));
        await page.setCookie(...cookies);
        console.log("✅ Loaded saved cookies.");
        await page.reload({ waitUntil: "networkidle2" });
    }

    // Wait for login button (if needed)
    try {
        await page.waitForSelector("#user", { timeout: 5000 });
        console.log("🔑 Logging in...");
        await page.type("#user", "YOUR_USERNAME");
        await page.type("#password", "YOUR_PASSWORD");
        await page.click("#login-button");
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        console.log("✅ Logged in successfully!");
    } catch (error) {
        console.log("⚠️ Already logged in or login skipped.");
    }

    // Wait for server list
    console.log("🖱 Waiting for server to appear...");
    await page.waitForSelector(".server-body", { timeout: 15000 });

    // Click the first server in the list
    console.log("✅ Clicking on the server...");
    const servers = await page.$$(".server-body");
    if (servers.length > 0) {
        await servers[0].click();
    } else {
        console.log("❌ No servers found!");
        await browser.close();
        return;
    }

    // Wait and click start button
    console.log("🚀 Starting the server...");
    await page.waitForSelector("#start", { timeout: 10000 });
    await page.click("#start");

    console.log("✅ Server start clicked! Waiting...");
    await page.waitForTimeout(10000);
    
    await browser.close();
}

startAternos().catch((err) => console.error("❌ ERROR:", err));
