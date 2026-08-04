import type { EmojiPickerProps } from "../../Service/interface";
import Picker from "emoji-picker-react";

const EmojiPickers = ({ isOpen, onEmojiClick }: EmojiPickerProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        absolute
        bottom-16
        right-0
        z-50
        w-[95vw]
        max-w-[340px]
        sm:w-[320px]
        md:w-[340px]
      "
    >
      <Picker
        width="100%"
        height={350}
        onEmojiClick={onEmojiClick}
      />
    </div>
  );
};

export default EmojiPickers;