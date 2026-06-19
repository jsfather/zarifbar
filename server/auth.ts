import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthUser {
  id: number;
  username: string;
  role: 'admin' | 'writer';
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'zarifbar-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isPasswordHashed(value: string): boolean {
  return value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$');
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    return payload;
  } catch {
    return null;
  }
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (token) {
    const user = verifyToken(token);
    if (user) req.user = user;
  }
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'ورود به سیستم الزامی است.' });
  }
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'نشست منقضی شده. لطفاً دوباره وارد شوید.' });
  }
  req.user = user;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'ورود به سیستم الزامی است.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'دسترسی مدیر کل مورد نیاز است.' });
  }
  next();
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_LOGIN_ATTEMPTS) return false;
  record.count += 1;
  return true;
}

export function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export function toPublicUser(user: AuthUser): AuthUser {
  return { id: user.id, username: user.username, role: user.role, name: user.name };
}
