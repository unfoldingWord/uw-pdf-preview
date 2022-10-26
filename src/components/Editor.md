# Editor demo 1

The Editor expects input of a EpiteleteHtml object.

```js
import { useState, useEffect } from 'react';

import __htmlPerf from '../data/tit-fra_fraLSG-perf.html.json';
import EpiteleteHtml from "epitelete-html";
import { useProskomma, useImport } from "proskomma-react-hooks";
import { useDeepCompareCallback, useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";

const urlDocument = ({ selectors, bookCode, bookName, filename, ...props}) => ({
  selectors,
  bookCode, 
  url: `https://git.door43.org/${selectors.org}/${selectors.lang}_${selectors.abbr}/raw/branch/master/${filename}`,
});

const documents = [
  urlDocument({ bookCode: 'mat', filename: '41-MAT.usfm', selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ult' } }),
  urlDocument({ bookCode: 'luk', filename: '43-LUK.usfm', selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ult' } }),
];

function Component () {
  const verbose = true
  const [startImport, setStartImport] = useState(false);
  const _documents = startImport ? documents : [];

  const proskommaHook = useProskomma({ verbose });
  const { proskomma } = proskommaHook

  const onImport = (props) => console.log('Imported doc!', props);

  const { importing, done } = useImport({
    ...proskommaHook,
    onImport,
    documents,
    verbose,
  });
  
  const ready = !importing && done
  
  const onSave = (arg) => console.log("save button clicked", arg)
  const docSetId = 'unfoldingWord/en_ult'
  
<<<<<<< HEAD
  const epiteleteHtml = useDeepCompareMemo(() => (
=======
  const epHtml = useDeepCompareMemo(() => (
>>>>>>> ab7aa882eebbb31dfe4518ab22be748ae849c13d
    ready && new EpiteleteHtml({ proskomma, docSetId, options: { historySize: 100 } })
  ), [proskomma, ready, docSetId]);
  
  const editorProps = {
<<<<<<< HEAD
    epiteleteHtml,
=======
    EpiteleteHtml: epHtml,
>>>>>>> ab7aa882eebbb31dfe4518ab22be748ae849c13d
    bookId: 'mat',
    onSave,
    verbose
  }

  const editorPropsLuk = {
<<<<<<< HEAD
    epiteleteHtml,
=======
    EpiteleteHtml: epHtml,
>>>>>>> ab7aa882eebbb31dfe4518ab22be748ae849c13d
    bookId: 'luk',
    onSave,
    verbose
  }
  
  return (
    <>
    <div key="1">
      { ready ? <Editor key="1" {...editorProps} /> : 'Loading...'}
    </div>
    <div key="2">
      { ready ? <Editor key="2" {...editorPropsLuk} /> : 'Loading...'}
    </div>
    </>
  );
};  

<Component key="1" />;

```


# Editor demo 2

The demo demonstrates using Epitelete in standalone mode (no Proskomma).
Here is the function for sideloading:
```txt
    /**
     * Loads given perf into memory
     * @param {string} bookCode
     * @param {perfDocument} perfDocument - PERF document
     * @return {Promise<perfDocument>} same sideloaded PERF document
     */
    async sideloadPerf(bookCode, perfDocument, options = {}) {
```

```js
import { useState, useEffect } from 'react';

import __htmlPerf from '../data/tit.en.ult.perf.json';
import EpiteleteHtml from "epitelete-html";

function Component () {
  const proskomma = null;
  const docSetId = 'unfoldingWord/en_ult'
  const [ready, setReady] = useState(false);
  const [ep, setEp] = useState(new EpiteleteHtml({ proskomma, docSetId, options: { historySize: 100 } }))
  const verbose = true

  const onSave = (arg) => console.log("save button clicked", arg)
  
  useEffect(
    () => {
      async function loadPerf() {
          console.log("Start side load of Titus");
          const data = await ep.sideloadPerf('TIT', __htmlPerf)
          console.log("End side load of Titus", data);
          console.log("Books loaded:", ep.localBookCodes())
          setReady(true)
      }
      if ( ep && !ready ) loadPerf();
    }, [ep, ready]
  )
  
  const editorProps = {
    EpiteleteHtml: ep,
    bookId: 'TIT',
    onSave,
    verbose
  }
  
  return (
    <>
    <div key="1">
      { ready ? <Editor key="1" {...editorProps} /> : 'Loading...'}
    </div>
    </>
  );
};  

<Component key="1" />;

```
