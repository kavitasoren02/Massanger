import type { EmojiPickerProps } from "../../Service/interface";
import Picker from "emoji-picker-react";

const EmojiPickers = ({ isOpen, onEmojiClick }: EmojiPickerProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute
        bottom-[60px]
        left-0
        z-[9999]
      "
    >
      <Picker
        width={320}
        height={350}
        onEmojiClick={onEmojiClick}
      />
    </div>
  );
};

export default EmojiPickers;