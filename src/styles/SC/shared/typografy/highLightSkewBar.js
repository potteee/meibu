import styled from 'styled-components'

// Create a overRide styles.
export const CSHighLightSkewBar = styled.a`
&& {
  padding : 0.06em 3em;
  margin : 0.2em 0 0.5em 0;
  text-align : right;
  font-weight: bold;
  font-family: sans-serif;
  color: white;
  background-color: black;
  display: block;
  position : relative;
  left : -3.3em;
  width : 11em;
  font-size: 1.1em;
  transform: skewX(-40deg);
  div {
    transform: skewX(40deg);
  }
}
`
