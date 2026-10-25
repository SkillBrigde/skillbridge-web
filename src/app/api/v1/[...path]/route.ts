import { NextRequest } from "next/server";
import { executeBackendRequest, buildProxiedResponse } from "@/lib/server/backend-api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handle(req: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const search = req.nextUrl.search;
  const subPath = `${path.join("/")}${search}`;

  const method = req.method;
  const body = ["GET", "HEAD"].includes(method.toUpperCase())
    ? null
    : await req.arrayBuffer();

  const backendRes = await executeBackendRequest(
    subPath,
    method,
    req.headers,
    body,
  );

  return buildProxiedResponse(backendRes);
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}
