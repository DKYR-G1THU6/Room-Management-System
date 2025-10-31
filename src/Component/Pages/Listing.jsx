import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Toolbar, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from "@mui/material/Checkbox";

import AddRoomFab from './AddRoomFab';
import EditRoom from './EditRoom';

const paginationModel = { page: 0, pageSize: 5 };



const Listing = () => {

    const handleOpenEdit = (row) => { setEditRow(row); setEditOpen(true); };
    const handleCloseEdit = () => { setEditOpen(false); setEditRow(null); };
    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [selected, setSelected] = useState(new Set()); 
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargets, setDeleteTargets] = useState([]); 
    const [gridHeight, setGridHeight] = useState(400);
    const [searchText, setSearchText] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const rowHeight = 52; 
    const headerFooter = 120; 
    const isSelected = (id) => selected.has(id);
    
    const rows = [
    { id: 1, RoomNo: 101, Location: 'Level 1', Description: 'A nice room' },
    { id: 2, RoomNo: 102, Location: 'Level 1', Description: 'A luxurious room' },
    { id: 3, RoomNo: 301, Location: 'Level 3', Description: 'A cozy room' },
    { id: 4, RoomNo: 201, Location: 'Level 2', Description: 'A simple room' },
    { id: 5, RoomNo: 302, Location: 'Level 3', Description: 'A grand room' },
    { id: 6, RoomNo: 103, Location: 'Level 1', Description: 'A mysterious room' },
    { id: 7, RoomNo: 202, Location: 'Level 2', Description: 'A spacious room' },
    { id: 8, RoomNo: 104, Location: 'Level 1', Description: 'A cozy room' },
    { id: 9, RoomNo: 303, Location: 'Level 3', Description: 'A luxurious room' },
    
    ];
    
     const columns = [
        {
            field: 'selection',
            headerName: '',
            width: 50,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Checkbox
                    checked={isSelected(params.row.id)}
                    onChange={() => toggleSelect(params.row.id)}
                    onClick={(e) => e.stopPropagation()} 
                />
            ),
        },
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'RoomNo', headerName: 'Room No', width: 130 },
        { field: 'Location', headerName: 'Location', width: 150 },
        { field: 'Description', headerName: 'Description', flex: 1, minWidth: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" aria-label="edit" onClick={() => handleOpenEdit(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label="delete" onClick={() => openDeleteConfirm(params.row.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const [rowsState, setRowsState] = useState(() => {
        try {
            const raw = localStorage.getItem('rooms');
            return raw ? JSON.parse(raw) : rows;
        } catch (e) {
            return rows;
        }
    });

    const uniqueLocations = React.useMemo(() => {
        const locations = new Set(rowsState?.map(row => row.Location) || []);
        return Array.from(locations).sort();
    }, [rowsState]);

    const filteredRows = React.useMemo(() => {
        let filtered = rowsState;
        
        
        if (locationFilter !== 'all') {
            filtered = filtered.filter(row => row.Location === locationFilter);
        }

       
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            filtered = filtered.filter(row => 
                row.RoomNo.toString().includes(searchLower) ||
                row.Description.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    }, [rowsState, searchText, locationFilter]);

    const [nextId, setNextId] = useState(() => {
        try {
            const raw = localStorage.getItem('roomsNextId');
            if (raw) 
                return Number(raw);
        } catch (e) {

        }

        const max = rows.reduce((m, r) => (r.id > m ? r.id : m), 0);
        
        try {
            const stored = localStorage.getItem('rooms');
            if (stored) {
                const parsed = JSON.parse(stored);
                const m2 = parsed.reduce((m, r) => (r.id > m ? r.id : m), 0);
                return m2 + 1;
            }
        } catch (e) {

        }

        return max + 1;
    });

    const handleAddRow = (newRow) => {
        
            const roomNoVal = Number(newRow.RoomNo);
            const row = { 
                id: nextId, 
                RoomNo: Number.isNaN(roomNoVal) ? newRow.RoomNo : roomNoVal,
                Location: newRow.Location,
                Description: newRow.Description
            };
            setRowsState((prev) => [...prev, row]);
            setNextId((id) => id + 1);
    };

    const openDeleteConfirm = (id) => {
        setDeleteTargets([Number(id)]);
        setDeleteConfirmOpen(true);
    };

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

   
    const performDelete = (ids) => {
    setRowsState((prev) => {
        const idSet = new Set(ids.map((n) => Number(n)));

        const filtered = prev.filter((r) => !idSet.has(r.id));
 
        return filtered; 
    });
    
    setSelectionModel([]);
    };

    const handleSaveEdit = (updated) => {
        setRowsState((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        handleCloseEdit();
    };

    
    const selectAllOnPage = () => {
        const start = paginationModel.page * paginationModel.pageSize;
        const end = Math.min(start + paginationModel.pageSize, rowsState.length);
        const pageIds = rowsState.slice(start, end).map(row => row.id);
        setSelected(new Set(pageIds));
    };

    const clearSelection = () => {
        setSelected(new Set());
    };

    const deleteSelected = () => {
        if (selected.size === 0)
             return;
        setDeleteTargets(Array.from(selected).map(Number));
        setDeleteConfirmOpen(true);
    };


    useEffect(() => {
        const compute = () => {
            const desired = paginationModel.pageSize * rowHeight + headerFooter;
            const max = window.innerHeight - 160; 
            setGridHeight(Math.min(desired, max));
        };
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, [paginationModel.pageSize]);
       
    useEffect(() => {
        try {
            localStorage.setItem('rooms', JSON.stringify(rowsState));
            localStorage.setItem('roomsNextId', String(nextId));
        } catch (e) {
        }
    }, [rowsState, nextId]);

        return (
        <Box sx={{ 
            height: '100vh',
            width: '100%', 
            p: 2 }}>

            <Paper sx={{ width: '100%' }}>

                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', width: 1300, gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Room List</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <input
                            type="text"
                            placeholder="Search Room No or Description..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '300px'
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={locationFilter}
                                label="Location"
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Level</MenuItem>
                                {uniqueLocations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={selectAllOnPage}
                    >
                        Select page
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={clearSelection}
                    >
                        Clear selection
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        disabled={selected.size === 0}
                        onClick={deleteSelected}
                    >
                        Delete selected ({selected.size})
                    </Button>
                </Box>


                <Box sx={{ height: gridHeight }}>
                    <DataGrid
                        maxWidth="100%"
                        rows={filteredRows}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        sx={{ border: 0 }}
                    />
                </Box>
            </Paper>

            <AddRoomFab onAdd={handleAddRow} />

           
            <EditRoom open={editOpen} initial={editRow} onClose={handleCloseEdit} onSave={handleSaveEdit} />

            
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {deleteTargets.length} row{deleteTargets.length > 1 ? 's' : ''}? This action cannot be undo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                            performDelete(deleteTargets);
                            setDeleteConfirmOpen(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Listing;