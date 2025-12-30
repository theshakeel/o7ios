import React, { useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Avatar, Typography, Box, CircularProgress, IconButton, Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import ChatPayment from '../../screens/PaymentSummary/ChatPayment';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UserActionModal = forwardRef(({ user, sub, onAvatarUpdate }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const BASE_PATH = process.env.REACT_APP_BASE_PATH;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useImperativeHandle(ref, () => ({
    openModal: handleOpen,
    closeModal: handleClose
  }));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) return setError('Please select an image file (JPEG, PNG, etc.)');
    if (file.size > 1024 * 1024) return setError('File size should be less than 1MB');

    setError('');
    setSelectedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    setUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/upload-avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) onAvatarUpdate?.(response.data.avatarUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Tooltip title="User Settings">
        <IconButton onClick={handleOpen} sx={{ '& svg': { color: '#fff', fontSize: 26 }, '&:hover svg': { color: '#FFBA83' } }}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        sx={{ zIndex: 5000 }}
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
     

        <DialogContent sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {/* Back arrow */}
                <ArrowBackIcon
                   onClick={handleClose} // close parent modal
                  sx={{ fontSize: 28, color: '#fff', cursor: 'pointer', mr: 2 }}
                />

                {/* User name */}
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {user?.name}
                </Typography>
              </Box>

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
              sx={{
                bgcolor: '#FFBA83',
                color: '#1E1E1E',
                '&:hover': { bgcolor: '#e6a972' },
                borderRadius: 3,
                px: 3,
                py: 1,
              }}
            >
              Upload Avatar
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
            </Button>

            {uploading && <CircularProgress sx={{ mt: 2, color: '#FFBA83' }} size={30} />}
            {error && <Typography sx={{ color: '#FF6B6B', mt: 1 }} variant="body2">{error}</Typography>}
            <Typography sx={{ color: '#aaa', mt: 1, fontSize: '0.8rem' }}>
              Max file size: 1MB (JPEG, PNG)
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            {sub === null ? (
              <ChatPayment onBack={handleClose} />
            ) : (
              <Typography sx={{ color: '#fff', textAlign: 'center', fontSize: '0.95rem' }}>
                Subscription ends on: {sub.end_date}
              </Typography>
            )}
          </Box>
        </DialogContent>

        {/* <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #444', justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#fff',
              bgcolor: '#2C2C2C',
              px: 4,
              py: 1,
              borderRadius: 3,
              '&:hover': { bgcolor: '#444' },
            }}
          >
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
});

export default UserActionModal;
