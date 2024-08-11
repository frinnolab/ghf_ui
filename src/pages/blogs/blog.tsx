import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Blog } from "../dashboard/blog/dash-blogs";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Image } from "@nextui-org/react";
import { GoArrowUpRight } from "react-icons/go";

export default function BlogPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);

  const toDetail = (b: Blog) => {
    navigate(`/blog/${b?.blogId}`, {
      state: `${b?.blogId}`,
    });
  };

  useEffect(() => {
    if (blogs === null) {
      axios
        .get(`${api}/blogs`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          
          console.log(res.data);

          const datas: Blog[] = Array.from(res?.data).flatMap((b: any) => {
            const data: Blog = {
              blogId: `${b.blogId}`,
              authorId: `${b.authorId}`,
              title: `${b.title}`,
              description: `${b.description}`,
              thumbnailUrl: `${b.thumbnailUrl ?? ''}`,
            };
            return [data];
          });

          console.log(datas);
          

          setBlogs(datas);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [blogs]);
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-[50vh]">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Blogs</h1>
        </div>

        <div className="w-full flex flex-col px-20 gap-5 ">
          <h1 className=" text-3xl  font-semibold ">Blog News</h1>

          {/* Blog Content */}

          <div className="w-full flex flex-col gap-5">
            {blogs?.length === 0 ? (
              <>
                <h1 className=" text-2xl ">No Blogs at the momment!.</h1>
              </>
            ) : (
              <div className="w-full flex flex-wrap justify-between gap-5 ">
                {blogs?.flatMap((b: Blog, i) => (
                  <div key={i}  className="w-[30%] flex flex-col justify-between border rounded-2xl ">
                    <div className="w-full">
                      <Image
                        isZoomed
                        className="w-screen h-[30vh] object-cover"
                        src={`${b?.thumbnailUrl !== ''  ? b?.thumbnailUrl :  "assets/logos/GHFLOGO.jpg"}`}
                      />
                    </div>
                    <div className="p-5">
                      <h1 className="text-3xl font-semibold">{b?.title}</h1>

                      <p>{b?.description}</p>
                    </div>

                    <div className="p-1">
                      <Button
                        variant="light"
                        color="primary"
                        className="flex items-center"
                        onClick={() => {
                          toDetail(b);
                        }}
                      >
                        Read more <GoArrowUpRight size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
