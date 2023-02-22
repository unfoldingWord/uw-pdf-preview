# PdfPreview demo 1

PdfPreview with EpiteleteHtml

```js
import { useState, useEffect } from 'react';

import __htmlPerf from '../data/tit.en.ult.perf.json';

function Component () {
  
  const pdfPreviewProps = {
    bookId: 'TIT',
    verbose: true,
  }
  
  return (
    <>
    <div key="1">
      <PdfPreview key="1" {...pdfPreviewProps} />
    </div>
    </>
  );
};  

<Component key="1" />;

```
