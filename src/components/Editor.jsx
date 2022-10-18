import {useState, useEffect} from "react"
import { Skeleton, Stack } from "@mui/material";
import usePkQuery from "../hooks/usePkQuery";
import useEditorState from "../hooks/useEditorState";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./sectionBody";
import { HtmlPerfEditor } from "@xelah/type-perf-html";

import "@xelah/type-perf-html/build/components/HtmlSequenceEditor.css";

export default function Editor( props) {
  const { data, proskomma, owner, languageId } = props;
  const [graftSequenceId, setGraftSequenceId] = useState();


  const onHtmlPerf = (_htmlPerf) => {
    console.log('htmlPerf changed!', {_htmlPerf});
    setHtmlPerf(_htmlPerf);
  };


  const handlers = {
    onBlockClick: ({ content: _content, element }) => {
      const _sequenceId = element.dataset.target;
      const { tagName } = element;
      const isInline = tagName === 'SPAN';
      // if (_sequenceId && !isInline) addSequenceId(_sequenceId);
      if (_sequenceId) setGraftSequenceId(_sequenceId);
    },
  };


  const ready = Boolean( (data?.bookId && data?.bookId) || false )

  const { state: { bookCode,
    htmlPerf,
    canUndo,
    canRedo,
    isSaving, }, actions: {
    saveHtmlPerf,
    undo,
    redo} } = usePkQuery({
    proskomma,
    ready,
    type: data?.type,
    bookId: data?.bookId,
    chapter: 1,
    owner,
    languageId,
  })

  const {
    state: {
      sectionable,
      blockable,
      editable,
      preview,
      verbose,
    },
    actions: {
      setSectionable,
      setBlockable,
      setEditable,
      setPreview,
      setToggles,
      setSequenceIds,
      addSequenceId,
      setSequenceId,
    },
  } = useEditorState({sequenceIds: [htmlPerf?.mainSequenceId], ...props});

  const sequenceIds = [htmlPerf?.mainSequenceId];
  const sequenceId = htmlPerf?.mainSequenceId;

  const style = (isSaving  || !sequenceId) ? { cursor: 'progress' } : {};

  useEffect(() =>{
    if( htmlPerf && ! sequenceIds ) {
       setSequenceIds([htmlPerf.mainSequenceId])
       setSequenceId(htmlPerf.mainSequenceId)
    }
    }, [htmlPerf, sequenceIds, setSequenceId, setSequenceIds]
  )

  const skeleton = (
    <Stack spacing={1}>
      <Skeleton key='1' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='2' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='3' variant="text" height="8em" sx={{ bgcolor: 'white' }} />
      <Skeleton key='4' variant="rectangular" height="16em" sx={{ bgcolor: 'white' }} />
    </Stack>
  );

  const options = {
    sectionable,
    blockable,
    editable,
    preview
  };
  const htmlEditorProps = {
    htmlPerf,
    onHtmlPerf: saveHtmlPerf,
    sequenceIds,
    addSequenceId,
    components: {
      section: Section,
      sectionHeading: SectionHeading,
      sectionBody: SectionBody,
    },
    options,
    handlers,
    decorators: {},
    verbose,
  };

  const graftProps = {
    ...htmlEditorProps,
    options: { ...options, sectionable: false },
    sequenceIds: [graftSequenceId],
  };


  const onSectionable = () => { setSectionable(!sectionable); };
  const onBlockable = () => { setBlockable(!blockable); };
  const onEditable = () => { setEditable(!editable); };
  const onPreview = () => { setPreview(!preview); };

  const buttons = (
    <div className="buttons">
      <button style={(sectionable ? {borderStyle: 'inset'} : {})} onClick={onSectionable}>Sectionable</button>
      <button style={(blockable ? {borderStyle: 'inset'} : {})} onClick={onBlockable}>Blockable</button>
      <button style={(editable ? {borderStyle: 'inset'} : {})} onClick={onEditable}>Editable</button>
      <button style={(preview ? {borderStyle: 'inset'} : {})} onClick={onPreview}>Preview</button>
    </div>
  );

  const graftSequenceEditor = (
    <>
      <h2>Graft Sequence Editor</h2>
      <HtmlPerfEditor key="2" {...graftProps} />
    </>
  );

  return (
    <div key="1" className="Editor" style={style}>
      {buttons}
      <h2>Main Sequence Editor</h2>
      {sequenceId ? <HtmlPerfEditor {...htmlEditorProps} /> : skeleton}
      {buttons}
      {graftSequenceId ? graftSequenceEditor : '' }
    </div>
  );
};
