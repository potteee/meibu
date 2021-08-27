import React from 'react'
import Footer from './footer'
import ApplicationBar from './applicationBar'
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { flexbox } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
    circlePosition : {
        margin : "auto",
        position : "fixed",
        top: "46%",
        left : "46%",
    }
}))

export default function GLoading () {
    const classes = useStyles();

    return (
        <>
        {/* 　　 <ApplicationBar title="読み込み中"/> */}
            {/* <Box className={classes.circlePosition}> */}
                {/* <CircularProgress/> */}
            {/* </Box>
            <Footer /> */}
        </>
    )
}

        
// export default function GLoading ({loadingData}) {
//     console.log(loadingData+"+loadingData")
//     return (
//         <>{loadingData}</>
//     )

// }


// export async function getStaticProps(context) {
//     // const [worksData, setWorksData] = useState(false);
//     const useStyles = makeStyles((theme) => ({
//         circlePosition : {
//             margin : "auto",
//             position : "fixed",
//             top: "46%",
//             left : "46%",
//         }
//     }))

//     const classes = useStyles();

//     const loadingData = `
//         <>
//         　　 <ApplicationBar title="読み込み中"/>
//             <Box className={classes.circlePosition}>
//                 <CircularProgress/>
//             </Box>
//             <Footer />
//         </>
//     `
//     console.log(loadingData+"loadingData@SSR")

//     return {
//       props : {loadingData},
//     }
// }