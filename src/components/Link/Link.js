import styled from "styled-components";

const Link = styled.a`
  display: table;
  text-decoration: none;
  color: ${({ isDisabled }) => (isDisabled ? "rgba(0, 0, 0, 0.6)" : "#E52820")};
  background-color: transparent;
  font-style: normal;
  font-weight: 400;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  cursor: pointer;
  img {
    vertical-align: middle;
  }
  span {
    margin-left: 8px;
    vertical-align: middle;
  }
`;

export default Link;
