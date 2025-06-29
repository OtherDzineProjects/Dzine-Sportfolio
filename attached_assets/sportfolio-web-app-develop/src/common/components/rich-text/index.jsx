import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import "./style.css";
import {
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Document from "@tiptap/extension-document";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TableRow from "@tiptap/extension-table-row";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import PropTypes from "prop-types";
import {
  BoldIcon,
  BulletListIcon,
  DividerIcon,
  EnterDownIcon,
  HighlightIcon,
  ImageIcon,
  ItalicIcon,
  LineHeightIcon,
  PaperClip,
  RedoIcon,
  StrikeIcon,
  TableIcon,
  TextCenterIcon,
  TextJustifyIcon,
  TextLeftIcon,
  TextRightIcon,
  UnderLineIcon,
  UndoIcon
} from "./RichIcons";
import FontSize from "./extensions/font-size";
import LineHeight from "./extensions/line-height";
import CustomImage from "./extensions/image";
import { colors } from "utils/colors";
import { DownArrow, VerifiedInputIcon } from "assets/InputIcons";
import Link from "@tiptap/extension-link";
import Text from "@tiptap/extension-text";
import { forwardRef } from "react";

const MenuBar = ({
  value,
  toolbar = {},
  toolbarContent,
  toolbarPosition,
  dragEnabled,
  setPosition = () => {},
  handleMouseDown = () => {},
  setShowReset = () => {},
  showReset = false
}) => {
  const { editor } = useCurrentEditor();
  const {
    image = false,
    table = false,
    color = true,
    fontSize = true,
    lineHeight = true
  } = toolbar;
  const inputRef = useRef(null),
    inputFileRef = useRef(null);

  useEffect(() => {
    if (value && editor && !editor.focused) {
      // Save cursor position
      const { from, to } = editor.state.selection;

      // Update content
      editor.commands.setContent(value, false, { preserveWhitespace: "full" });

      // Restore cursor position
      const newFrom = Math.min(from, editor.state.doc.content.size);
      const newTo = Math.min(to, editor.state.doc.content.size);
      editor.commands.setTextSelection({ from: newFrom, to: newTo });
    }
  }, [value, editor]);

  const handleClick = () => {
    inputRef.current.click();
  };

  const fileBlob = (data) => {
    const blob = new Blob([data], {
      type: data.type
    });
    return blob;
  };

  const addImage = useCallback(
    (data) => {
      if (data) {
        const file = data[0];
        const url = fileBlob(file);
        const reader = new FileReader();
        reader.readAsDataURL(url);
        reader.onloadend = function render() {
          const base64data = reader.result;
          if (base64data) {
            editor.chain().focus().setImage({ src: base64data }).run();
          }
        };
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="tip-tap-toolbar"
      style={{
        cursor: dragEnabled && "move",
        borderBottom:
          toolbarPosition === "top"
            ? `1px solid ${colors.gray}`
            : `0px solid ${colors.gray}`,
        borderTop:
          toolbarPosition === "top"
            ? `0px solid ${colors.gray}`
            : `1px solid ${colors.gray}`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="tool-section">
        <Tooltip label="Undo">
          <IconButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            variant="unstyled"
            size="xs"
            icon={<UndoIcon />}
            className="rich-text-button"
          />
        </Tooltip>

        <Tooltip label="Redo">
          <IconButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            variant="unstyled"
            size="xs"
            icon={<RedoIcon />}
            className="rich-text-button"
          />
        </Tooltip>

        <Menu size="xs">
          <MenuButton
            as={Button}
            size="xs"
            aria-label="Options"
            variant="unstyled"
            rightIcon={<DownArrow />}
            className="rich-text-button"
          >
            Heading
          </MenuButton>
          <MenuList className="heading-menu-drop">
            <MenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`rich-text-option ${
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Heading 1
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`rich-text-option ${
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Heading 2
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`rich-text-option ${
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Heading 3
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={`rich-text-option ${
                editor.isActive("heading", { level: 4 }) ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Heading 4
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={`rich-text-option ${
                editor.isActive("heading", { level: 5 }) ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Heading 5
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`rich-text-option ${
                editor.isActive("paragraph") ? "is-active" : ""
              }`}
              variant="unstyled"
              size="xs"
            >
              Paragraph
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu size="xs">
          <Tooltip label="Align">
            <MenuButton
              as={IconButton}
              size="xs"
              aria-label="Options"
              icon={<TextLeftIcon />}
              variant="unstyled"
              className="rich-text-button"
            />
          </Tooltip>
          <MenuList className="icon-menu-drop">
            <MenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`rich-text-option ${
                editor.isActive({ textAlign: "left" }) ? "is-active" : ""
              }`}
            >
              <TextLeftIcon />
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`rich-text-option ${
                editor.isActive({ textAlign: "center" }) ? "is-active" : ""
              }`}
            >
              <TextCenterIcon />
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`rich-text-option ${
                editor.isActive({ textAlign: "right" }) ? "is-active" : ""
              }`}
            >
              <TextRightIcon />
            </MenuItem>
            <MenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={`rich-text-option ${
                editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
              }`}
            >
              <TextJustifyIcon />
            </MenuItem>
          </MenuList>
        </Menu>

        <Tooltip label="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            variant="unstyled"
            size="xs"
            icon={<BoldIcon />}
            className={`rich-text-button ${
              editor.isActive("bold") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            variant="unstyled"
            size="xs"
            icon={<ItalicIcon />}
            className={`rich-text-button ${
              editor.isActive("italic") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            variant="unstyled"
            size="xs"
            icon={<UnderLineIcon />}
            className={`rich-text-button ${
              editor.isActive("underline") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Strike">
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            variant="unstyled"
            size="xs"
            icon={<StrikeIcon />}
            className={`rich-text-button ${
              editor.isActive("strike") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Highlight">
          <IconButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            variant="unstyled"
            size="xs"
            icon={<HighlightIcon />}
            className={`rich-text-button ${
              editor.isActive("highlight") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant="unstyled"
            size="xs"
            icon={<BulletListIcon />}
            className={`rich-text-button ${
              editor.isActive("bulletList") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Link">
          <IconButton
            onClick={setLink}
            variant="unstyled"
            size="xs"
            icon={<PaperClip />}
            className={`rich-text-button ${
              editor.isActive("link") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Horizontal Line">
          <IconButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            variant="unstyled"
            size="xs"
            icon={<DividerIcon />}
            className={`rich-text-button ${
              editor.isActive("highlight") ? "is-active" : ""
            }`}
          />
        </Tooltip>

        <Tooltip label="Enter New Line">
          <IconButton
            onClick={() => editor.chain().focus().setHardBreak().run()}
            variant="unstyled"
            size="xs"
            icon={<EnterDownIcon />}
            className="rich-text-button"
          />
        </Tooltip>
        {color && (
          <Tooltip label="Color">
            <input
              type="color"
              onInput={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              value={editor.getAttributes("textStyle").color}
              data-testid="setColor"
            />
          </Tooltip>
        )}
        {table && (
          <Menu size="xs">
            <Tooltip label="Table">
              <MenuButton
                as={IconButton}
                size="xs"
                aria-label="Options"
                icon={<TableIcon />}
                variant="unstyled"
                className="rich-text-button"
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                New Table
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                isDisabled={!editor.can().addColumnBefore()}
              >
                Add Column Before
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                isDisabled={!editor.can().addColumnAfter()}
              >
                Add Column After
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().deleteColumn().run()}
                isDisabled={!editor.can().deleteColumn()}
              >
                Delete Column
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().addRowBefore().run()}
                isDisabled={!editor.can().addRowBefore()}
              >
                Add Row Before
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().addRowAfter().run()}
                isDisabled={!editor.can().addRowAfter()}
              >
                Add Row After
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().deleteRow().run()}
                isDisabled={!editor.can().deleteRow()}
              >
                Delete Row
              </MenuItem>
              <MenuItem
                onClick={() => editor.chain().focus().deleteTable().run()}
                isDisabled={!editor.can().deleteTable()}
              >
                Delete Table
              </MenuItem>
            </MenuList>
          </Menu>
        )}

        {image && (
          <Tooltip label="Insert Image">
            <IconButton
              variant="unstyled"
              size="xs"
              icon={<ImageIcon />}
              ref={inputFileRef}
              onClick={handleClick}
              className="rich-text-button"
            />
          </Tooltip>
        )}

        <input
          type="file"
          onChange={(event) => addImage(event.target.files)}
          ref={inputRef}
          hidden
          accept="image/jpeg,image/gif,image/png,image/x-eps"
        />

        {fontSize && (
          <Menu size="xs">
            <MenuButton
              as={Button}
              size="xs"
              aria-label="Options"
              rightIcon={<DownArrow />}
              variant="unstyled"
              className="rich-text-button"
            >
              Font Size
            </MenuButton>
            <MenuList
              className="font-menu-drop"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {[10, 12, 14, 16, 18, 21, 24, 30, 36].map((item) => (
                <MenuItem
                  key={item}
                  onClick={() =>
                    editor.chain().focus().setFontSize(`${item}px`).run()
                  }
                  className={`rich-text-option ${
                    editor.getAttributes("textStyle")?.fontSize?.fontSize ===
                    `${item}px`
                      ? "is-active"
                      : ""
                  }`}
                >
                  {`${item}px`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}

        {lineHeight && (
          <Menu size="xs">
            <Tooltip label="Line Height">
              <MenuButton
                as={IconButton}
                size="xs"
                aria-label="Options"
                icon={<LineHeightIcon />}
                variant="unstyled"
                className="rich-text-button"
              />
            </Tooltip>
            <MenuList
              className="font-menu-drop"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <MenuItem
                  key={item}
                  onClick={() =>
                    editor.chain().focus().setLineHeight(item).run()
                  }
                  className={`rich-text-option ${
                    editor.getAttributes("textStyle")?.lineHeight
                      ?.lineHeight === `${item}`
                      ? "is-active"
                      : ""
                  }`}
                >
                  {item}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </div>
      <div className="tool-action">{toolbarContent}</div>
      {showReset && (
        <IconButton
          variant="unstyled"
          // icon={<DragCollapseIcon width="16px" height="16px" />}
          onClick={() => {
            setPosition({ x: 0, y: 0 });
            setShowReset(false);
          }}
        />
      )}
    </div>
  );
};

const RichText = forwardRef(function RichText(props, ref) {
  const {
    name,
    label,
    error,
    focus,
    disabled,
    required,
    verified,
    onChange = () => {},
    value,
    toolbar = {},
    tableResize = false,
    imageStyle = "margin: auto; width: 150px",
    toolbarContent,
    height = "300px",
    toolbarPosition = "bottom",
    header = null,
    footer = null,
    dragEnabled = false
  } = props;

  const extensions = [
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
    Document,
    Text,
    Table.configure({
      resizable: tableResize
    }),
    TableCell,
    TableHeader,
    TableRow,
    FontSize,
    LineHeight,
    CustomImage.configure({
      HTMLAttributes: {
        style: imageStyle
      }
    }),
    Link.configure({
      autolink: false,
      defaultProtocol: "https",
      openOnClick: false
    })
  ];
  const contentRef = useRef(value);

  const [border, setBorder] = useState("");
  const handleInput = (style) => {
    if (error && !disabled) {
      setBorder("error");
    } else {
      setBorder(style);
    }
  };

  useEffect(() => {
    if (disabled) setBorder("");
  }, []);

  useEffect(() => {
    handleInput("");
  }, [error]);

  const containerRef = useRef(ref);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showReset, setShowReset] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setShowReset(true);
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const fieldClass = useMemo(() => {
    let className = "input-rich-container rich-editor";

    if (error) {
      className = "error input-rich-container rich-editor";
    } else if (focus) {
      className = "focus input-rich-container rich-editor";
    }

    return className;
  }, [focus, error]);

  return (
    <div
      className={fieldClass}
      style={{
        transform: dragEnabled
          ? `translate(${position.x}px, ${position.y}px)`
          : "none",
        transition: isDragging ? "none" : "transform 0.35s ease"
      }}
      onMouseMove={dragEnabled ? handleMouseMove : null}
      onMouseUp={dragEnabled ? handleMouseUp : null}
      onMouseLeave={dragEnabled ? handleMouseUp : null}
      ref={containerRef}
    >
      <fieldset
        style={{ "--editor-height": height }}
        className={`${border} input-field-container`}
        onFocusCapture={() => handleInput("active")}
        onBlur={() => handleInput("")}
      >
        {label && (
          <legend className="rich-label">
            <label>
              {label}
              {required && <span className="star">*</span>}
              {verified && <VerifiedInputIcon />}
            </label>
          </legend>
        )}
        {header}
        <EditorProvider
          slotAfter={
            toolbarPosition === "bottom" && (
              <MenuBar
                value={value}
                toolbar={toolbar}
                toolbarContent={toolbarContent}
                toolbarPosition="bottom"
                handleMouseDown={handleMouseDown}
                dragEnabled={dragEnabled}
                setPosition={setPosition}
                setShowReset={setShowReset}
                showReset={showReset}
              />
            )
          }
          slotBefore={
            toolbarPosition === "top" && (
              <MenuBar
                value={value}
                toolbar={toolbar}
                toolbarContent={toolbarContent}
                toolbarPosition="top"
                handleMouseDown={handleMouseDown}
                dragEnabled={dragEnabled}
                setPosition={setPosition}
                setShowReset={setShowReset}
                showReset={showReset}
              />
            )
          }
          editorProps={{
            attributes: {
              immediatelyRender: true,
              shouldRerenderOnTransaction: false,
              spellcheck: false,
              class:
                "prose min-w-full w-full max-w-full [&_ol]:list-decimal [&_ul]:list-disc editor__content"
            }
          }}
          extensions={extensions}
          content={contentRef.target}
          onUpdate={({ editor }) =>
            editor?.getHTML() === '<p style="line-height: 1"></p>'
              ? onChange("")
              : onChange(editor?.getHTML())
          }
          name={name}
        />
        {footer}
      </fieldset>
      {!disabled && error && <div className="error-text">{error}</div>}
    </div>
  );
});

RichText.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  ellipsis: PropTypes.bool,
  value: PropTypes.string
};

RichText.defaultProps = {
  error: "",
  disabled: false,
  required: false,
  ellipsis: false,
  value: ""
};

export default RichText;
