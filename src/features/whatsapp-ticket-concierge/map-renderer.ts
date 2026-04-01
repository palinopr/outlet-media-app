export async function renderMapPng(svg: string): Promise<Uint8Array> {
  const sharpModule = await import("sharp");
  const sharp = sharpModule.default;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Uint8Array(png);
}
