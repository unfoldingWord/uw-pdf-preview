import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import isEqual from 'lodash.isequal';

import { Skeleton, Stack } from "@mui/material";
import useEditorState from "../hooks/useEditorState";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SectionBody from "./SectionBody";
import { HtmlPerfEditor } from "@xelah/type-perf-html";

import "@xelah/type-perf-html/build/components/HtmlSequenceEditor.css";

export default function Editor( props) {
  const { onSave, epiteletePerfHtml, bookId, verbose } = props;
  const [graftSequenceId, setGraftSequenceId] = useState();

  // const [isSaving, startSaving] = useTransition();
  const [htmlPerf, setHtmlPerf] = useState();

  const bookCode = bookId.toUpperCase()

  useDeepCompareEffect(() => {
    if (epiteletePerfHtml) {
      //        epiteletePerfHtml.readHtml(bookCode,{},bcvQuery).then((_htmlPerf) => {
      epiteletePerfHtml.readHtml(bookCode).then((_htmlPerf) => {
        setHtmlPerf(_htmlPerf);
      });
    }
  }, [epiteletePerfHtml, bookCode]);

  const onHtmlPerf = useDeepCompareCallback(( _htmlPerf, { sequenceId }) => {
    const perfChanged = !isEqual(htmlPerf, _htmlPerf);
    if (perfChanged) setHtmlPerf(_htmlPerf);

    const saveNow = async () => {
      const newHtmlPerf = await epiteletePerfHtml.writeHtml( bookCode, sequenceId, _htmlPerf );
      if (verbose) console.log({ info: "Saved sequenceId", bookCode, sequenceId });

      const perfChanged = !isEqual(htmlPerf, newHtmlPerf);
      if (perfChanged) setHtmlPerf(newHtmlPerf);
    };
    saveNow()
  }, [htmlPerf, bookCode]);

  const undo = async () => {
    const newPerfHtml = await epiteletePerfHtml.undoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const redo = async () => {
    const newPerfHtml = await epiteletePerfHtml.redoHtml(bookCode);
    setHtmlPerf(newPerfHtml);
  };

  const canUndo = epiteletePerfHtml.canUndo(bookCode);
  const canRedo = epiteletePerfHtml.canRedo(bookCode);

  const handlers = {
    onBlockClick: ({ element }) => {
      const _sequenceId = element.dataset.target;
      // if (_sequenceId && !isInline) addSequenceId(_sequenceId);
      if (_sequenceId) setGraftSequenceId(_sequenceId);
    },
  };

  const {
    state: {
      sectionable,
      blockable,
      editable,
      preview,
    },
    actions: {
      setSectionable,
      setBlockable,
      setEditable,
      setPreview,
      setSequenceIds,
      addSequenceId,
      setSequenceId,
    },
  } = useEditorState({sequenceIds: [htmlPerf?.mainSequenceId], ...props});

  let sequenceIds
  sequenceIds = [htmlPerf?.mainSequenceId]
  const sequenceId = htmlPerf?.mainSequenceId;

  const style = (/*isSaving  ||*/ !sequenceId) ? { cursor: 'progress' } : {};

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
    onHtmlPerf,
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
      <button style={(canUndo ? {borderStyle: 'inset'} : {})} onClick={undo}>Undo</button>
      <button style={(canRedo ? {borderStyle: 'inset'} : {})} onClick={redo}>Redo</button>
      <button  onClick={onSave}>Save</button>
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

Editor.propTypes = {
  onSave: PropTypes.func,
  epiteletePerfHtml: PropTypes.instanceOf(HtmlPerfEditor),
  bookId: PropTypes.string,
  verbose: PropTypes.bool,
};
