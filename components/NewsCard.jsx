import { TestBlog } from "@constants/constants";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NewsCard = ({ article }) => {
  return (
    <div>
      <Link href={`/news/${article.slug}`}>
        <div className="rounded-md border-[1.7px] border-light">
          <div className="rounded-md relative h-[150px]">
            <Image
              src={`/assets/images/img2.png`}
              className="rounded-tl-md rounded-tr-md object-cover"
              fill
              alt=""
            />
          </div>

          <div className="p-2">
            <p className="text-lg font-bold">{article?.title}</p>
            <p className="text-sm font-bold">
              {moment(article?.createdAt).fromNow()}
            </p>

            <div className="py-[0.3rem] overflow-clip">
              <div
                className="__truncate"
                dangerouslySetInnerHTML={{
                  __html: article.article,
                }}
              ></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
