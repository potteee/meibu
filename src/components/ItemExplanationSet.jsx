import React from 'react'

import { MiddleTitle } from "src/styles/SC/shared/typografy/middleTitle"
import { ExplanationTextDefault } from 'src/styles/SC/shared/typografy/ExplanationTextDefault'
import { TitleSpacing } from 'src/styles/SC/shared/grid/titleSpacing'
import Grid from '@mui/material/Grid';
import { ClassNames } from '@emotion/react';

export default function ItemExplanationSet (props) {

    // props.middleTitle : 中項目名
    // props.text : 説明文部

    const classes = {
        expStyle : {
            marginLeft : "0.9rem",
        }
    }

    return (
        <>
            {/* <TitleSpacing container item xs={12} style={{marginBottom:"20px"}}> */}
            <TitleSpacing container item xs={12}>
                <Grid container item xs={3} alignItems={props.titleFlex}>
                <MiddleTitle>
                    {props.middleTitle}
                </MiddleTitle>
                </Grid>
                <Grid container item xs={8} alignItems={"center"} sx={classes.expStyle}>
                <ExplanationTextDefault>
                    {props.text}
                </ExplanationTextDefault>
                </Grid>
            </TitleSpacing>
        </>
    )
}