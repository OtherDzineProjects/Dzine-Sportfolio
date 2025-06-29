import { Extension } from "@tiptap/core";

const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions: {
    types: ["paragraph", "textStyle"] // Define which node types this extension should apply to
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: "1", // Default value if no line height is set
            parseHTML(element) {
              return { lineHeight: element.style.lineHeight || null }; // Parse the HTML and extract the line height attribute
            },
            renderHTML(attributes) {
              if (!attributes.lineHeight) {
                return {}; // If no line height is set, return an empty object
              }
              if (attributes?.lineHeight?.lineHeight) {
                return {
                  style: `line-height: ${attributes?.lineHeight?.lineHeight}`
                };
              }

              return {
                style: `line-height: ${attributes.lineHeight}` // Render the line height attribute in the HTML
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight }).run(); // Command to set line height
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight: 1 }).run(); // Command to unset line height
        }
    };
  }
});

export default LineHeight;
