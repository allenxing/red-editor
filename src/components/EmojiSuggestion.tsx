import { ReactNode, forwardRef, useState } from 'react';

interface EmojiSuggestionProps {
  items: Array<{
    emoji: string;
    name: string;
  }>;
  command: (props: { emoji: string }) => void;
}

export const EmojiSuggestion = forwardRef<HTMLDivElement, EmojiSuggestionProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
      <div 
        className="bg-white rounded-lg shadow-lg p-2 max-h-[300px] overflow-y-auto"
        ref={ref}
      >
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center space-x-2 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              key={index}
              onClick={() => props.command({ emoji: item.emoji })}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm text-gray-600">{item.name}</span>
            </button>
          ))
        ) : (
          <div className="px-2 py-1 text-sm text-gray-500">
            No results found
          </div>
        )}
      </div>
    );
  }
);

EmojiSuggestion.displayName = 'EmojiSuggestion'; 