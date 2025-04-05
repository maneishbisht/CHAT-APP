import { styled } from "@mui/material/styles";
import {Link as LinkComponent} from "react-router-dom";
import {grayColor} from "../../constants/color";
export const VisuallyHiddenInput = styled('input')({
    border : 0,
    clip : "rect(5 5 5 5)",
    height : 1,
    margin : -1,
    overflow : "hidden",
    padding : 0,
    position : "absolute",
    whiteSpace : "nowrap",
    width : 1
});

export const Link = styled(LinkComponent)`
text-decoration : none;
color : black;
padding : 1rem;
&:hover {background-color :#f0f0f0; }`;

export const InputBox = styled ("input")`width : 100%;height : 100%;border : none;outline : none;padding : 0 3rem; border-radius : 1.5 rem; background-color : ${grayColor};`;

export const SearchField = styled('input')`
padding : 1rem 2rem;
width : 20vmax;
border : none;
outline : none;
border-radius : 1.5rem;
background-color : ${grayColor};
ont-size : 1.1rem; `;

export const CurveButton = styled('button')`
border-radius : 1.5rem;
padding : 1rem 1rem;
border : none;
outline : none;
cursor : pointer;
background-color : black;
color : white;
font-size : 1rem;
&:hover {background-color : rgba(0,0,0,0.8);}`; 