import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';




const AddRoomFab = ({ onAdd }) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [roomNo, setRoomNo] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const isValid = roomNo && String(roomNo).toString().trim() !== '' && 
                    location && String(location).toString().trim() !== '' && 
                    description && description.toString().trim() !== '';

    const handleAdd = () => {
     
        if (!isValid) return;
        onAdd({ RoomNo: roomNo, Location: location || '', Description: description || '' });
       
        setRoomNo('');
        setLocation('');
        setDescription('');
        setOpenDialog(false);
    };

    return (
        <React.Fragment>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenDialog}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    transform: 'translateZ(0px)',
                    zIndex: 1050,
                }}
            >
                <AddIcon />
            </Fab>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add New Room</DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Room No"
                            size="small"
                            sx={{ width: 130 }}
                            value={roomNo}
                            onChange={(e) => setRoomNo(e.target.value)}
                            error={openDialog && (!roomNo || String(roomNo).trim() === '')}
                            helperText={openDialog && (!roomNo || String(roomNo).trim() === '') ? 'Required' : ''}
                        />
                        <Autocomplete
                            disablePortal
                            fullWidth
                            size="small"
                            options={['Level 1', 'Level 2', 'Level 3']}
                            value={location}
                            onChange={(e, v) => setLocation(v)}
                            renderInput={(params) => 
                                         <TextField {...params} 
                                          label="Location" 
                                          size="small" 
                                          error={openDialog && (!location || String(location).trim() === '')} 
                                          helperText={openDialog && (!location || String(location).trim() === '') ? 'Required' : ''} />}

                            PopperProps={{
                                placement: 'bottom-start',
                                sx: { zIndex: 100 },
                                '& .MuiPaper-root': { transformOrigin: 'top center !important' },
                            }}
                        />
                    </Box>
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={openDialog && (!description || String(description).trim() === '')}
                        helperText={openDialog && (!description || String(description).trim() === '') ? 'Required' : ''}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!isValid}
                    >
                        Add Room
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AddRoomFab;