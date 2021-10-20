import React,{useState,useEffect} from 'react'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'

export default function DeleteAssessment (props) {
    const [openDialog,setOpenDialog] = useState(false)
    // let openDialog = true

    const handleOncloseDialog = () => {
        console.log("openDialog")
        setOpenDialog(false);
        props.setDialogFlag(false)
        console.log("setDialogFlag false")
        // openDialog = false
    };

    useEffect(() => {
        console.log("set OpenDialog true")
        setOpenDialog(true)
    },[])

    return (
        <>
        <div>aaaaaaaaaaaaaaaa</div>
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
                    // 削除する関数を記載予定   
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