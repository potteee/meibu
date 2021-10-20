const post = (props) => {

    // const router = useRouter()

    console.log("投稿が押されました。")
    console.log("wN:"+props.workName+" wM:"+props.workMedia+" wI:"+props.workId+" fpf:"+props.pfirstPostFlag)
    props.router.push({
        pathname: "/post/posting",
        query: {
            searchWord: props.workName,
            infoMedia : props.workMedia,
            workId : props.workId,
            firstPostFlag : props.pfirstPostFlag,
        }
    })
};

export default post