import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Image, Spinner, Tab, Tabs } from "@nextui-org/react";
import { GoArrowUpRight } from "react-icons/go";

import { Blog } from "../dashboard/blog/dash-blogs";

// import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";

export default function BlogPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [archivedBlogs, setArchivedBlogs] = useState<Blog[]>([]);

  const [isLoading, setIsloading] = useState<boolean>(false);

  const toDetail = (b: Blog) => {
    navigate(`/blog/${b?.blogId}`, {
      state: `${b?.blogId}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (blogs === null) {
      setIsloading(true);
      axios
        .get(`${api}/blogs`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          const datas: Blog[] = Array.from(res?.data).flatMap((b: any) => {
            const data: Blog = {
              blogId: b?.blogId,
              authorId: b?.authorId,
              title: b?.title ?? "",
              description: b?.description ?? "",
              thumbnailUrl: b?.thumbnailUrl ?? "",
              isArchived: Boolean(b?.isArchived ?? false),
            };

            return [data];
          });

          setBlogs(datas);

          setArchivedBlogs(datas.filter((d) => d?.isArchived === true));

          setIsloading(false);
        })
        .catch((err: AxiosError) => {
          console.error(err.response);
        });
    }
  }, [blogs]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-2 md:py-5">
        <div className="h-[20dvh] md:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="hidden text-primary md:flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">BLOG</h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[5%] md:top-[-20%] filter saturate-[90%]">
            <Image
              alt="Blogs Bg"
              className=" object-fill "
              radius="none"
              src="assets/images/static/Blogs_BG.jpg"
              width={3000}
            />
          </div>
        </div>

        {/* <div
          hidden
          className="inline-block max-w-lg text-center justify-center"
        >
          <h1 className={title()}>Blogs</h1>
        </div> */}

        <div className="w-full flex flex-col p-5 md:p-10 gap-5 z-10 bg-default-200">
          <h1 className=" text-xl md:text-2xl  font-semibold ">Blog News</h1>

          {/* Blog Content */}

          <div className="w-full flex flex-col justify-center gap-5">
            {isLoading ? (
              <div className="w-full flex justify-center">
                <Spinner
                  className=" flex justify-center "
                  color="primary"
                  label="Loading..."
                  size="lg"
                />
              </div>
            ) : (
              <>
                {blogs?.length === 0 ? (
                  <>
                    <h1 className=" text-2xl text-center ">
                      {/* No Blogs at the momment!. Please check back soon */}
                    </h1>
                  </>
                ) : (
                  <div className="w-full flex flex-wrap gap-5 md:gap-10">
                    <Tabs
                      fullWidth
                      aria-label="Options"
                      color="primary"
                      radius="sm"
                      size="lg"
                    >
                      <Tab key="blogs" title="Blogs">
                        <div className="w-full flex justify-start gap-5 md:gap-10 flex-wrap">
                          {blogs?.flatMap((b: Blog) => (
                            <div
                              key={b?.blogId}
                              className="md:w-[30%] flex flex-col justify-between bg-default-100 rounded-2xl "
                            >
                              <div className="w-full">
                                <Image
                                  className="w-screen h-[30vh] object-cover"
                                  src={
                                    b?.thumbnailUrl !== "" || null
                                      ? b?.thumbnailUrl
                                      : siteConfig?.staticAssets?.staticLogo
                                  }
                                />
                              </div>
                              <div className="p-5">
                                <h1 className="text-2xl truncate font-semibold">
                                  {b?.title}
                                </h1>

                                {/* <p>{b?.description}</p> */}
                              </div>

                              <div className="p-1">
                                <Button
                                  className="flex items-center border border-primary-400 hover:border-transparent"
                                  color="primary"
                                  variant="light"
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
                      </Tab>

                      <Tab key="blogsArchived" title="Archives">
                        <div className="w-full flex justify-start gap-5 md:gap-10 flex-wrap">
                          {archivedBlogs?.flatMap((b: Blog) => (
                            <div
                              key={b?.blogId}
                              className="md:w-[30%] flex flex-col justify-between bg-default-100 rounded-2xl "
                            >
                              <div className="w-full">
                                <Image
                                  className="w-screen h-[30vh] object-cover"
                                  src={
                                    b?.thumbnailUrl !== "" || null
                                      ? b?.thumbnailUrl
                                      : siteConfig?.staticAssets?.staticLogo
                                  }
                                />
                              </div>
                              <div className="p-5">
                                <h1 className="text-2xl truncate font-semibold">
                                  {b?.title}
                                </h1>

                                {/* <p>{b?.description}</p> */}
                              </div>

                              <div className="p-1">
                                <Button
                                  className="flex items-center border border-primary-400 hover:border-transparent"
                                  color="primary"
                                  variant="light"
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
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
