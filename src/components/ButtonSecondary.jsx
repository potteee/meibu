import React from 'react'
import Button from '@mui/material/Button';

export default function ButtonSecondary (props) {
    const classes = {
        useStyle : {
            background : '#ffcc33',
            color: '#fffff',
            // color: '#000000',
            fontSize: '25',
            height: '48',
            marginBottom: '16',
            width: '256',
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