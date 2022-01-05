import { createGlobalStyle } from 'styled-components';

const appStyles = createGlobalStyle`
  body {
    margin: 0;
  }
  
  ul {
    display: block; 
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
  }

  h1, .h1 {
    font-size: 2.667rem;
    line-height: 3.347rem;
  }

  h1, h2, h3, h4, h5, h6,
  .h1, .h2, .h3, .h4, .h5, .h6 {
    margin: 0;
    padding: 0;
  }
  
  h2, .h2 {
    font-size: 2rem;
  }
  
  h3, .h3 {
    font-size: 1.667rem;
  }
  
  h4, .h4 {
    font-size: 1.5rem;
  }
  
  h5, .h5 {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  h6, .h6 {
    font-size: 1rem;
  }
`;

export default appStyles;
