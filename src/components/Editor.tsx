import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Smile } from 'lucide-react';
import { useState } from 'react';
import EmojiPicker from './EmojiPicker';
import { SlashCommand } from '../extensions/slashCommand';
import tippy from 'tippy.js';
import { SuggestionProps } from '@tiptap/suggestion';
import { Instance as TippyInstance } from 'tippy.js';
import FontMenu from './FontMenu';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';

const Editor = ({ onUpdate }: { onUpdate: (content: string) => void }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        textStyle: true,
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Placeholder.configure({
        placeholder: 'Type / to add emoji',
      }),
      Image,
      SlashCommand.configure({
        suggestion: {
          render: () => {
            let component: ReactRenderer | null = null;
            let popup: TippyInstance | null = null;

            return {
              onStart: (props: SuggestionProps) => {
                component = new ReactRenderer(EmojiPicker, {
                  props: {
                    onEmojiSelect: (emoji: any) => {
                      props.command(emoji);
                      popup?.destroy();
                    }
                  },
                  editor: props.editor,
                });

                popup = tippy(document.body, {
                  getReferenceClientRect: () => {
                    const rect = props.clientRect?.();
                    if (rect) {
                      return {
                        x: rect.left,
                        y: rect.top,
                        width: rect.width,
                        height: rect.height,
                        left: rect.left,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        toJSON: () => rect
                      };
                    }
                    return {
                      x: 0,
                      y: 0,
                      width: 0,
                      height: 0,
                      left: 0,
                      top: 0,
                      right: 0, 
                      bottom: 0,
                      toJSON: () => null
                    };
                  },
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                }) as any;
              },
              onUpdate: (props: SuggestionProps) => {
                const rect = props.clientRect?.();
                if (rect) {
                  popup?.setProps({
                    getReferenceClientRect: () => ({
                      x: rect.left,
                      y: rect.top,
                      width: rect.width,
                      height: rect.height,
                      left: rect.left,
                      top: rect.top,
                      right: rect.right,
                      bottom: rect.bottom,
                      toJSON: () => rect
                    }),
                  });
                }
              },
              onKeyDown: (props: SuggestionProps) => {
                if (props.event.key === 'Escape') {
                  popup?.destroy();
                  return true;
                }
                return false;
              },
              onExit: () => {
                popup?.destroy();
                component?.destroy();
              },
            };
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
      handlePaste: (view, event) => {
        event.preventDefault();
        
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          const lines = text.split(/\r?\n/).filter((line, index, array) => {
            return index < array.length - 1 || line.trim() !== '';
          });
          
          const tr = view.state.tr;
          if (!view.state.selection.empty) {
            tr.deleteSelection();
          }

          lines.reverse().forEach((line, index) => {
            const paragraph = {
              type: 'paragraph',
              content: line.trim() ? [{
                type: 'text',
                text: line
              }] : undefined
            };
          

            const node = view.state.schema.nodeFromJSON(paragraph);
            if (node) {
              tr.insert(tr.selection.from, node);
            }
          });

          view.dispatch(tr);
        }
        
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  const onEmojiSelect = (emoji: any) => {
    editor?.commands.insertContent(emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative h-full">
      {editor && <FontMenu editor={editor} />}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button
            // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute z-10">
            <EmojiPicker onEmojiSelect={onEmojiSelect} />
          </div>
        )}
      </div>
      <div className="p-4">
        <EditorContent editor={editor} className="min-h-[500px]" />
      </div>
    </div>
  );
};

export default Editor;