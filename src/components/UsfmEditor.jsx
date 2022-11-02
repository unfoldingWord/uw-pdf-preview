import React from 'react'
import PropTypes from 'prop-types';
import PkEditor from "./PkEditor";
import usePkImport from "../hooks/usePkImport";

export default function UsfmEditor( props) {
  const { docSetId, usfmText, bcvQuery } = props;
  const books = Object.keys(bcvQuery?.book)
  const bookId = books[0] ?? ""
  const docSetBookId = `${docSetId}/${bookId}`

  const { loading, done } = usePkImport( docSetBookId, usfmText ) 

  const editorProps = {
    ...props,
  };

  return (
    <div>
      {loading && (<div>Loading...</div>)}
      {done && <PkEditor { ...editorProps } />}
    </div>
  )
};

UsfmEditor.propTypes = {
  onSave: PropTypes.func,
  docSetId: PropTypes.string,
  usfmText: PropTypes.string,
  bcvQuery: PropTypes.any, 
};
