import { useContext } from "react";
import usePerf from "./usePerf";
import usePkResourceCache from './usePkResourceCache';
import { AppContext } from '@context/AppContext'

export default function usePkQuery({ 
  pkHook,
  ready: paramReady, 
  docSetId,
  bookId, 
  chapter
}) {
  const htmlCache = {}

  const { proskomma } = pkHook;
  const repoBasePath = "https://git.door43.org/api/v1/" 

//  const docSetId = `${owner}/${languageId}_${abbr}`
  const extBcvQuery = `${owner}/${languageId}_${abbr}/${bookId}`
  const verbose = true
  const { loading, pkCache } = usePkResourceCache(extBcvQuery,pkHook,repoBasePath)
  const allAreReady = paramReady && !loading

  const bcvQuery = { 
    book: { 
      [bookId?.toLowerCase()]: {
        ch: { [chapter] : {} } 
      } 
    } 
  }

  const { state: perfState, actions: perfActions } = usePerf({
    proskomma, ready: allAreReady, docSetId, bookCode: bookId.toUpperCase(), verbose, bcvQuery
  });

  const { htmlPerf: epHtmlPerf } = perfState;
  htmlCache[extBcvQuery] = epHtmlPerf

  const state = {
    ...perfState,
    pkCache,
    htmlCache,
  };

  const actions = {
    ...perfActions,
  };

  return { state, actions };

}
