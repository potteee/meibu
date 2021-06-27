import Header from '../../components/header'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'

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
    console.log(searchWord+"+searchWord 1")

    //Validation
    if (searchWord === ""){
        alert("必須項目が未入力です");
        return false;
    }

    //& tranceform
    // searchWord.replace('&','＆')

    router.push({
      pathname: '/menu/searchResult',
      query: {
        searchWord : searchWord,
        hist : hist
        // jres : JSON.stringify(jres),
      } 
    })
  }

  return(
  <>
    {/* <Header /> */}
    <ApplicationBar title="作品検索画面"/>
    {/* <h2>作品検索画面</h2> */}
    {hist == "Posting" && (
        <p>記録する作品を検索しましょう！</p>
    )}
    {hist == "Search" && (
        <p>お探しの作品を検索！（あいまい検索可能）</p>
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