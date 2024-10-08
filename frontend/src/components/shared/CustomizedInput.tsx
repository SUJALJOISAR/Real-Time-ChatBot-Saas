import { TextField } from '@mui/material';
import React from 'react'

type Props={
    name:string;
    type:string;
    label:string;
    value:string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomizedInput = (props:Props) => {
  return (  
    <TextField
    margin='normal'
     InputLabelProps={{style:{color:"white"}}}
     name={props.name} 
     label={props.label} 
     type={props.type} 
     value={props.value} // Controlled input value
    onChange={props.onChange} // Event handler for input change
     InputProps={{style:{width:"400px",borderRadius:10,fontSize:20,color:"white",padding:"5px"}}}
     />
  )
}

export default CustomizedInput
