const FormWrapper = ({
  children, px = '10', py = '10'
}) => {
  return (
    <div className="w-full">
      <div className={`px-${px} py-${py} grid grid-cols-12 gap-x-5 gap-y-[30px]`}>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
