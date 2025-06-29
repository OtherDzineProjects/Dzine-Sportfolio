import { colors } from "utils/colors";
import "./style.css";
const Badge = ({ text = "Badge", variant = "success", round = false }) => {
  const handleVariant = () => {
    switch (variant) {
      case "success":
        return (
          <div
            style={{
              background: "rgba(0, 167, 111, 0.08)",
              color: "rgb(0, 167, 111)"
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );
      case "warning":
        return (
          <div
            style={{
              background: "rgba(253, 169, 45, 0.08)",
              color: "rgb(253, 169, 45)"
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );
      case "error":
        return (
          <div
            style={{
              background: "rgba(255, 48, 48, 0.08)",
              color: "rgb(255, 48, 48)"
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );
      case "pending":
        return (
          <div
            style={{
              background: "rgba(33, 43, 54, 0.08)",
              color: "rgb(33, 43, 54)"
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );
      case "progress":
        return (
          <div
            style={{
              background: "rgba(73 69 255, 0.08)",
              color: "rgb(7, 141, 238)"
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );
      case "primary":
        return (
          <div
            style={{
              background: colors.verifiedColor,
              color: colors.white
            }}
            className={`badge ${round ? "rounded-full" : ""}`}
          >
            {text}
          </div>
        );

      default:
        return "nothings";
    }
  };

  return handleVariant();
};

export default Badge;
