import React from 'react';

//material UI
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import PublishIcon from '@material-ui/icons/Publish';

export default function PostingButton(props) {
  console.log("Pos Start")
  console.dir(props)

  const useStyles = makeStyles((theme) => ({
    postingGrid : {
      margin : "40px 0px 20px 0px",    
    },
    postingButton : {
      padding : "8px 29px",
      margin : "0px 0.5rem",
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
  }))
  const classes = useStyles();

  return (
    <FormGroup row>
    <Grid container item xs={12} classes={{root : classes.postingGrid}}
    >
      <Grid container item xs={6} justify="center">
        <Button
          variant="contained"
          color="default"
          size="large"
          startIcon={<SaveAltIcon 
          />}
          classes={{root : classes.postingButton}}
          onClick={() => {
            props.changeIsPublic((preIsPublic) => false)
            props.postButtonClicked(false)
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={12} className={classes.postingBox}>
              <Typography classes={{root : classes.postingTypology}}>
                投稿
            </Typography>
            </Grid>
            <Grid item xs={12} className={classes.postingBox}>
              <Typography classes={{root : classes.postingSubTypology}}>
                個人記録
            </Typography>
            </Grid>
          </Grid>
        </Button>
      </Grid>

      <Grid container item xs={6} justify="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PublishIcon />}
          classes={{root : classes.postingButton}}
          onClick={() => {
            props.changeIsPublic(true)
            props.postButtonClicked(true)
          }}
        >
          <Grid container item xs={12}>
            <Grid item xs={12} className={classes.postingBox}>
              <Typography classes={{root : classes.postingTypology}}>
                投稿
            </Typography>
            </Grid>
            <Grid item xs={12} className={classes.postingBox}>
              <Typography classes={{root : classes.postingSubTypology}}>
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