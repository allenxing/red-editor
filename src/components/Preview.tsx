import { Copy, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';

interface PreviewProps {
  content: string;
}

const Preview = ({ content }: PreviewProps) => {
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'my-[0.35em]',
          },
        },
      }),
      TextStyle,
      FontFamily,
      Placeholder.configure({
        placeholder: '',
      }),
    ],
    content: content,
    editable: false,
    onCreate: ({ editor }) => {
      editor.commands.setContent(content);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[500px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleCopy = async () => {
    try {
      // 获取编辑器内容并处理换行
      const content = editor?.getJSON();
      if (content?.content) {
        // 从 JSON 内容中提取文本，保持原始换行格式
        const textContent = content.content
          .map(node => {
            // 如果是空段落，返回空字符串
            if (!node.content) return '';
            // 否则返回段落中的文本内容
            return node.content.map((n: any) => n.text).join('');
          })
          .join('\n'); // 使用单个换行符连接段落

        await navigator.clipboard.writeText(textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {copied ? (
            <CheckCheck className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copied ? '已复制' : '复制内容'}</span>
        </button>
      </div>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Preview;