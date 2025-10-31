export async function detectCustomerName(
  prompt: string,
  retries = 2
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('https://vaani-nu.vercel.app/api/name-detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return (data.name || '').trim();
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      console.error('Request timeout');
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        return detectCustomerName(prompt, retries - 1);
      }
    }

    throw err;
  }
}

export async function parseItemsWithAI(prompt: string, retries = 2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('https://vaani-nu.vercel.app/api/parse-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      console.error('Request timeout');
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        return parseItemsWithAI(prompt, retries - 1);
      }
    }

    throw err;
  }
}