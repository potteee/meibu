import React,{useState,useEffect} from 'react'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'

//Redux
import {useSelector} from 'react-redux'
import { getUserAssessmentWorks } from "../reducks/users/selectors";
import { deleteAssessment } from "../reducks/users/operations";

import { useRouter } from 'next/router'

export default function DeleteAssessment (props) {
    const selector = useSelector((state) => state)
    const assessmentWorks = getUserAssessmentWorks(selector);
    const router = useRouter()

    const [openDialog,setOpenDialog] = useState(false)
    // let openDialog = true

    const urlDeleteAssessment = `/api/firebase/delete/${props.workId}_${props.userId}`

    const handleOncloseDialog = () => {
        console.log("openDialog")
        setOpenDialog(false);
        props.setDialogFlag(false)
        console.log("setDialogFlag false")
        // openDialog = false
    };

    const clickedDeleteAssessment = async() => {
        console.log("削除が押されました。2")
        console.log("workId"+props.workId+"userId"+props.userId)

        // await fetch(urlDeleteAssessment)
        // .then(async(res)=> {
        //     console.log("fetcher finish")
        //     const data = await res.json()
        //     if (res.status !== 200) {
        //         throw new Error(data.message)
        //     }
        // }).catch((error) => {
        //     alert('Couldnt delete Bookmark')
        //     throw new Error(error)
        // })

        // api配下で実行
        // privateusers -> postedworkId //削除
        // users -> pubPostedWorks 
        props.dispatch({type:"IS_LOADING" ,
            payload : {
                isLoading : true
            }
        })
        // workInfoの評価情報
        const res = await fetch(urlDeleteAssessment, {
            // 送信先URL
            method: 'post', 
            // 通信メソッド    
            header: {'Content-Type': 'application/json'}, 
            // JSON形式のデータのヘッダー    
            body: JSON.stringify({
                workTag:props.workTag,
                isLiked:props.isLiked,
                workScore:props.workScore,
                workWatchTimes:props.workWatchTimes,
            }) 
            // JSON形式のデータ  })
        })
        const data = await res.json()
        console.log(JSON.stringify(data)+"+res delete assessment data")

        // redux (userAssessmentWorks)    
        const aftAssessmentWorks = delete assessmentWorks[props.workId]

        console.log(JSON.stringify(aftAssessmentWorks)+"aftAssessmentWorks")

        deleteAssessment(aftAssessmentWorks)

        // 作品情報画面に移動
        await router.push({
            pathname : '/menu/mypage',
            // pathname : '/post/[postWorkId]',
            // query : { 
            //     postWorkId : props.workId,
            // },
        })
    }

    useEffect(() => {
        console.log("set OpenDialog true")
        setOpenDialog(true)
    },[])

    return (
        <>
        <Dialog 
            open={openDialog} 
            onClose={handleOncloseDialog}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">本当に削除して良いですか？</DialogTitle>
            <DialogActions>
                <Button 
                    onClick={() => {
                        handleOncloseDialog()
                        console.log("キャンセルが押されました。")
                    }}
                    color="primary"
                    // sx={classes.winfoCreatorNodalCancelUpdateButton}
                >
                    キャンセル
                </Button>
                <Button 
                    onClick={() => {
                        clickedDeleteAssessment()
                        handleOncloseDialog()
                        console.log("削除が押されました。")
                    }}
                    color="primary"
                    // sx={classes.winfoCreatorNodalCancelUpdateButton}
                >
                    削除
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
};

// export default deleteAssessment