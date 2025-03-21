import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

export const SlashCommandKey = new PluginKey('slash-command');

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: true,
        startOfLine: false,
        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent(props.native)
            .run();
        },
        allow: () => true,
        trigger: /^[^/]?\/$/,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: SlashCommandKey,
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
}); 