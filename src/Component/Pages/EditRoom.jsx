import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';

const EditRoom = ({ open, initial, onClose, onSave }) => {
    const [roomNo, setRoomNo] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (initial) {
            setRoomNo(initial.RoomNo ?? '');
            setLocation(initial.Location ?? '');
            setDescription(initial.Description ?? '');
            } else {
            setRoomNo('');
            setLocation('');
            setDescription('');
        }
        setTouched(false);
    }, [initial, open]);

    const isValid = () => {
        return (
            String(roomNo).trim() !== '' &&
            String(location).trim() !== '' &&
            String(description).trim() !== ''
        );
    };

    const handleSave = () => {
        if (!isValid()) { 
            setTouched(true);
             return; 
            }

        const roomNoVal = Number(roomNo);

        onSave({ 
             id: initial.id,
            RoomNo: Number.isNaN(roomNoVal) ? roomNo : roomNoVal,
            Location: location,
            Description: description
        });
    };

    return (
        <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth maxWidth="sm"
        >
            <DialogTitle>Edit Room</DialogTitle>
            <DialogContent dividers>
                <Box sx={{
                     display: 'flex',
                      gap: 2, 
                      alignItems: 'center'
                       }}>

                        <TextField 
                        label="Room No" 
                        size="small" 
                        sx={{ width: 130 }} 
                        value={roomNo} 
                        onChange={(e) => setRoomNo(e.target.value)} 
                        error={touched && !roomNo} 
                        helperText={touched && !roomNo ? 'Required' : ''} />

                        <Autocomplete 
                        disablePortal 
                        fullWidth size="small" 
                        options={['Level 1','Level 2','Level 3']} 
                        value={location} 
                        onChange={(e,v)=>setLocation(v)} 
                        renderInput={(params)=>
                            <TextField {...params} 
                            label="Location" 
                            size="small" 
                            error={touched && !location} 
                            helperText={touched && !location ? 'Required' : ''} />} />
                </Box>
                <TextField 
                label="Description" 
                fullWidth margin="normal" 
                multiline rows={4}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                error={touched && !description} 
                helperText={touched && !description ? 'Required' : ''} />

            </DialogContent>

            
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditRoom;
