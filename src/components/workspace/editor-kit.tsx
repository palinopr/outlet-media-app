"use client";

import type { Value } from "platejs";
import { KEYS } from "platejs";
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
import { IndentPlugin } from "@platejs/indent/react";
import { ListPlugin } from "@platejs/list/react";
import { AutoformatPlugin } from "@platejs/autoformat";
import { toggleList } from "@platejs/list";
import { MentionPlugin, MentionInputPlugin } from "@platejs/mention/react";
import { MarkdownPlugin } from "@platejs/markdown";
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
  BlockList,
} from "./editor/block-elements";
import { SlashInputElement } from "./editor/slash-menu";
import { MentionElement } from "./editor/mention-element";
import { MentionInputElement } from "./editor/mention-input-element";
import { LinkElement } from "./editor/link-element";

const LIST_TARGET_PLUGINS = [
  ...KEYS.heading,
  KEYS.p,
  KEYS.blockquote,
  KEYS.codeBlock,
];

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
      LinkPlugin.withComponent(LinkElement),
      MentionPlugin.configure({
        options: {
          trigger: "@",
          triggerPreviousCharPattern: /^$|^[\s"']$/,
        },
      }).withComponent(MentionElement),
      MentionInputPlugin.withComponent(MentionInputElement),
      // Indent + Lists
      IndentPlugin.configure({
        inject: {
          targetPlugins: LIST_TARGET_PLUGINS,
        },
      }),
      ListPlugin.configure({
        inject: {
          targetPlugins: LIST_TARGET_PLUGINS,
        },
        render: {
          belowNodes: BlockList,
        },
      }),
      // Autoformat
      AutoformatPlugin.configure({
        options: {
          rules: [
            {
              match: "- ",
              mode: "block" as const,
              type: "list",
              format: (editor: unknown) => {
                toggleList(editor as Parameters<typeof toggleList>[0], {
                  listStyleType: KEYS.ul,
                });
              },
            },
            {
              match: "* ",
              mode: "block" as const,
              type: "list",
              format: (editor: unknown) => {
                toggleList(editor as Parameters<typeof toggleList>[0], {
                  listStyleType: KEYS.ul,
                });
              },
            },
            {
              match: [String.raw`^\d+\.$ `, String.raw`^\d+\)$ `],
              matchByRegex: true,
              mode: "block" as const,
              type: "list",
              format: (editor: unknown) => {
                toggleList(editor as Parameters<typeof toggleList>[0], {
                  listStyleType: KEYS.ol,
                });
              },
            },
            {
              match: ["[] ", "[ ] "],
              mode: "block" as const,
              type: "list",
              format: (editor: unknown) => {
                toggleList(editor as Parameters<typeof toggleList>[0], {
                  listStyleType: KEYS.listTodo,
                });
              },
            },
          ],
        },
      }),
      // Markdown paste
      MarkdownPlugin,
      // Slash commands
      SlashPlugin,
      SlashInputPlugin.withComponent(SlashInputElement),
    ],
    value,
  });
}
