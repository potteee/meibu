import React from 'react'
import Button from '@mui/material/Button';

export default function ButtonPrimary (props) {
    const classes = {
        useStyle : {
            background : '#4dddd',
            // color: '#000000',
            color: '#fffff',
            // fontSize: '25px',
            // height: '4em',
            margin: '1.2em',
        }
    }
    return (
        <Button 
            variant={"contained"}
            sx={classes.useStyle}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    )
}