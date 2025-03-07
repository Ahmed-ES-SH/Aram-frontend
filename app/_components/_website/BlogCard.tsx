import React from "react";
import Img from "../Img";
import Link from "next/link";
import { format } from "date-fns";
const BlogCard = ({ image, avatar, author, date, title, description }: any) => {
  const formattedDate = format(new Date(date), "PPpp");
  return (
    <Link className="group relative block  focus:outline-none" href="/blog/4">
      {/* Image Section with Gradient Overlay */}
      <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
        <Img
          className="size-full absolute top-0 start-0 object-cover"
          src={image}
        />
      </div>

      {/* Avatar Section */}
      <div className="absolute top-0 inset-x-0 z-10">
        <div className="p-4 flex flex-col h-full sm:p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <Img
                className="size-[46px] border-2 border-white rounded-full"
                src={avatar}
              />
            </div>
            <div className="ms-2.5 sm:ms-4 flex items-start flex-col">
              <h4 className="font-semibold text-white">{author}</h4>
              <p className="text-xs text-white/80">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Title and Description Section */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <div className="flex flex-col h-full p-4 sm:p-6">
          <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
            {title}
          </h3>
          <p className="mt-2 text-white/80">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
