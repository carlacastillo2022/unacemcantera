import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { COLOR, SIZE } from "./constants";

const StyledButton = styled.button`
  border: 0px;
  height: auto;
  position: relative;
  background-position: center;
  transition: background-color 0.8s;
  font-family: ${({ theme }) => theme.fonts.mainFont};
  border-radius: ${({ color, theme }) =>
    theme.commons.button[color].borderRadius};
  align-self: flex-start;
  /* pressed state */
    ${({ color, theme, disabled }) =>
      !disabled
        ? css`
            &:active {
              background: ${theme.commons.button[color].backgroundPressed};
              background-size: 100%;
              transition: background 0s;
            }
          `
        : css`
            opacity: 0.4;
          `}}
  /* color */
  ${({ color, theme }) => css`
    background-color: ${theme.commons.button[color].background};
    color: ${theme.commons.button[color].color};
  `}
  /* size */
  ${({ size, theme }) => css`
    width: ${theme.commons.button.sizes[size].width};
    padding: ${theme.commons.button.sizes[size].padding};
    line-height: ${theme.commons.button.sizes[size].lineHeight};
  `}
  /* active */
  ${({ theme, active, color }) =>
    active &&
    css`
      background: ${theme.commons.button[color].background};
      color: ${theme.commons.button[color].color};
    `}
`;

const StyledBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  span {
    font-size: 18px;
    line-height: 20px;
    font-weight: 700;
  }
`;

function SimpleButton({
  elementId,
  onClick,
  className,
  disabled,
  type,
  label,
  color,
  iconLeft,
  iconRight,
  size,
  active,
}) {
  const props = {
    onClick,
    disabled,
    type,
    className,
    id: elementId,
    color,
    size,
    active,
  };

  return (
    <StyledButton {...props}>
      <StyledBody>
        {<img src={iconLeft} style={{ marginRight: '18px' }} />}
        <span>{label}</span>
        {<img src={iconRight} style={{ marginLeft: '18px' }} />}
      </StyledBody>
    </StyledButton>
  );
}

SimpleButton.propTypes = {
  elementId: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(Object.values(COLOR)),
  size: PropTypes.oneOf(Object.values(SIZE)),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  active: PropTypes.bool,
};

SimpleButton.defaultProps = {
  disabled: false,
  type: "button",
  color: COLOR.PRIMARY,
  size: SIZE.LARGE,
  active: false,
};

SimpleButton.displayName = "SimpleButton";

export default SimpleButton;
