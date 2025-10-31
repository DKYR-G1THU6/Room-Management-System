import{ useState, useMemo } from 'react';
import { 
    Box, 
    Paper, 
    IconButton, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useQuery, useMutation, gql } from '@apollo/client';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from "@mui/material/Checkbox";

import AddRoomFab from './AddRoomFab';
import EditRoom from './EditRoom';



const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      RoomNo
      Location
      Description
    }
  }
`;

const ADD_ROOM = gql`
  mutation AddRoom($RoomNo: Int!, $Location: String!, $Description: String!) {
      addRoom(RoomNo: $RoomNo, Location: $Location, Description: $Description) {
        id
        RoomNo
        Location
        Description
      }
  }
`;

const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $RoomNo: Int!, $Location: String!, $Description: String!) {
      updateRoom(id: $id, RoomNo: $RoomNo, Location: $Location, Description: $Description) {
        id
        RoomNo
        Location
        Description
      }
  }
`;

const DELETE_ROOMS = gql`
  mutation DeleteRooms($ids: [ID!]!) {
      deleteRooms(ids: $ids)
  }
`;




const Listing = () => {
 
    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [selected, setSelected] = useState(new Set()); 
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargets, setDeleteTargets] = useState([]); 
    const [searchText, setSearchText] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const rowHeight = 52; 
    const headerFooter = 110;

   
    const { data, loading, error } = useQuery(GET_ROOMS);

  
    const [addRoom] = useMutation(ADD_ROOM, {
        refetchQueries: [{ query: GET_ROOMS }],
        onError: (err) => alert(`Error adding room: ${err.message}`) 
    });

    const [updateRoom] = useMutation(UPDATE_ROOM, {
       
        refetchQueries: [{ query: GET_ROOMS }], 
        onError: (err) => alert(`Error updating room: ${err.message}`)
    });

    const [deleteRooms] = useMutation(DELETE_ROOMS, {
        refetchQueries: [{ query: GET_ROOMS }],
        onCompleted: () => {
            setSelected(new Set());
        },
        onError: (err) => alert(`Error deleting rooms: ${err.message}`)
    });

    const rows = data?.rooms || [];
    const handleOpenEdit = (row) => { setEditRow(row); setEditOpen(true); };
    const handleCloseEdit = () => { setEditOpen(false); setEditRow(null); };
    const isSelected = (id) => selected.has(id);

    

    const uniqueLocations = useMemo(() => {
        const locations = new Set(rows.map(row => row.Location));
        return Array.from(locations).sort();
    }, [rows]); 

    const filteredRows = useMemo(() => {
        let filtered = rows;
        
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
    }, [rows, searchText, locationFilter]); 

    const dynamicGridHeight = useMemo(() => {
    
    const rowsPerPage = paginationModel.pageSize;
    
    const dataRowsHeight = rowsPerPage * rowHeight;
    
    const actualRows = Math.min(filteredRows.length, rowsPerPage);
    const finalHeight = (actualRows * rowHeight) + headerFooter;
    const maxHeight = 800; 
    return Math.min(finalHeight, maxHeight);
    
}, [paginationModel.pageSize, filteredRows.length]);

    const openDeleteConfirm = (id) => {
            setDeleteTargets([id]); 
            setDeleteConfirmOpen(true);
    };

    const handleAddRow = (newRow) => {
      
        addRoom({
            variables: {
                RoomNo: parseInt(newRow.RoomNo, 10), 
                Location: newRow.Location,
                Description: newRow.Description
            }
        });
    };

    const handleSaveEdit = (updated) => {
       
        updateRoom({
            variables: {
                id: updated.id,
                RoomNo: parseInt(updated.RoomNo, 10),
                Location: updated.Location,
                Description: updated.Description
            }
        });
        handleCloseEdit();
    };

    const performDelete = (ids) => {

        deleteRooms({
            variables: {
                ids: ids 
            }
        });
        setDeleteConfirmOpen(false); 
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

    const selectAllOnPage = () => {
        const start = paginationModel.page * paginationModel.pageSize;
       
        const end = Math.min(start + paginationModel.pageSize, filteredRows.length); 
        const pageIds = filteredRows.slice(start, end).map(row => row.id);
        setSelected(new Set(pageIds));
    };

    const clearSelection = () => {
        setSelected(new Set());
    };

    const deleteSelected = () => {
        if (selected.size === 0) return;
        setDeleteTargets(Array.from(selected));
        setDeleteConfirmOpen(true);
    };

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
                    <IconButton size="small" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(params.row); }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label="delete" onClick={(e) => { e.stopPropagation(); openDeleteConfirm(params.row.id); }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
    if (error) return <Typography sx={{ p: 4 }}>Error: {error.message}</Typography>;

    
    return (
        <Box sx={{ 
            height: '100vh',
            width: '100%', 
            p: 2 
        }}>

            <Paper sx={{ width: '100%' }}>

                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, minWidth: '150px' }}>Room List</Typography>
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

                <Box sx={{ height: dynamicGridHeight, width: '100%' }}>
                    <DataGrid
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

            
            {editRow && (
                <EditRoom 
                    open={editOpen} 
                    initial={editRow} 
                    onClose={handleCloseEdit} 
                    onSave={handleSaveEdit} 
                />
            )}
            
           
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {deleteTargets.length} row{deleteTargets.length > 1 ? 's' : ''}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => performDelete(deleteTargets)}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Listing;