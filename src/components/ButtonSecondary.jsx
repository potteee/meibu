import React from 'react'
import Button from '@mui/material/Button';

export default function ButtonSecondary (props) {
    const classes = {
        useStyle : {
            background : '#ffcc33',
            color: '#0099ff',
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