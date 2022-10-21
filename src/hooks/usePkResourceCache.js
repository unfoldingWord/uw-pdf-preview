import { useContext, useState } from "react";
import { useRepoClient } from 'dcs-react-hooks';
import { useCatalog } from "proskomma-react-hooks";
import { usfmFilename } from '@common/BooksOfTheBible'
import { decodeBase64ToUtf8 } from '@utils/base64Decode';
import useDeepEffect from 'use-deep-compare-effect';

export default function usePkResourceCache( queryStr, pkHook, repoBasePath) {
  const [usfmCache,setUsfmCache] = useState({})
  const [pkCache,setpkCache] = useState({})
  const [loading,setLoading] = useState(true)

  const { proskomma, stateId } = pkHook;

  const { catalog } = useCatalog({ proskomma, stateId, verbose: true });

  useDeepEffect(() => {
    const addpkCache = (key, str) => {
      setpkCache({ [key]: str, ...pkCache });
    }
    catalog && catalog?.docSets && catalog.docSets.forEach((docSet) => {
      console.log(docSet)
      const _id = docSet.id
      const _bookCode = docSet.documents && docSet.documents[0] && docSet.documents[0].bookCode
      const extBcvKey = `${_id}/${_bookCode}`
      addpkCache(queryStr,docSet.documents[0])
    })
  }, [catalog,usfmCache,setpkCache])

  const repoClient = useRepoClient({ basePath: repoBasePath })

  // monitor the usfmCache and import if a new queryStr is found
  useDeepEffect(() => {
    const addUsfmCache = (key, str) => {
      setUsfmCache({ [key]: str, ...usfmCache });
    }
    async function getUsfm() {
      const [owner, repoStr, bookId] = queryStr?.split('/')
      const filename = usfmFilename(bookId)
      const _content = await repoClient.repoGetContents(
        owner,repoStr,filename
      ).then(({ data }) => data)
      // note that "content" is the JSON returned from DCS. 
      // the actual content is base64 encoded member element "content"
      let _usfmText;
      if (_content && _content.encoding && _content.content) {
        if ('base64' === _content.encoding) {
          _usfmText = decodeBase64ToUtf8(_content.content)
        } else {
          _usfmText = _content.content
        }
        addUsfmCache(queryStr,_usfmText)
      }
    }
    if (!usfmCache[queryStr]) getUsfm()
  }, [queryStr,usfmCache,setUsfmCache])

  // monitor the pkCache vs usfmCache and import needed documents from usfmCache
  useDeepEffect(() => {
    async function doImportPk() {
      const [org, repoStr, bookId] = queryStr?.split('/')
      const [lang, abbr] = repoStr?.split('_')
      proskomma.importDocument(
        { org, lang, abbr },
        "usfm",
        usfmCache[queryStr]
      )
      setLoading(false)
    }

    if (usfmCache[queryStr]) {
      if (proskomma && !pkCache[queryStr]) {
        doImportPk()
      } else {
        setLoading(false)
      }
    }
  }, [queryStr,usfmCache,pkCache,proskomma])

  return {
    loading,
    pkCache,
  };
}
