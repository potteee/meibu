import React from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { withStyles } from '@mui/styles';
import { green } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkboxing from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

const CheckIconBox = (props) => {
    return(
        <Checkboxing
            checked={props.checked}
            onChange={props.onChange}
            name={props.name}
            color={props.color}
            classes={props.classes}
        />
    )
}

export default CheckIconBox