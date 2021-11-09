const workDelete = (props) => {

    console.log("speeddialの「作品削除」が押されました。")
    props.setWorkDeleteDialogFlag(true)

    console.log("wN:"+props.workName+" wM:"+props.workMedia+" wI:"+props.workId+" fpf:"+props.pfirstPostFlag)

}

export default workDelete