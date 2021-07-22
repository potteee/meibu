import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup';

const RadioButton = (props) => {
    console.log((props)+"props")
    
    // 囲い型注意。
    return(
        <RadioGroup
            // aria-label={props.arial}
            onChange={props.onChange}
            name={props.name}
            value={props.value}
            // color={props.color}
        >
            {props.label}

        </RadioGroup>
    )
}

export default RadioButton