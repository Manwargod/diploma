import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import admin from 'firebase-admin';

const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const NODE_ENV = process.env.NODE_ENV || 'development';

const ensureProductionConfig = (condition, message) => {
  if (NODE_ENV === 'production' && !condition) {
    const error = new Error(message);
    error.status = 500;
    throw error;
  }
};

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const SERVICE_CENTER_INDEX = {
  'astana-esil': {
    id: 'astana-esil',
    name: 'ServicePro Есіл',
    address: 'пр. Достык 5, ЖК "Северное Сияние"',
    city: 'Astana',
    lat: 51.1159,
    lng: 71.4296
  },
  'astana-baikonur': {
    id: 'astana-baikonur',
    name: 'ServicePro Байконур',
    address: 'ул. Сарайшык 7, ТЦ "Хан Шатыр"',
    city: 'Astana',
    lat: 51.1298,
    lng: 71.4222
  },
  'astana-almaty': {
    id: 'astana-almaty',
    name: 'ServicePro Алматы районы',
    address: 'ул. Кенесары 46',
    city: 'Astana',
    lat: 51.1695,
    lng: 71.4301
  },
  'astana-nura': {
    id: 'astana-nura',
    name: 'ServicePro Нура',
    address: 'пр. Республики 22, БЦ "Нурлы Тау"',
    city: 'Astana',
    lat: 51.1537,
    lng: 71.4281
  },
  'astana-saryarka': {
    id: 'astana-saryarka',
    name: 'ServicePro Сарыарка',
    address: 'ул. Бейбітшілік 18',
    city: 'Astana',
    lat: 51.1709,
    lng: 71.4186
  }
};

const adapter = new JSONFile(new URL('./db.json', import.meta.url));
const db = new Low(adapter, {
  users: [],
  otps: [],
  orders: [],
  builds: [],
  repairs: [],
  warranties: [],
  products: [],
  centerInventory: [],
  supportThreads: []
});

const initDb = async () => {
  await db.read();
  db.data = {
    users: [],
    otps: [],
    orders: [],
    builds: [],
    repairs: [],
    warranties: [],
    products: [],
    centerInventory: [],
    supportThreads: [],
    ...(db.data || {})
  };
  if (!db.data.repairs.length) {
    db.data.repairs = [
      {
        id: 'SP-EX-1001',
        type: 'repair',
        status: 'in_repair',
        timeline: [
          { status: 'received', label: 'Received', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), media: [] },
          { status: 'diagnosed', label: 'Diagnostics complete', timestamp: new Date(Date.now() - 86400000).toISOString(), media: [] },
          { status: 'in_repair', label: 'Repair in progress', timestamp: new Date().toISOString(), media: [] }
        ],
        clientId: 'guest',
        clientName: 'Demo Client',
        clientPhone: '+77001234567',
        address: 'Almaty, Abay 12',
        device: 'smartphone',
        issue: 'Screen flicker and battery drain',
        serviceCenter: { id: 'almaty', name: 'Almaty Center', address: 'MegaCenter' },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'SP-EX-1002',
        type: 'repair',
        status: 'delivered',
        timeline: [
          { status: 'received', label: 'Received', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), media: [] },
          { status: 'diagnosed', label: 'Diagnostics complete', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), media: [] },
          { status: 'quality_check', label: 'Quality check passed', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), media: [] },
          { status: 'delivered', label: 'Delivered', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), media: [] }
        ],
        clientId: 'guest',
        clientName: 'Demo Client 2',
        clientPhone: '+77007654321',
        address: 'Astana, Turkestan 24',
        device: 'laptop',
        issue: 'Overheating and fan noise',
        serviceCenter: { id: 'astana', name: 'Astana Center', address: 'Keruen' },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ];
  }
  if (!db.data.orders.length) {
    db.data.orders = [
      {
        orderId: 'ORD-DEMO-1001',
        clientId: 'guest',
        serviceCenterId: 'astana-esil',
        status: 'confirmed',
        total: 520000,
        items: [
          { id: 1, name: 'iPhone 15 Pro Max', price: 450000, quantity: 1 },
          { id: 8, name: 'Corsair Vengeance DDR5 64GB', price: 70000, quantity: 1 }
        ],
        delivery: { city: 'Almaty', address: 'Abay 12', deliveryMethod: 'courier' },
        payment: { method: 'kaspi_qr' },
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        orderId: 'ORD-DEMO-1002',
        clientId: 'guest',
        serviceCenterId: 'astana-baikonur',
        status: 'processing',
        total: 980000,
        items: [
          { id: 2, name: 'MacBook Pro M3 14"', price: 980000, quantity: 1 }
        ],
        delivery: { city: 'Astana', address: 'Dostyk 9', deliveryMethod: 'pickup' },
        payment: { method: 'bank_card' },
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];
  }
  if (!db.data.products.length) {
    db.data.products = [];
  }
  if (!db.data.centerInventory) {
    db.data.centerInventory = [];
  }
  if (!db.data.supportThreads) {
    db.data.supportThreads = [];
  }
  await db.write();
};

