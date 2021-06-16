import React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkboxing from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

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