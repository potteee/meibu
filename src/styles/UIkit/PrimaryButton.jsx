import React from 'react';
import Button from '@mui/material/Button';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles( {
    "button" : {
        backgroundColor: "#4dddd",
        color: "#000",
        fontSize: 25,
        height: 48,
        marginButton: 16,
        width : 256
    }
}
)
const PrimaryButton = (props) => {
    const classes = useStyles();

    return (
        <Button 
          sx={classes.button}
          variant="contained"
          onClick={() => props.onClick()}>
            {props.label}
        </Button>
    )
}

export default PrimaryButton;