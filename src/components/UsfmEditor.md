# UsfmEditor demo

The demo demonstrates using the UsfmEditor in standalone mode 
(with all Proskomma / Epitetele handling done through a PkCacheProvider, 
 which is included as a wrapper in the app).

```js
import { useState, useEffect } from 'react';
import usePkImport from "../hooks/usePkImport";
import { usfmText } from '../data/tit.en.ult.usfm.js';
import PkCacheProvider from '../context/LocalPkCacheContext'

function Component () {
  const docSetId = 'unfoldingWord/en_ult'
  const bookId = 'TIT'
  const docSetBookId = `${docSetId}/${bookId}`

  const chapter = 1
  const bcvQuery = { 
    book: { 
      [bookId.toLowerCase()]: {
        ch: { [chapter] : {} } 
      } 
    } 
  }

  const onSave = (arg) => console.log("save button clicked", arg)
 
  const editorProps = {
    onSave,
    docSetId,
    usfmText,
    bcvQuery,
  }
  
  return (
      <div key="1">
        <UsfmEditor {...editorProps} />
      </div>
  );
};  

<PkCacheProvider>
  <Component key="1" />
</PkCacheProvider>

```