const isFiniteNumber = (value) => Number.isFinite(Number(value));

const normalizeInventoryRow = ({ centerId, productId, quantity, price, isAvailable }) => ({
  service_center_id: centerId,
  product_id: String(productId),
  quantity: Math.max(0, Number(quantity) || 0),
  price: Number(price) || 0,
  is_available: Boolean(isAvailable),
  updated_at: new Date().toISOString()
});

const isMarketActive = (row) => Boolean(row?.is_available && Number(row?.quantity) > 0 && Number(row?.price) > 0);

const getTelegramConfig = () => ({
  token: process.env.TELEGRAM_BOT_TOKEN,
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
  webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || ''
});

const threadMarker = (threadId) => `[support:${threadId}]`;

const appendSupportMessage = async (threadId, message) => {
  await db.read();
  const now = new Date().toISOString();
  const existing = db.data.supportThreads.find((thread) => thread.threadId === threadId);
  if (!existing) {
    db.data.supportThreads.unshift({ threadId, messages: [message], updatedAt: now });
  } else {
    existing.messages.push(message);
    existing.updatedAt = now;
  }
  await db.write();
};

const sendTelegramSupportMessage = async (threadId, message, senderName) => {
  const { token, adminChatId } = getTelegramConfig();
  if (!token || !adminChatId) return null;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: adminChatId,
      text: `${threadMarker(threadId)}\n${senderName || 'User'}: ${message}`,
      disable_web_page_preview: true
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'TELEGRAM_SEND_FAILED');
  }
  return response.json();
};

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : null);

const createSession = (user) => ({
  user: {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    name: user.name,
    centerId: user.centerId || null
  },
  accessToken: `access-${crypto.randomUUID()}`,
  refreshToken: `refresh-${crypto.randomUUID()}`,
  createdAt: new Date().toISOString()
});

const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    ensureProductionConfig(process.env.FIREBASE_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS, 'Firebase Admin is not configured');
    if (process.env.FIREBASE_PROJECT_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
  }
  return admin.apps.length ? admin.auth() : null;
};

