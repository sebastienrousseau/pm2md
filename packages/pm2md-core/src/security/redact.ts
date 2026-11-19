// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

const SENSITIVE_KEY_PATTERN =
  /^(authorization|proxy-authorization|x-api-key|api-key|apikey|x-auth-token|token|access_token|refresh_token|secret|password|passwd|client_secret|cookie|set-cookie)$/i;

const PLACEHOLDER_PATTERN = /^\{\{.+\}\}$/;

/**
 * Check whether a header or auth parameter key is sensitive.
 */
export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key.trim());
}

/**
 * Redact sensitive values unless they are template placeholders like `{{token}}`
 * or redaction is explicitly disabled.
 */
export function redactValue(
  key: string,
  value: string,
  redact = true,
  forceRedact = false
): { value: string; redacted: boolean } {
  if (!redact || !value) {
    return { value, redacted: false };
  }
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_PATTERN.test(trimmed)) {
    return { value, redacted: false };
  }
  if (forceRedact || isSensitiveKey(key)) {
    return { value: "[REDACTED]", redacted: true };
  }
  return { value, redacted: false };
}
