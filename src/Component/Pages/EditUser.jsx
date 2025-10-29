import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const EditUser = ({ open, initial, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (initial) {
            setName(initial.name);
            setEmail(initial.email);
        }
    }, [initial]);

    const handleSave = () => {
        onSave({ name, email });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched(true)}
                        error={touched && !name}
                        helperText={touched && !name ? 'Name is required' : ''}
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched(true)}
                        error={touched && !email}
                        helperText={touched && !email ? 'Email is required' : ''}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={!name || !email}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUser;
