export function nextRouteError(message: string, status: number) {
	return new Response(JSON.stringify({ error: status, message }), { status });
}
