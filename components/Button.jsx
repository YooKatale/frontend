import { Button } from "./ui/button";

const ButtonComponent = ({ text, type, size, icon, onClick }) => {
  return (
    <>
      <Button
        type={type}
        className={
          size == "regular"
            ? "text-white bg-green-600 hover:bg-green-700 text-base gap-2 rounded-md border-[1.7px] border-green-600 px-4 py-2 font-medium"
            : size == "lg"
            ? "text-white bg-green-600 hover:bg-green-700 gap-2 rounded-md border-[1.7px] border-green-600 text-lg p-4 font-medium"
            : "text-white bg-green-600 hover:bg-green-700 text-base gap-2 rounded-md border-[1.7px] border-green-600 px-4 py-2 font-medium"
        }
        onClick={onClick}
      >
        {icon && icon}
        {text}
      </Button>
    </>
  );
};

export default ButtonComponent;
