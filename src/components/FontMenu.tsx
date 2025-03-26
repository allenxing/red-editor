import { BubbleMenu, Editor } from '@tiptap/react';
import { specialCharMap } from '../utils/specialFonts';

const FontMenu = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  // 将特殊字符转换回普通字符
  const toNormalChar = (char: string): string => {
    for (const styleData of Object.values(specialCharMap)) {
      const entries = Object.entries(styleData.map);
      const found = entries.find(([_, special]) => special === char);
      if (found) {
        return found[0];
      }
    }
    return char;
  };

  // 将文本转换为普通文本
  const toNormalText = (text: string): string => {
    // 使用扩展字符集分割字符串
    const chars = Array.from(text);
    return chars.map(toNormalChar).join('');
  };

  // 将文本转换为特定样式
  const toStyleText = (text: string, style: keyof typeof specialCharMap): string => {
    const map = specialCharMap[style].map;
    const chars = Array.from(text);
    return chars.map(char => map[char] || char).join('');
  };

  const applySpecialStyle = (style: keyof typeof specialCharMap) => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    
    const normalText = toNormalText(text);
    const styledText = toStyleText(normalText, style);
    
    editor.chain().focus().deleteRange({ from, to }).insertContent(styledText).run();
  };

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      className="flex flex-wrap bg-white rounded-lg shadow-lg p-1 gap-1  border border-gray-200 justify-between"
    >
      {Object.entries(specialCharMap).map(([style, { name }]) => (
        <button
          key={style}
          onClick={() => applySpecialStyle(style as keyof typeof specialCharMap)}
          className="px-2 py-1 text-xs rounded-md hover:bg-gray-100 transition-colors
            flex items-center justify-center min-w-[60px]
            border border-gray-100 hover:border-gray-200"
        >
          <span className="font-medium">{name}</span>
        </button>
      ))}
    </BubbleMenu>
  );
};

export default FontMenu; 