const sendOtpSms = async (phone, otp) => {
  ensureProductionConfig(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE, 'SMS provider not configured');
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[OTP][DEV] ${phone}: ${otp}`);
    return;
  }

  const twilio = (await import('twilio')).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    to: phone,
    from: process.env.TWILIO_FROM_PHONE,
    body: `Your ServicePro code is ${otp}`
  });
};

app.post('/auth/register', async (req, res, next) => {
  try {
    const { email, password, phone, role, name, centerId } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    await db.read();
    const normalized = normalizeEmail(email);
    if (db.data.users.find((u) => u.email === normalized)) {
      return res.status(409).json({ message: 'EMAIL_EXISTS' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: `user-${Date.now()}`,
      email: normalized,
      phone: phone || null,
      role: role || 'client',
      name: name || 'ServicePro User',
      centerId: role === 'provider' ? centerId || null : null,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    await db.read();
    const normalized = normalizeEmail(email);
    const user = db.data.users.find((u) => u.email === normalized);
    if (!user) return res.status(401).json({ message: 'INVALID_CREDENTIALS' });
    const match = await bcrypt.compare(password, user.passwordHash || '');
    if (!match) return res.status(401).json({ message: 'INVALID_CREDENTIALS' });
    res.json(createSession(user));
  } catch (error) {
    next(error);
  }
});

app.post('/auth/otp', async (req, res, next) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ message: 'Phone required' });
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpHash = await bcrypt.hash(otp, 10);
    await db.read();
    db.data.otps = db.data.otps.filter((entry) => entry.phone !== phone);
    db.data.otps.push({ phone, otpHash, expiresAt: Date.now() + 5 * 60 * 1000 });
    await db.write();
    await sendOtpSms(phone, otp);
    res.status(202).json({ sent: true });
  } catch (error) {
    next(error);
  }
});

app.post('/auth/otp/verify', async (req, res, next) => {
  try {
    const { phone, otp, role, centerId } = req.body || {};
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' });
    await db.read();
    const record = db.data.otps.find((entry) => entry.phone === phone);
    if (!record || record.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'INVALID_OTP' });
    }
    const match = await bcrypt.compare(otp, record.otpHash);
    if (!match) return res.status(401).json({ message: 'INVALID_OTP' });

    let user = db.data.users.find((u) => u.phone === phone);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email: null,
        phone,
        role: role || 'client',
        name: 'ServicePro User',
        centerId: role === 'provider' ? centerId || null : null,
        createdAt: new Date().toISOString()
      };
      db.data.users.push(user);
      await db.write();
    }

    db.data.otps = db.data.otps.filter((entry) => entry.phone !== phone);
    await db.write();
    res.json(createSession(user));
  } catch (error) {
    next(error);
  }
});

app.post('/auth/google', async (req, res, next) => {
  try {
    const { idToken, role, centerId } = req.body || {};
    if (!idToken) return res.status(400).json({ message: 'ID token required' });
    const auth = getFirebaseAdmin();
    ensureProductionConfig(auth, 'Firebase Admin is not configured');

    const decoded = await auth.verifyIdToken(idToken);
    const email = normalizeEmail(decoded.email);
    await db.read();

    let user = db.data.users.find((u) => u.providerId === decoded.uid || (email && u.email === email));
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email: email || null,
        phone: decoded.phone_number || null,
        role: role || 'client',
        name: decoded.name || 'Google User',
        centerId: role === 'provider' ? centerId || null : null,
        provider: 'google',
        providerId: decoded.uid,
        createdAt: new Date().toISOString()
      };
      db.data.users.push(user);
      await db.write();
    }

    res.json(createSession(user));
  } catch (error) {
    next(error);
  }
});

app.post('/orders', async (req, res, next) => {
  try {
    const order = req.body || {};
    await db.read();
    const saved = {
      orderId: order.orderId || `ORD-${Date.now()}`,
      ...order,
      serviceCenterId: order.serviceCenterId || order.service_center_id || null,
      status: order.status || 'confirmed',
      createdAt: order.createdAt || new Date().toISOString()
    };
    db.data.orders.unshift(saved);

    if (saved.serviceCenterId && Array.isArray(saved.items)) {
      saved.items.forEach((item) => {
        const target = db.data.centerInventory.find(
          (row) => row.service_center_id === saved.serviceCenterId && String(row.product_id) === String(item.id)
        );
        if (!target) return;
        const nextQty = Math.max(0, Number(target.quantity || 0) - Math.max(1, Number(item.quantity) || 1));
        target.quantity = nextQty;
        target.updated_at = new Date().toISOString();
        if (nextQty <= 0) {
          target.is_available = false;
        }
      });
    }

    await db.write();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

app.get('/orders', async (req, res, next) => {
  try {
    const { clientId, centerId } = req.query;
    await db.read();
    let orders = db.data.orders;
    if (clientId) {
      orders = orders.filter((o) => o.clientId === clientId);
    }
    if (centerId) {
      orders = orders.filter((o) => o.serviceCenterId === centerId || o.service_center_id === centerId);
    }
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.patch('/orders/:id/cancel', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.read();
    const order = db.data.orders.find((o) => o.orderId === id);
    if (!order) return res.status(404).json({ message: 'NOT_FOUND' });
    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    await db.write();
    res.json(order);
  } catch (error) {
    next(error);
  }
});

app.post('/builds', async (req, res, next) => {
  try {
    const build = req.body || {};
    await db.read();
    const saved = {
      id: build.id || `BUILD-${Date.now()}`,
      ...build,
      status: build.status || 'pending',
      createdAt: build.createdAt || new Date().toISOString()
    };
    db.data.builds.unshift(saved);
    await db.write();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

app.get('/builds', async (req, res, next) => {
  try {
    const { clientId } = req.query;
    await db.read();
    const builds = clientId ? db.data.builds.filter((b) => b.clientId === clientId) : db.data.builds;
    res.json(builds);
  } catch (error) {
    next(error);
  }
});

app.post('/repairs', async (req, res, next) => {
  try {
    const payload = req.body || {};
    const newRequest = {
      id: `SP-${Date.now()}`,
      type: 'repair',
      status: 'received',
      timeline: [
        { status: 'received', label: 'Received', timestamp: new Date().toISOString(), media: [] }
      ],
      ...payload,
      createdAt: new Date().toISOString()
    };
    await db.read();
    db.data.repairs.unshift(newRequest);
    await db.write();
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
});

app.get('/repairs', async (req, res, next) => {
  try {
    const { clientId, centerId } = req.query;
    await db.read();
    let repairs = db.data.repairs;
    if (clientId) repairs = repairs.filter((r) => r.clientId === clientId);
    if (centerId) repairs = repairs.filter((r) => r.serviceCenter?.id === centerId);
    res.json(repairs);
  } catch (error) {
    next(error);
  }
});

app.patch('/repairs/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, label } = req.body || {};
    await db.read();
    const repair = db.data.repairs.find((r) => r.id === id);
    if (!repair) return res.status(404).json({ message: 'NOT_FOUND' });
    repair.status = status;
    repair.timeline = [
      ...repair.timeline,
      { status, label, timestamp: new Date().toISOString(), media: [] }
    ];
    await db.write();
    res.json(repair);
  } catch (error) {
    next(error);
  }
});

app.post('/repairs/:id/media', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stageStatus, mediaItems } = req.body || {};
    await db.read();
    const repair = db.data.repairs.find((r) => r.id === id);
    if (!repair) return res.status(404).json({ message: 'NOT_FOUND' });
    repair.timeline = repair.timeline.map((step) => {
      if (step.status !== stageStatus) return step;
      return { ...step, media: [...(step.media || []), ...(mediaItems || [])] };
    });
    await db.write();
    res.json(repair);
  } catch (error) {
    next(error);
  }
});

app.post('/warranties', async (req, res, next) => {
  try {
    const warranty = req.body || {};
    await db.read();
    db.data.warranties.unshift(warranty);
    await db.write();
    res.status(201).json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.patch('/providers/center', async (req, res, next) => {
  try {
    const { userId, centerId } = req.body || {};
    if (!userId || !centerId) return res.status(400).json({ message: 'Missing userId or centerId' });
    await db.read();
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ message: 'NOT_FOUND' });
    user.centerId = centerId;
    await db.write();
    res.json(createSession(user));
  } catch (error) {
    next(error);
  }
});

app.get('/warranties', async (req, res, next) => {
  try {
    await db.read();
    res.json(db.data.warranties);
  } catch (error) {
    next(error);
  }
});

app.get('/products', async (_req, res, next) => {
  try {
    await db.read();
    res.json(db.data.products || []);
  } catch (error) {
    next(error);
  }
});

app.get('/center-inventory', async (req, res, next) => {
  try {
    const { centerId } = req.query;
    await db.read();
    let rows = db.data.centerInventory || [];
    if (centerId) {
      rows = rows.filter((row) => row.service_center_id === centerId);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.put('/center-inventory/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { centerId, quantity, price, isAvailable } = req.body || {};
    if (!centerId) return res.status(400).json({ message: 'centerId required' });
    if (!isFiniteNumber(quantity)) return res.status(400).json({ message: 'quantity must be a number' });
    if (!isFiniteNumber(price)) return res.status(400).json({ message: 'price must be a number' });

    await db.read();
    const normalized = normalizeInventoryRow({ centerId, productId, quantity, price, isAvailable });
    const idx = db.data.centerInventory.findIndex(
      (row) => row.service_center_id === centerId && String(row.product_id) === String(productId)
    );

    if (idx >= 0) {
      db.data.centerInventory[idx] = normalized;
    } else {
      db.data.centerInventory.push(normalized);
    }

    await db.write();
    res.json(normalized);
  } catch (error) {
    next(error);
  }
});

app.get('/center-inventory/market', async (req, res, next) => {
  try {
    const { productId } = req.query;
    await db.read();
    let rows = (db.data.centerInventory || []).filter(isMarketActive);
    if (productId !== undefined) {
      rows = rows.filter((row) => String(row.product_id) === String(productId));
    }

    const response = rows.map((row) => ({
      ...row,
      serviceCenter: SERVICE_CENTER_INDEX[row.service_center_id] || { id: row.service_center_id, name: row.service_center_id }
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/products', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.name || !payload.price || !payload.category) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const product = {
      id: Date.now(),
      rating: 4.7,
      reviews: [],
      features: payload.features || [],
      extendedSpecs: payload.extendedSpecs || {},
      ...payload
    };
    await db.read();
    db.data.products.unshift(product);
    await db.write();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

app.delete('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.read();
    const before = db.data.products.length;
    db.data.products = db.data.products.filter((product) => String(product.id) !== String(id));
    db.data.centerInventory = (db.data.centerInventory || []).filter((row) => String(row.product_id) !== String(id));
    const removed = before - db.data.products.length;
    await db.write();
    if (!removed) return res.status(404).json({ message: 'NOT_FOUND' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/support/messages', async (req, res, next) => {
  try {
    const { threadId } = req.query;
    await db.read();
    const thread = db.data.supportThreads.find((entry) => entry.threadId === threadId);
    res.json(thread?.messages || []);
  } catch (error) {
    next(error);
  }
});

app.post('/support/messages', async (req, res, next) => {
  try {
    const { threadId, message, senderName } = req.body || {};
    if (!threadId || !message) return res.status(400).json({ message: 'Missing threadId or message' });
    const payload = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      senderName: senderName || 'User',
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    await appendSupportMessage(threadId, payload);
    await sendTelegramSupportMessage(threadId, message, senderName);
    res.status(201).json({ saved: true, threadId, message: payload });
  } catch (error) {
    next(error);
  }
});

app.post('/support/telegram/webhook', async (req, res, next) => {
  try {
    const { webhookSecret } = getTelegramConfig();
    if (webhookSecret && req.header('x-telegram-bot-api-secret-token') !== webhookSecret) {
      return res.status(401).json({ message: 'UNAUTHORIZED' });
    }

    const update = req.body || {};
    const message = update.message || update.channel_post || null;
    if (!message?.text) {
      return res.json({ ok: true });
    }

    const replySource = message.reply_to_message?.text || '';
    const markerMatch = replySource.match(/\[support:([\w-]+)\]/i) || message.text.match(/\[support:([\w-]+)\]/i);
    const threadId = markerMatch?.[1];
    if (!threadId) {
      return res.json({ ok: true });
    }

    await appendSupportMessage(threadId, {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: message.text.replace(/\[support:[\w-]+\]\s*/i, '').trim(),
      senderName: message.from?.first_name || 'Support',
      createdAt: new Date().toISOString(),
      status: 'received'
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message || 'SERVER_ERROR' });
});

await initDb();
app.listen(PORT, () => {
  console.log(`[API] running on http://localhost:${PORT}`);
});
