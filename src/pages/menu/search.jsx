import Header from '../../components/header'
import Footer from '../../components/footer'

import React, {useState, useCallback} from 'react';
import { PrimaryButton, TextInput } from "../../styles/UIkit"

import Link from 'next/link'

import {useDispatch, useSelector} from "react-redux"
import { useRouter } from 'next/router'

const Search = () => {
  const selector = useSelector((state) => state)

  const router = useRouter()
  const { hist } = router.query

  const [searchWord, setSearchWord] = useState("")

  const inputSearchWord = useCallback((e) => {
    setSearchWord(e.target.value)
},[]);

  const searchButtonClicked = () => {
    router.push({
      pathname: '/menu/searchResult',
      query: {w: searchWord}
    })
  }

  return(
  <>
    <Header />

    <h2>作品検索画面</h2>
    {hist == "Posting" && (
        <p>記録する作品を検索しましょう！</p>
    )}
    <TextInput
        fullWidth={true} label={"作品名"} multiline={false} required={true}
        rows={1} value={searchWord} type={"text"} onChange={inputSearchWord}
    />
    <PrimaryButton label={"検索"} onClick={searchButtonClicked} />

    <Footer />

  </>
  )
}

export default Search