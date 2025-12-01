import { Trash } from "lucide-react";
const Todo = () => {
  return (
    <div className="border-b flex items-center justify-between flex-wrap space-x-1 py-1 w-full">
      <div className="flex items-center justify-end w-full mb-2">
        <div className="px-2 py-2 rounded-lg bg-red-500 ">
          <Trash />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="completed"
          id="completed"
          className="w-6 h-6"
        />
        <p className="text-lg">
          Lorem ipsum dolor sit ame
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default Todo;
