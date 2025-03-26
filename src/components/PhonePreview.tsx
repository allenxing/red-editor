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
          <span>{copied ? '已复制' : '复制到小红书'}</span>
        </button>
      </div>
          <div className="overflow-hidden">
                {/* <img 
                  src="/assets/natural-titanium.png"
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  alt="手机模型"
                /> */}
            <div className="preview-wrapper">
              <div className="preview-content">
                <div className="account-info">
                <img src="https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo31f47v7hjmi0g49vnnuinpagik4nq6po?imageView2/1/w/540/format/jpg" alt="" className="icon" />
                <span className="name">恩仔不睡觉</span>
                </div>
                <div className="content-wrapper">
                  <div className="image-wrapper">
                  <img src="https://sns-webpic-qc.xhscdn.com/202503261457/c43435534603052e482e6d5cf96da8dd/notes_pre_post/1040g3k831dn0pt90gsb049vnnuinpagijho4ae8!nd_dft_wlteh_webp_3" alt="" className="image" />
                  </div>
                  <div className="inner"> 
                    <div className="title"> test</div>
                    {/* <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div> */}
                      <EditorContent editor={editor}  className="content" />
                  </div>
                  <div className="comment">
                    <div className="time">
                      编辑于 2025-03-26 09:44 · 公开可见
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