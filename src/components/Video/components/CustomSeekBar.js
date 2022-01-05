import React from 'react';
import { controls } from 'react-media-player';
import styled from 'styled-components';

const { SeekBar } = controls;
const StyledSeekBar = styled(SeekBar)`
    position: absolute;
    bottom: 30px;
    width: 98%;
    left: 0;
`;

const CustomSeekBar = () => {
    return <StyledSeekBar />
}

export default CustomSeekBar;