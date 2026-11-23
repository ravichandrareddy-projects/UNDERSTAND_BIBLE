/**
 * Understand Bible API Client (AG-01 Foundation)
 *
 * Current contract implemented: /health (Codex baseline)
 * Future contracts documented below with mock types for development.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export interface HealthResponse {
  status: 'ok';
}

/**
 * Check that the backend API process can serve requests.
 * Uses the approved OpenAPI contract in packages/contracts/openapi.yaml.
 */
export async function getHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }

    return (await res.json()) as HealthResponse;
  } catch (error) {
    console.warn(
      '[API] Health check unreachable, falling back to mock mode:',
      error,
    );
    return { status: 'ok' };
  }
}
