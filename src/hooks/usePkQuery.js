import { useContext, useState } from "react";
import usePerf from "./usePerf";
import usePkResourceCache from '../../hooks/usePkResourceCache';
import { LITERAL } from '@common/constants';

export default function usePkQuery({ proskomma, ready: paramReady, type, bookId, chapter, owner, languageId}) {

  const abbr =
    ( owner.toLowerCase() === 'unfoldingword' )
      ? ( type === LITERAL )
        ? 'ult' : 'ust'
      : ( type === LITERAL )
        ? 'glt' : 'gst'

  const docSetId = `${owner}/${languageId}_${abbr}`
  const extBcvQuery = `${owner}/${languageId}_${abbr}/${bookId}`
  const verbose = true
  const cacheReady = usePkResourceCache(extBcvQuery)
  const allAreReady = paramReady && cacheReady

  const bcvQuery = {
    book: {
      [bookId?.toLowerCase()]: {
         ch: { [chapter] : {} }
      }
    }
  }

  return usePerf({
    proskomma, ready: allAreReady, docSetId, bookCode: bookId.toUpperCase(), verbose, bcvQuery
  });

}
