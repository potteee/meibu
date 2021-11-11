import React,{useState,useEffect} from 'react'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'

//Redux
import {useSelector} from 'react-redux'
import { getUserId,getUserAssessmentWorks } from "../reducks/users/selectors";
import { deleteAssessment } from "../reducks/users/operations";
import { useRouter } from 'next/router'

export default function DeleteWork (props) {
    const selector = useSelector((state) => state)
    const assessmentWorks = getUserAssessmentWorks(selector);
    const userId = getUserId(selector)

    const router = useRouter()

    const [openDialog,setOpenDialog] = useState(false)
    // let openDialog = true

    const urlDeleteWork = `/api/firebase/delete/work/${props.workId}`
    // const urlGetPostdWorksId = `/api/firebase/get/assessment/fulldata/${props.workId}`
    const urlGetPostdWorksId = `/api/firebase/get/privateUsers/postedWorksId/${props.workId}_${userId}`
    const urlDeleteAssessment = `/api/firebase/delete/assessment/${props.workId}_${userId}`

    const handleOncloseDialog = () => {
        console.log("openDialog")
        setOpenDialog(false);
        props.setWorkDeleteDialogFlag(false)
        console.log("setWorkDeleteDialogFlag false")
    };

    const clickedDeleteWork = async() => {
        console.log("作品削除が押されました。１")
        console.log("workId"+props.workId+"userId"+props.userId)

        // api配下で実行
        // privateusers -> postedworkId //削除
        // users -> pubPostedWorks 
        props.dispatch({type:"IS_LOADING" ,
            payload : {
                isLoading : true
            }
        })

        const resPostdWorksId = await fetch(urlGetPostdWorksId)

        const dataPostdWorksId = await resPostdWorksId.json()
        console.log(JSON.stringify(dataPostdWorksId)+"+res delete dataPostdWorksId data")

        // 評価削除部
        // workInfoの評価情報
        // const resAssess = await fetch(urlDeleteAssessment, {
        await fetch(urlDeleteAssessment, {
            // 送信先URL
            method: 'post', 
            // 通信メソッド    
            header: {'Content-Type': 'application/json'}, 
            // JSON形式のデータのヘッダー    
            body: JSON.stringify({
                workTag:dataPostdWorksId.assessmentWorkTag,
                isLiked:dataPostdWorksId.isLiked,
                workScore:dataPostdWorksId.workScore,
            }) 
        })

        // redux (userAssessmentWorks)    
        const aftAssessmentWorks = delete assessmentWorks[props.workId]
        console.log(JSON.stringify(aftAssessmentWorks)+"aftAssessmentWorks")
        deleteAssessment(aftAssessmentWorks)

        //作品削除部
        const resWork = await fetch(urlDeleteWork)
        const dataWork = await resWork.json()
        console.log(JSON.stringify(dataWork)+"+res delete assessment data")
        // 作品情報画面に移動

        await router.push({
            pathname : '/menu/mypage',
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
                        clickedDeleteWork()
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

// export default DeleteWork