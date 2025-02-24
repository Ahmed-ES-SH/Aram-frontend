import { useState } from "react";
import { FaVolumeUp, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";
import Img from "../../Img";
import { MdOutlineCancel } from "react-icons/md";
import { BiError } from "react-icons/bi";

// مكون لعرض الملف المختار
export default function FilePreview({
  file,
  setFile,
  language,
}: {
  file: File | null;
  setFile: any;
  language: string;
}) {
  const [showPreview, setShowPreview] = useState<boolean>(true);
  console.log(file);

  const renderFilePreview = () => {
    if (file) {
      if (file.type.split("/")[0] === "audio") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full   bg-white p-4 rounded-lg z-[99] shadow-md flex flex-col items-center "
          >
            <FaVolumeUp size={40} className="text-blue-500 mb-4" />
            <audio controls className="w-full">
              <source src={URL.createObjectURL(file)} type={file.type} />
              Your browser does not support the audio element.
            </audio>
            <p className="mt-2 text-sm text-gray-500">{file.name}</p>
          </motion.div>
        );
      } else if (file.type.split("/")[0] === "image") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-white z-[99] p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <FaImage size={40} className="text-green-500 mb-4" />
            <Img
              src={URL.createObjectURL(file)}
              className="w-[50px] object-cover rounded-md"
            />
            <p className="mt-2 text-sm text-gray-500">{file.name}</p>
          </motion.div>
        );
      }
    }
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <BiError className="size-10 text-red-300" />
        <p>
          {" "}
          {language == "EN"
            ? "You can choose just an image or audio file to send."
            : "يمكنك اختيار صورة او ملف صوتى فقط لإرسالة."}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md absolute min-h-[200px] bottom-[175px] left-2 bg-white py-6  z-[99] mx-auto mt-6 px-4 border border-gray-300 rounded-lg shadow-lg"
    >
      {file && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold">Selected File</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className="text-blue-500 hover:text-blue-700"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </motion.button>
          </div>

          {showPreview && renderFilePreview()}
        </>
      )}

      <div
        onClick={() => setFile(null)}
        className="h-7 w-7 absolute bottom-2 right-2 flex items-center justify-center text-white bg-red-400 rounded-full hover:bg-red-500 cursor-pointer duration-200"
      >
        <MdOutlineCancel className="size-5" />
      </div>
    </motion.div>
  );
}
