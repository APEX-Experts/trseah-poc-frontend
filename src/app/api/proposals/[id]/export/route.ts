import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const admin = searchParams.get("admin");
    const cookieStore = await cookies();
    // Launch local Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const puppeteerCookies = cookieStore.getAll().map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: "localhost", // Crucial for Puppeteer to attach them correctly locally
      path: "/",
    }));
    browser.setCookie(...puppeteerCookies);
    const page = await browser.newPage();

    const targetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/proposals/${id}/print${admin === "true" ? "/admin" : ""}`;

    // networkidle0 ensures all fonts, images, and Tailwind styles are fully loaded
    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Crucial for rendering background colors/Tailwind borders
      margin: { top: "0", right: "0", bottom: "0", left: "0" }, // Rely on component padding
    });

    await browser.close();

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="proposal-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
