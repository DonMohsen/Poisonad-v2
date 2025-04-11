// import { NextRequest, NextResponse } from "next/server";
// import https from "https";

// const agent = new https.Agent({
//   rejectUnauthorized: false, // 🛑 bypass cert check
// });

// export async function GET(req: NextRequest) {
//   const token = req.nextUrl.searchParams.get("token");
//   const session = req.nextUrl.searchParams.get("session");

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };

//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   if (session) headers["Cookie"] = `JSESSIONID=${session}`;

//   try {
//     const res = await fetch("https://saba.nus.ac.ir/rest/users/me", {
//       method: "GET",
//       headers,
//       // 👇 Trust self-signed certs
//       agent,
//     });

//     const text = await res.text();
//     if (!res.ok) {
//       return NextResponse.json({ error: res.statusText, body: text }, { status: res.status });
//     }

//     const json = JSON.parse(text);
//     return NextResponse.json(json);
//   } catch (error: any) {
//     console.error("🔥 Proxy error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
