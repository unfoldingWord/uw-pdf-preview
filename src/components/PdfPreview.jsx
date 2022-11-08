import React from 'react'
import PropTypes from 'prop-types';
// import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
// import isEqual from 'lodash.isequal';
import {
  useCatalog, useRenderPreview,
} from 'proskomma-react-hooks'

export default function PdfPreview( props) {
  const { bookId, verbose } = props;

  // const pdfPreviewProps = {
  //   // handlers,
  //   decorators: {},
  //   verbose,
  // };

  return (
    <div key="1" className="PdfPreview">
      This is a test
    </div>
  );
};

PdfPreview.propTypes = {
  onSave: PropTypes.func,
  bookId: PropTypes.string,
  verbose: PropTypes.bool,
};
