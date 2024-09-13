import DefaultLayout from "@/layouts/default";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, Textarea } from "@nextui-org/input";

type sabbyType = {
  title?: string;
  description?: string;
};

const SabbyPage = () => {
  //const [sab, setSab] = useState<sabbyType | null>(null);
  const { register, handleSubmit } = useForm<sabbyType>();


  const onFormSubmit: SubmitHandler<sabbyType> = (data: sabbyType) => {
    console.log(data);
  };

  return (
    <DefaultLayout>
      <section className="w-full">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="p-20 flex flex-col gap-5"
        >
          <div>
            <label htmlFor="title">Title</label>
            <Input
              type="text"
              {...register("title")}
              placeholder={"Enter Title"}
            />
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <Textarea
              type="text"
              {...register("description")}
              placeholder={"Enter description"}
            />


          </div>
          <div>
            <Input type="submit" label="Save" />
          </div>
        </form>
      </section>
    </DefaultLayout>
  );
};

export default SabbyPage;
