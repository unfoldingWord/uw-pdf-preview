import React, {
  createContext,
  useState,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'

import { useProskomma } from "proskomma-react-hooks";

export const LocalPkCacheContext = createContext({})

export default function PkCacheProvider({ children }) {
  const [pkCache,setPkCache] = useState({})
  const [epCache,setEpCache] = useState({})

  const pkHook = useProskomma({verbose: true})

  const [printPreview, setPrintPreview] = useState(false)
  const [html, setHtml] = useState(null);

  useEffect(() => {
    if ( html ) {
      console.log("html data is available")
      const newPage = window.open('','','_window');
      newPage.document.head.innerHTML = "<title>PDF Preview</title>";
      const script = newPage.document.createElement('script');
      script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
      newPage.document.head.appendChild(script);
      const style = newPage.document.createElement('style');
      const newStyles = `
      body {
        margin: 0;
        background: grey;
      }
      .pagedjs_pages {
      }
      .pagedjs_page {
        background: white;
        margin: 1em;
      }
      .pagedjs_right_page {
        float: right;
      }
      .pagedjs_left_page {
        float: left;
      }
      div#page-2 {
        clear: right;
      }
      `;
      style.innerHTML = newStyles + html.replace(/^[\s\S]*<style>/, "").replace(/<\/style>[\s\S]*/, "");
      newPage.document.head.appendChild(style);
      newPage.document.body.innerHTML = html.replace(/^[\s\S]*<body>/, "").replace(/<\/body>[\s\S]*/, "");      
      setHtml(null);
    }
  }, [html])





  // create the value for the context provider
  const context = {
    state: {
      pkCache,
      epCache,
      pkHook,
    },
    actions: {
      setPkCache,
      setEpCache,
    },
  }

  return (
    <LocalPkCacheContext.Provider value={context}>
      {children}
    </LocalPkCacheContext.Provider>
  )
}

PkCacheProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
