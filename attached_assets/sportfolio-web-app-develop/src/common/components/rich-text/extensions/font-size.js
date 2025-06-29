import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions: {
    types: ["textStyle"]
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML(element) {
              return { fontSize: element.style.fontSize || null };
            },
            renderHTML(attributes) {
              if (!attributes.fontSize) {
                return {};
              }
              if (attributes?.fontSize?.fontSize) {
                return {
                  style: `font-size: ${attributes?.fontSize?.fontSize}`
                };
              }
              return {
                style: `font-size: ${attributes.fontSize}`
              };
            }
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        }
    };
  }
});

export default FontSize;
