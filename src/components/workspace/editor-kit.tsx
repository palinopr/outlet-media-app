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
import { CodeBlockPlugin } from "@platejs/code-block/react";
import { LinkPlugin } from "@platejs/link/react";
import { ListPlugin } from "@platejs/list/react";
import { SlashPlugin, SlashInputPlugin } from "@platejs/slash-command/react";
import { ParagraphPlugin, usePlateEditor } from "platejs/react";
import {
  H1Element,
  H2Element,
  H3Element,
  BlockquoteElement,
  HrElement,
  ParagraphElement,
  CodeBlockElement,
} from "./editor/block-elements";
import { SlashInputElement } from "./editor/slash-menu";

const DEFAULT_VALUE: Value = [
  { type: "p", children: [{ text: "" }] },
];

export function useCreateEditor(initialContent?: unknown) {
  const value = Array.isArray(initialContent) && initialContent.length > 0
    ? (initialContent as Value)
    : DEFAULT_VALUE;

  return usePlateEditor({
    plugins: [
      // Marks
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      // Block elements with custom components
      ParagraphPlugin.withComponent(ParagraphElement),
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
      HorizontalRulePlugin.withComponent(HrElement),
      CodeBlockPlugin.withComponent(CodeBlockElement),
      // Inline elements
      LinkPlugin,
      // Lists
      ListPlugin,
      // Slash commands
      SlashPlugin,
      SlashInputPlugin.withComponent(SlashInputElement),
    ],
    value,
  });
}
