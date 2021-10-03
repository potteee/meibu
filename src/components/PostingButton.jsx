import React from 'react';

//material UI
import FormGroup from '@mui/material/FormGroup'
// import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PublishIcon from '@mui/icons-material/Publish';

export default function PostingButton(props) {
  console.log("Pos Start")
  console.dir(props)

  const useStyles = {
    postingGrid : {
      margin : "40px 0px 20px 0px",    
    },
    postingButton : {
      padding : "8px 29px",
      margin : "0px 0.5em",
    },
    postingBox : {
      margin : "0px 5px 0px 15px",
    },
    postingTypology : {
      fontSize : 20,
    },
    postingSubTypology : {
      fontSize : 11,
    },
    // FormGroupStyle : {
    //   marginTop : "1em",
    // }
  }
  const classes = useStyles;

  return (
    <FormGroup row 
      // sx={classes.FormGroupStyle}
    >
    <Grid container xs={12} sx={classes.postingGrid} justifyContent={"center"}>
      <Grid container item xs={6} justifyContent="center">
        <Button
          // variant="contained"
          variant="outlined"
          // color="secondary"
          size="large"
          startIcon={<SaveAltIcon />}
          sx={classes.postingButton}
          onClick={() => {
            props.changeIsPublic(false)
            // props.changeIsPublic((preIsPublic) => false)
            props.postButtonClicked(false)
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={12} sx={classes.postingBox}>
              <Typography sx={classes.postingTypology}>
                投稿
            </Typography>
            </Grid>
            <Grid item xs={12} sx={classes.postingBox}>
              <Typography sx={classes.postingSubTypology}>
                個人記録
            </Typography>
            </Grid>
          </Grid>
        </Button>
      </Grid>

      <Grid container item xs={6} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PublishIcon />}
          // classes={{root : classes.postingButton}}
          sx={classes.postingButton}
          onClick={() => {
            props.changeIsPublic(true)
            props.postButtonClicked(true)
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={12} sx={classes.postingBox}>
            <Typography sx={classes.postingTypology}>
                投稿
            </Typography>
            </Grid>
            <Grid item xs={12} sx={classes.postingBox}>
            <Typography sx={classes.postingSubTypology}>
                一般公開
            </Typography>
            </Grid>
          </Grid>
        </Button>
      </Grid>
    </Grid>
  </FormGroup>
  );
}