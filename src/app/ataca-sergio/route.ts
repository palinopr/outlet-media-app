export function GET(request: Request) {
  return Response.redirect(new URL("/ataca-sergio/newark", request.url), 308);
}
