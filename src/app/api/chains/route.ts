import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://stargate.finance/api/v1/chains", {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chains");
    }

    const data = await response.json();
    return NextResponse.json({ chains: data.chains || [] });
  } catch (error) {
    console.error("Error fetching chains:", error);
    return NextResponse.json(
      { error: "Failed to fetch chains" },
      { status: 500 }
    );
  }
}
