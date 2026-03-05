"use client";

import type { Value } from "platejs";
import {
  BlockquotePlugin,
  BoldPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  HorizontalRulePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { LinkPlugin } from "@platejs/link/react";
import { usePlateEditor } from "platejs/react";

const DEFAULT_VALUE: Value = [
  { type: "p", children: [{ text: "" }] },
];

export function useCreateEditor(initialContent?: unknown) {
  const value = Array.isArray(initialContent) && initialContent.length > 0
    ? (initialContent as Value)
    : DEFAULT_VALUE;

  return usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      H1Plugin,
      H2Plugin,
      H3Plugin,
      BlockquotePlugin,
      HorizontalRulePlugin,
      LinkPlugin,
    ],
    value,
  });
}
