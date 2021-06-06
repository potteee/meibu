import Link from 'next/link'
import styles from '../styles/components.module.css'
import {getIsSignedIn,getUserId} from '../reducks/users/selectors'
import {useDispatch, useSelector} from "react-redux";


const Footer = () => {
  const selector = useSelector((state) => state)
  
  console.log("Footer Start")
  
  const loginStatus = getIsSignedIn(selector)
  const userId = getUserId(selector)

  console.log("Footer End")
  return(
  <footer>
    <ul className={styles.undermenu}>
      <li>
        <Link
          href={{
          pathname: loginStatus ? "/menu/mypage" : "/auth/signin" ,
          query: loginStatus ? { id : userId} : {hist : "Mypage"} ,
        }}>
            <a>mypage</a>
        </Link> 
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