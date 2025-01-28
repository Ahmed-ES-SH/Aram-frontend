import { useState } from "react";
import { FaVolumeUp, FaImage } from "react-icons/fa";
import { motion } from "framer-motion";
import Img from "../../Img";

// مكون لعرض الملف المختار
const FilePreview = ({ file }: { file: File | null }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const renderFilePreview = () => {
    if (file) {
      if (file.type.split("/")[0] === "audio") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full   bg-white p-4 rounded-lg shadow-md flex flex-col items-center "
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
            className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <FaImage size={40} className="text-green-500 mb-4" />
            <Img
              src={URL.createObjectURL(file)}
              className="w-[200px] object-cover rounded-md"
            />
            <p className="mt-2 text-sm text-gray-500">{file.name}</p>
          </motion.div>
        );
      }
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md absolute -top-[120px] mx-auto mt-6 p-4 border border-gray-300 rounded-lg shadow-lg"
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
    </motion.div>
  );
};

export default FilePreview;
