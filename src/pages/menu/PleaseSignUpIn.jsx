import React from 'react'
import Link from 'next/link'
import Footer from '../../components/footer'
import ApplicationBar from '../../components/applicationBar'
import { useRouter } from 'next/router'
import GLoading from '../../components/GLoading'

export default function PleaseSignUpIn () {
    const router = useRouter()
    const { isReady } = useRouter()

    const { hist,searchWord,infoMedia,workId,firstPostFlag } = router.query

    if(!isReady){
        return(
            <GLoading />
        )
    } else {
        return (
            <>
                <ApplicationBar title="ログイン"/>
                {searchWord}
                {hist}
                {hist == undefined && (
                    <p>MyPageを見るにはログインしてね！</p>
                )}
                {hist == "Posting" && (
                    <p>ログイン後に投稿できます！</p>
                )}
                <ul>
                    <li>
                        <Link
                        href={{
                            pathname: "/auth/signin",
                            query: { 
                                hist : hist,
                                searchWord : searchWord, 
                                infoMedia : infoMedia,
                                workId : workId,
                                firstPostFlag : firstPostFlag,
                            },
                        }}>
                            ログイン
                        </Link>
                    </li>
                    <li>
                        <Link
                        href={{
                            pathname: "/auth/signup",
                            query: { 
                                hist : hist,
                                searchWord : searchWord,
                                infoMedia : infoMedia,
                                workId : workId,
                                firstPostFlag : firstPostFlag,
                            },
                            }}>
                            アカウント作成
                        </Link>
                    </li>
                    {/* <li> //step2
                        テストアカウントを使用
                    </li> */}
                </ul>
                <Footer/>
            </>
        )
    }
}

