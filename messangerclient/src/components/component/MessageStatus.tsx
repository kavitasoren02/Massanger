import { READ_STATUS } from "../../Service/enum/ReadStatus";
import type { MessageStatusProps } from "../../Service/interface";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";

const MessageStatus = ({ id, readStatus }: MessageStatusProps) => {
  if (!id) {
    return <MdOutlineWatchLater />;
  }
  if (readStatus === READ_STATUS.SINGLE_TICK) {
    return <IoCheckmark />;
  }
  if (readStatus === READ_STATUS.DOUBLE_TICK) {
    return <IoCheckmarkDone />;
  }
  return <IoCheckmarkDone className="text-blue-700" />;
};

export default MessageStatus;
