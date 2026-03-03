import { describe, it, expect } from "vitest";
import { ContactFormSchema } from "@/lib/api-schemas";

describe("ContactFormSchema", () => {
  it("accepts valid submission", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I'd like a demo.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = ContactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "",
    });
    expect(result.success).toBe(false);
  });
});
