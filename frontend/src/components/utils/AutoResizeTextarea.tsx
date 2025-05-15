import React, { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (newValue: string) => void;
}

const AutoResizeTextarea: React.FC<Props> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInput}
      className="my-1 rounded px-2 py-1 w-full resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden leading-relaxed break-words"
      placeholder="Nhập nội dung chào mừng..."
      rows={1}
    />
  );
};

export default AutoResizeTextarea;
