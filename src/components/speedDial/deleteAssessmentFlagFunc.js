const deleteAssessmentFlagFunc = (props) => {

    console.log("speeddialの「削除」が押されました。")
    props.setDialogFlag(true)

    console.log("wN:"+props.workName+" wM:"+props.workMedia+" wI:"+props.workId+" fpf:"+props.pfirstPostFlag)

}

export default deleteAssessmentFlagFunc