import Link from 'next/link'
import styles from '../styles/components.module.css'

import {useDispatch, useSelector} from "react-redux";


const Footer = () => {
  const selector = useSelector((state) => state)
  
  console.log("Footer Start")
  
  console.log(selector.users.uid+"+selector.users.uid")
  console.log(selector.users.isSignedIn+"+selector.users.isSignedIn")


  console.log("Footer End")
  return(
  <footer>
    <ul className={styles.undermenu}>
      <li>
        {/* <Link href="/menu/mypage">
          <a>mypage</a>
        </Link> */}
        {selector.users.isSignedIn && (
          <Link
            href={{
            pathname: "/menu/mypage",
            query: { id : selector.users.uid},
          }}>
              <a>mypage</a>
          </Link> 
        )}
        {!selector.users.isSignedIn && (
          <Link
          href={{
            pathname: "/auth/signin",
            query: { hist : "Posting" },
          }}>
              <a>mypage</a>
          </Link>
        )}
      </li>
      <li>
        <Link href="/menu/notification">
          <a>notification</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a>news</a>
        </Link>
      </li>
      <li>
        <Link href={{
          pathname: "/menu/search",
          query: {hist : "Search"},
        }}>
          <a>search</a>
        </Link>
      </li>
    </ul>
  </footer>
  )
}
export default Footer