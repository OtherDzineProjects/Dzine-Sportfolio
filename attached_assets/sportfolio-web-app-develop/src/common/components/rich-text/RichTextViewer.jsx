import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import FontSize from "./extensions/font-size";
import LineHeight from "./extensions/line-height";
import CustomImage from "./extensions/image";
import Link from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import "./style.css";

export const RichTextViewer = ({ content, className = "" }) => {
  const editor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: `prose min-w-full w-full max-w-full [&_ol]:list-decimal [&_ul]:list-disc editor__content rich-text-viewer ${className}`
      }
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image", "Underline"],
        codeBlock: false
      }),
      Highlight,
      TextStyle,
      Underline,
      Color,
      Table.configure({
        resizable: false
      }),
      TableCell,
      TableHeader,
      Document,
      Text,
      TableRow,
      FontSize,
      LineHeight,
      CustomImage.configure({
        HTMLAttributes: {
          style: "margin: auto; width: 150px"
        }
      }),
      Link.configure({
        autolink: false,
        defaultProtocol: "https",
        openOnClick: true
      })
    ],
    content: content,
    editable: false
  });

  return <EditorContent editor={editor} />;
};
