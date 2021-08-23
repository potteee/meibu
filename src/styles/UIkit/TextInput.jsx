import React from 'react';
import TextField from "@material-ui/core/TextField";

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
            className={props.className}
        />
    )
}

export default TextInput;