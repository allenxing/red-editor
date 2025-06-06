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

const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  // 月份从0开始，需加1并补零
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // 小时和分钟补零
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const Preview = ({ content }: PreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(new Date());

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
      setTime(new Date()); // 更新时间为当前时间
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
            if (!node.content) return ' ';
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
          <span>{copied ? '已复制' : '复制到小红书'}</span>
        </button>
      </div>
      <div className="phone">
        <div className="preview-wrapper">
          <div className="preview-content">
            <div className="account-info">
            <img src="https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31f47v7hjmi0g49vnnuinpagik4nq6po?imageView2/1/w/540/format/jpg" alt="" className="icon" />
            <span className="name">马里奥秒</span>
            </div>
            <div className="content-wrapper">
              <div className="image-wrapper">
              <img src="assets/example.jpeg" alt="" className="image" />
              </div>
              <div className="inner"> 
                <div className="title">Plog|新人博主来报道</div>
                  <EditorContent editor={editor}  className="content" />
              </div>
              <div className="comment">
                <div className="time">
                  编辑于 {formatDateTime(time)} · 公开可见
                </div>
                  <img data-v-0e7feff9="" src="https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31f47v7hjmi0g49vnnuinpagik4nq6po?imageView2/1/w/540/format/jpg" alt="" className="avatar" />
                  <img  src="https://fe-static.xhscdn.com/formula-static/ugc/public/resource/image/comment.7a7ef26b.png" alt="" className="comment-bg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;