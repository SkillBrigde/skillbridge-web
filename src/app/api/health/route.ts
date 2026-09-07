export async function GET() {
  return Response.json({
    service: "SkillBridge Web",
    status: "healthy",
    utc: new Date().toISOString(),
  });
}
