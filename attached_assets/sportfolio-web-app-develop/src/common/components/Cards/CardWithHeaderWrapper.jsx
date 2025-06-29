export const CardWithHeaderWrapper = ({
  id = "",
  title = "",
  containerClassName = "",
  headerClassName = "",
  headerSection,
  children
}) => {
  return (
    <article
      className={`grid grid-cols-1 rounded-lg box p-5 mt-6 first:mt-0 ${containerClassName}`}
      id={id}
    >
      {title && (
        <header
          className={`flex justify-between border-b pb-2 mb-5 items-center ${headerClassName}`}
        >
          {title}
          {headerSection}
        </header>
      )}

      {children}
    </article>
  );
};
