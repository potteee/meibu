// この位置に人ごとの作品採点情報をおく
// [postUserId].js


import { useRouter } from 'next/router'
import Header from '../../../components/header'
import Footer from '../../../components/footer'

const postUserId = () => {
  const router = useRouter()

  return (
    <>
      <Header />

      <Footer />
    </>
  )
}

export default postUserId
