import { guessClientSlug } from "@/lib/client-slug";

describe("guessClientSlug", () => {
  it("maps arjona to zamora", () => {
    expect(guessClientSlug("Arjona Sacramento V2")).toBe("zamora");
  });
  it("maps alofoke to zamora", () => {
    expect(guessClientSlug("Alofoke Tour")).toBe("zamora");
  });
  it("maps camila to zamora", () => {
    expect(guessClientSlug("Camila Anaheim")).toBe("zamora");
  });
  it("maps kybba", () => {
    expect(guessClientSlug("KYBBA Miami")).toBe("kybba");
  });
  it("maps beamina", () => {
    expect(guessClientSlug("Beamina Spring")).toBe("beamina");
  });
  it("maps happy paws with space", () => {
    expect(guessClientSlug("Happy Paws Rescue")).toBe("happy_paws");
  });
  it("maps happy_paws with underscore", () => {
    expect(guessClientSlug("happy_paws campaign")).toBe("happy_paws");
  });
  it("returns unknown for unrecognized", () => {
    expect(guessClientSlug("Some Random Campaign")).toBe("unknown");
  });
  it("handles empty string", () => {
    expect(guessClientSlug("")).toBe("unknown");
  });
});
