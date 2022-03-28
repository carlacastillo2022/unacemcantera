import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from 'react-responsive-modal';
import Button from "@components/Button";
import 'react-responsive-modal/styles.css';
import './styles.css'

const Title = styled.h2`
  color: #e52820;
  font-weight: bold;
  font-size: 20px;
  line-height: 1.35;
  text-align: center;
  font-stretch: normal;
  font-style: normal;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const WrapperButton = styled.div`
    button {
        padding: 12px 18px !important;
    }
`;

const Dialog = ({ children, modalIsOpen, title, labelButton, onClose }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(modalIsOpen);
    }, [modalIsOpen])

    return (
        <Modal
            open={open}
            center
            onClose={() => {
                if(onClose) onClose()
            }}
            classNames={{
                modal: 'dialog',
            }}
        >
            <Title>{title}</Title>
            {children}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <WrapperButton>
                    <Button size="small" label={labelButton} onClick={onClose} />
                </WrapperButton>
            </div>
        </Modal>
    );
};

Dialog.propTypes = {
    children: PropTypes.node,
    modalIsOpen: PropTypes.bool,
    title: PropTypes.string,
    labelButton: PropTypes.string,
    onClose: PropTypes.func,
};

export default Dialog;