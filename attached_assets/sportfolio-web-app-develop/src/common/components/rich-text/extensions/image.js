import { Image } from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/react";

const CustomImage = Image.extend({
  addOptions: {
    ...Image.options,
    sizes: ["inline", "block", "left", "right", "center"]
  },
  renderHTML({ HTMLAttributes }) {
    const { style } = HTMLAttributes;
    return [
      "figure",
      { style },
      ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    ];
  }
});

export default CustomImage;
