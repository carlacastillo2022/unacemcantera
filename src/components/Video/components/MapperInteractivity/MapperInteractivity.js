import React from 'react';
import { ImageMap } from '@qiuz/react-image-map';
import PropTypes from "prop-types";
import styled from "styled-components";

const ContainerInteractivity = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonInteractive = styled.button`
  background: transparent;
  border: 0px;
  border-radius: 6px;
  display: flex;
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  cursor: pointer;
  :hover {
    background-color: rgba(247, 247, 247, 0.2);
  }
  :active {
    background-color: rgba(247, 247, 247, 0.5);
    background-size: 100%;
    transition: background 0s;
  }
`;


const MapperInteractivity = ({ src, className, onClickArea, mapAreas }) => {
  const map = mapAreas?.map(item => ({ ...item, render: () => (<ButtonInteractive />) }))
  const onMapClick = (area, index) => {
    if (onClickArea)
      onClickArea(`cta${index+1}`)
  }

  return (
    <ContainerInteractivity>
      <ImageMap
        className={className}
        src={src}
        map={map || []}
        onMapClick={onMapClick}
      />
    </ContainerInteractivity>
  )
}

MapperInteractivity.propTypes = {
  src: PropTypes.string,
  templateName: PropTypes.string,
  className: PropTypes.string
};

MapperInteractivity.defaultProps = {
  templateName: '',
  className: "image-map"
};

export default MapperInteractivity;