import parse from "html-react-parser";

const RichLabel = ({ value = "", style = { lineHeight: "30px" } }) => {
  return (
    <div className="rich-label" style={style}>
      {parse(value)}
    </div>
  );
};

export default RichLabel;
