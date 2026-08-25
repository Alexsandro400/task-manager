export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'task-manager',
    timestamp: new Date().toISOString(),
  })
}
