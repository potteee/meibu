import React from 'react';
import TextField from "@mui/material/TextField";

const TextInput = (props) => {
    return (
        <TextField
            fullWidth={props.fullWidth}
            label={props.label}
            margin={props.margin ? props.margin : "none"} 
            // margin="dense"
            multiline={props.multiline}
            required={props.requiredF}
            rows={props.rows}
            value={props.value}
            type={props.type}
            onChange={props.onChange}
            sx={props.sx}
        />
    )
}

export default TextInput;