import {
  BlockNoteEditor,
  BlockNoteSchema,
  createBlockSpec,
  defaultBlockSpecs,
  defaultProps,
  filterSuggestionItems,
  insertOrUpdateBlock,
  PartialBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  createReactBlockSpec,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { HiOutlineGlobeAlt } from "react-icons/hi";

// https://www.youtube.com/embed/jdzqY4N8Sys

const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      src: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      console.log("check props", props);
      return (
        <div>
          <iframe width="420" height="315" src={props.block.props.src} />
        </div>
      );
    },
  }
);

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
  },
});

// Custom Slash Menu item to insert a block after the current one.
const insertHelloWorldItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Insert Hello World",
  onItemClick: () => {
    // // Block that the text cursor is currently in.
    // const currentBlock = editor.getTextCursorPosition().block;
    // // New block we want to insert.
    // const helloWorldBlock: PartialBlock = {
    //   type: "paragraph",
    //   content: [{ type: "text", text: "Hello Worlds", styles: { bold: true } }],
    // };
    // // Inserting the new block after the current one.
    // editor.insertBlocks([helloWorldBlock], currentBlock, "after");
    // if (window.confirm("do?")) {
    const test = window.prompt("embed url 입력");

    // if (test) {
    insertOrUpdateBlock(editor, {
      type: "alert",
      props: {
        src: test || "",
      },
    });
    // }
    // }
  },
  aliases: ["helloworld", "hw"],
  group: "Other",
  icon: <HiOutlineGlobeAlt size={18} />,
  subtext: "Used to insert a block with 'Hello World' below.",
});

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertHelloWorldItem(editor),
];

export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu",
      },
      {
        type: "paragraph",
        content: "Notice the new 'Insert Hello World' item - try it out!",
      },
    ],
  });

  // Renders the editor instance.
  return (
    <BlockNoteView
      editor={editor}
      slashMenu={false}
      onChange={async () => {
        const result = await editor.blocksToHTMLLossy(editor.document);
        console.log("result: ", result);
      }}
    >
      <SuggestionMenuController
        triggerCharacter={"/"}
        // Replaces the default Slash Menu items with our custom ones.
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
}
