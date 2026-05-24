export function isValidMetaEntityId(value) {
  return typeof value === "string" && /^\d{12,30}$/.test(value);
}

export function metaAdIdFromCfc(purchase) {
  return isValidMetaEntityId(purchase?.utm_content) ? purchase.utm_content : null;
}
