export function forceJsonStringify(object: any): string {
  if (!object) {
    return '{}';
  }

  try {
    return JSON.stringify(object);
  } catch {
    return JSON.stringify({ rawData: object });
  }
}
