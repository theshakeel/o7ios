import React from "react";
import { Box, Modal } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { Style } from "./style";

const ModalWrapper = ({ employee, children, crossIcon, sx, open, setOpen, boxCss }) => {
  const handleClose = () => setOpen(false);
  return (
    <Modal open={open} sx={Style.wrapper}>
      <Box className={boxCss} sx={{ ...Style.main(employee), sx }}>
        {crossIcon && (
          <Box sx={Style.actionBtn}>
            <RxCross2 onClick={handleClose} />
          </Box>
        )}
        {children}
      </Box>
    </Modal>
  );
};

export default ModalWrapper;
