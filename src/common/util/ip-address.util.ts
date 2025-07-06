import { Request } from 'express';

export function getClientIp(req: Request): string {
  // Check if the X-Forwarded-For header exists
  const forwarded = req.headers['x-forwarded-for'];

  // If it's an array of IP addresses, take the first one
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }

  // If it's a single string, split it and take the first IP address
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  // Fallback to the remoteAddress or socket.remoteAddress if not behind a proxy
  const ip = req.socket.remoteAddress || '';

  // Handle IPv6-mapped IPv4 addresses (e.g., ::ffff:192.168.1.1)
  if (ip.includes('::ffff:')) {
    return ip.split('::ffff:')[1]; // Return the IPv4 address
  }

  return ip;
}
