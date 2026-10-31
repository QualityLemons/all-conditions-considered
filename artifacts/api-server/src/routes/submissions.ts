import { Router } from "express";
import { createHash } from "node:crypto";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { rateLimit } from "express-rate-limit";
import { CreateSubmissionBody, CreateSubmissionResponse } from "@workspace/api-zod";

const router = Router();
const connectors = new ReplitConnectors();
const receipts = new Map<string, { reference: string; digest: string; expires: number }>();
const pending = new Set<string>();
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
// Escape submitted Markdown to avoid embedded images, mentions and misleading links.
const plain = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([\\`*_{}\[\]()#+.!|~-])/g, "\\$1").replace(/@/g, "@\u200b");
const error = (message: string) => ({ error: message });
const unavailable = "The inbox is temporarily unavailable. Your message has not been confirmed. Please keep your details and try again.";

router.use("/submissions", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  const origin = req.get("origin");
  const allowed = new Set((process.env.SUBMISSIONS_ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean));
  if (process.env.NODE_ENV !== "production" && process.env.REPLIT_DEV_DOMAIN) allowed.add(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  if (origin && !allowed.has(origin)) {
    res.status(403).json(error("This website is not authorised to submit."));
    return;
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.vary("Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});

const ipLimit = rateLimit({
  windowMs: 15 * 60_000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false,
  message: error("Too many attempts. Please wait 15 minutes before trying again."),
});
const totalLimit = rateLimit({
  windowMs: 60 * 60_000, limit: 60, keyGenerator: () => "inbox",
  standardHeaders: false, legacyHeaders: false,
  message: error("The inbox is busy. Please try again in an hour."),
});
const emailLimit = rateLimit({
  windowMs: 15 * 60_000, limit: 3,
  keyGenerator: req => hash(String(req.body.email).trim().toLowerCase()),
  standardHeaders: false, legacyHeaders: false,
  message: error("Please wait 15 minutes before sending another enquiry."),
});

router.post("/submissions", ipLimit, totalLimit, (req, res, next) => {
  if (!req.is("application/json")) { res.status(415).json(error("Please submit using JSON.")); return; }
  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success || (parsed.success && (!parsed.data.name.trim() || parsed.data.website?.trim() || Object.keys(parsed.data.details || {}).length > 20))) {
    res.status(400).json(error("Please provide a name and valid email, and keep optional answers within the displayed limits."));
    return;
  }
  req.body = parsed.data;
  if (parsed.data.kind === "show" && Object.values(parsed.data.details || {}).some(value => (value.match(/\S+/gu)?.length ?? 0) > 300)) {
    res.status(400).json(error("Please shorten each show suggestion answer to 300 words or fewer."));
    return;
  }
  next();
}, emailLimit, async (req, res) => {
  const data = CreateSubmissionBody.parse(req.body);
  const details = Object.entries(data.details || {});
  if (details.some(([key]) => key.length > 100 || !/^[\p{L}\p{N} _?/-]+$/u.test(key))) {
    res.status(400).json(error("Invalid optional field name.")); return;
  }
  const repo = process.env.SUBMISSIONS_GITHUB_REPOSITORY;
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    res.status(503).json(error(unavailable)); return;
  }
  const digest = hash(JSON.stringify({ ...data, website: undefined }));
  const now = Date.now();
  for (const [key, receipt] of receipts) if (receipt.expires < now) receipts.delete(key);
  const previous = receipts.get(data.requestId);
  if (previous) {
    if (previous.digest !== digest) { res.status(409).json(error("The draft changed. Please submit it again as a new enquiry.")); return; }
    res.status(201).json({ reference: previous.reference }); return;
  }
  if (pending.has(data.requestId)) { res.status(409).json(error("Your previous attempt is still being processed. Please wait before retrying.")); return; }
  pending.add(data.requestId);
  try {
    // Always recheck privacy. Never deliver personal information to a public repo.
    const info = await connectors.proxy("github", `/repos/${repo}`, { method: "GET" });
    if (!info.ok) throw new Error("Repository unavailable");
    const repository = await info.json() as { private?: boolean; has_issues?: boolean };
    if (repository.private !== true || repository.has_issues !== true) throw new Error("Private inbox required");
    const kind = data.kind === "show" ? "Show suggestion" : "Advertising enquiry";
    const title = `[${kind}] ${data.requestId}`;
    // Recover a receipt after a process restart or a lost HTTP response.
    const recent = await connectors.proxy("github", `/repos/${repo}/issues?state=all&sort=created&direction=desc&per_page=100`, { method: "GET" });
    if (!recent.ok) throw new Error("Inbox lookup unavailable");
    const issues = await recent.json() as { title: string; number: number; body?: string }[];
    let issue = issues.find(item => item.title === title);
    if (issue && !issue.body?.includes(`<!-- submission-digest:${digest} -->`)) {
      res.status(409).json(error("This submission reference has already been used. Start a new enquiry.")); return;
    }
    if (!issue) {
      const body = `## ${kind}\n\nName: ${plain(data.name.trim())}\n\nEmail: ${plain(data.email.trim())}\n\n${details.filter(([, v]) => v.trim()).map(([k, v]) => `### ${plain(k)}\n\n${plain(v.trim())}`).join("\n\n")}\n\n---\nSubmitted via the All Conditions Considered website. Please treat contact details and personal stories as private.\n<!-- submission-digest:${digest} -->`;
      const response = await connectors.proxy("github", `/repos/${repo}/issues`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (response.status !== 201) throw new Error("GitHub did not confirm receipt");
      issue = await response.json() as { title: string; number: number };
    }
    if (!Number.isInteger(issue.number)) throw new Error("Invalid receipt");
    const receipt = CreateSubmissionResponse.parse({ reference: `ACC-${issue.number}` });
    receipts.set(data.requestId, { ...receipt, digest, expires: now + 24 * 60 * 60_000 });
    res.status(201).json(receipt);
  } catch {
    // Do not log request bodies, emails, connector credentials, or upstream payloads.
    req.log.warn("Private submission delivery was not confirmed");
    res.status(503).json(error(unavailable));
  } finally { pending.delete(data.requestId); }
});

export default router;
