import React from 'react'

import { MiddleTitle } from "src/styles/SC/shared/typografy/middleTitle"
import { ExplanationTextDefault } from 'src/styles/SC/shared/typografy/ExplanationTextDefault'
import { TitleSpacing } from 'src/styles/SC/shared/grid/titleSpacing'
import Grid from '@mui/material/Grid';

export default function ExplanationChildSet (props) {

    // props.middleTitle : 中項目名
    // props.text : 説明文部

    return (
        <>
            <Grid container item xs={12}>
                <Grid container item xs={4} alignItems={"center"}>
                <MiddleTitle>
                    {props.middleTitle}
                </MiddleTitle>
                </Grid>
                <Grid container item xs={8} alignItems={"center"}>
                <ExplanationTextDefault>
                    {props.text}
                </ExplanationTextDefault>
                </Grid>
            </Grid>
        </>
    )
}