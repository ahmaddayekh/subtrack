const SUPPORT_EMAIL = "adayekh45@gmail.com";

export function buildSupportMailto(email?: string | null, plan?: string | null) {
  const tag = plan === "pro" ? " (Pro)" : plan === "free" ? " (Free)" : "";
  const bodyLines = ["Describe your issue here:", ""];
  if (email) bodyLines.unshift(`Account email: ${email}`, "");

  const subject = encodeURIComponent(`SubTrack support${tag}`);
  const body = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
