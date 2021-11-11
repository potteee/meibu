import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link'
import {db} from '../firebase/index'
import Header from '../components/header'
import ApplicationBar from '../components/applicationBar'
import Footer from '../components/footer'
import SpeedDialPosting from '../components/speedDialPosting'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import GLoading from '../components/GLoading';
import {getUserAssessmentWorks} from '../reducks/users/selectors'

//mui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { getFirestore, collection, doc,query, where, getDocs ,getDoc ,setDoc } from "firebase/firestore";

const News = ({worksData}) => {
  // console.log(JSON.stringif(worksData,null ,2)+"+worksData@J");
  const {isReady} = useRouter()
  const selector = useSelector((state) => state)

  const userAssessment = Object.keys(getUserAssessmentWorks(selector))

  const [isLoading,setIsLoading] = useState(true)

  console.log(userAssessment+"+userAssessment")

  const classes = {
    master : {
      wrap : "nowrap",
    },
    title : {
      paddingLeft : "0.5rem",
    } ,
    bolder : {
      fontWeight: 'bolder',
    } ,
    counts : {
      justifyContent : "center",
    } ,
    media : {
    }
  }

  useEffect(() => {
    setIsLoading(isReady ? false : true)
  },[isReady])

  if(isLoading){
  // if(!worksData || isLoading){
    console.log("GLoading at /index.jsx")
    return (
      <>
        {/* Gloading... */}
        <GLoading/>
      </>
    )
  } else {
    return (
    <>
      <ApplicationBar title="NEWS"/>
      {/* バズビデオみたいにカテゴリごとに表示 */}
      {worksData != false 
        ? <Grid container item xs={12}> {worksData.map(oneworksData => (
          <Grid container item xs={12} sx={classes.master}>
            <Grid container item xs={1}>
            <Typography noWrap sx={userAssessment.includes(oneworksData.workId) ? classes.bolder : null}>
              {oneworksData.winfoScore != -1 
              ? Math.round(oneworksData.winfoScore)
              // ? Math.floor(oneworksData.winfoScore * 10) / 10  
              : "-"
            }</Typography></Grid>
            <Grid container item xs={8} sx={classes.title}>
              <Link 
                // href="/post/[id]" 
                href="/post/[postWorkId]" 
                as={`/post/${oneworksData.workId}`}>
                <Typography noWrap sx={userAssessment.includes(oneworksData.workId) ? classes.bolder : null}>
                  {oneworksData.workName}
                </Typography>
              </Link>
            </Grid>
            <Grid container item xs={2} zeroMinWidth sx={classes.media}>
              <Typography noWrap sx={userAssessment.includes(oneworksData.workId) ? classes.bolder : null}>
                {oneworksData.winfoMedia}
              </Typography>
            </Grid>
            <Grid container item xs={1} sx={classes.counts}>
              <Typography noWrap sx={userAssessment.includes(oneworksData.workId) ? classes.bolder : null}>
                {oneworksData.winfoCount}
              </Typography>
            </Grid>
          </Grid>
        ))} </Grid>
        : <p>投稿されている作品データは有りません</p>
      }
      <SpeedDialPosting />
      <Footer />
    </>
    )
  }
}

export async function getStaticProps(context) {
  // const [worksData, setWorksData] = useState(false);

  let worksData = [];

  await getDocs(collection(db, 'wInfo'))
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      // if(worksData == false) {
      //   worksData = [doc.data()]
      // } else {
      //   worksData = [...worksData , doc.data()]
      // }
      worksData = [...worksData , {
        ...doc.data(),
        createTime : doc.data().createTime.toDate().toLocaleString("ja"),
        updateTime : doc.data().updateTime.toDate().toLocaleString("ja"),
      }]
    })

    // return {props : {worksData} }// {worksData : [...worksData]}
  })
  .catch((error) => {
    alert('works DB get fail')
    throw new Error(error)
  })

  return {
    props : {worksData},
    revalidate: 30,
  }
}

export default News

