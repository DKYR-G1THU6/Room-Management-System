import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/system';
import '../CSS/FoodOrdering.css';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';


const drawerWidth = 330; 

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? `${drawerWidth}px` : 0,
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const FoodOrdering = ({ drawerOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('room');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);


  const orders = [
  {
    "id": 1,
    "room": "101",
    "items": [
      { "name": "Large Pepperoni Pizza", "price": 18.50 },
      { "name": "Coke Zero (Can)", "price": 3.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T10:30:00"
  },
  {
    "id": 2,
    "room": "201",
    "items": [
      { "name": "Spaghetti Carbonara", "price": 15.99 },
      { "name": "Caesar Salad (Side)", "price": 6.50 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T10:15:00"
  },
  {
    "id": 3,
    "room": "303",
    "items": [
      { "name": "Grilled Salmon", "price": 28.00 },
      { "name": "White Wine (Bottle)", "price": 45.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T10:45:00"
  },
  {
    "id": 4,
    "room": "110",
    "items": [
      { "name": "Espresso Shot", "price": 3.50 },
      { "name": "Blueberry Muffin", "price": 4.50 },
      { "name": "Orange Juice (Fresh)", "price": 6.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T10:50:00"
  },
  {
    "id": 5,
    "room": "408",
    "items": [
      { "name": "Club Sandwich", "price": 14.00 },
      { "name": "Fries (Side)", "price": 4.50 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T10:20:00"
  },
  {
    "id": 6,
    "room": "215",
    "items": [
      { "name": "Local Craft Beer (2)", "price": 15.00 },
      { "name": "Nachos Grande", "price": 12.50 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T09:40:00"
  },
  {
    "id": 7,
    "room": "502",
    "items": [
      { "name": "Chocolate Cake Slice", "price": 8.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:05:00"
  },
  {
    "id": 8,
    "room": "312",
    "items": [
      { "name": "Still Water (Large)", "price": 4.00 },
      { "name": "Mixed Nuts Platter", "price": 9.00 }
    ],
    "status": "cancelled",
    "timestamp": "2025-10-28T09:00:00"
  },
  {
    "id": 9,
    "room": "401",
    "items": [
      { "name": "Breakfast Burrito", "price": 11.50 },
      { "name": "Black Coffee", "price": 3.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:00:00"
  },
  {
    "id": 10,
    "room": "105",
    "items": [
      { "name": "Ice Cream (Vanilla)", "price": 6.50 },
      { "name": "Hot Tea (Green)", "price": 4.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:15:00"
  },
  {
    "id": 11,
    "room": "510",
    "items": [
      { "name": "Cheeseburger (Well Done)", "price": 16.50 },
      { "name": "Milkshake (Chocolate)", "price": 7.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:20:00"
  },
  {
    "id": 12,
    "room": "208",
    "items": [
      { "name": "Fruit Platter", "price": 18.00 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T09:30:00"
  },
  {
    "id": 13,
    "room": "315",
    "items": [
      { "name": "Omelette (Cheese & Ham)", "price": 10.99 },
      { "name": "Toast (2 Slices)", "price": 2.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:35:00"
  },
  {
    "id": 14,
    "room": "405",
    "items": [
      { "name": "Sushi Set (Chef's Choice)", "price": 35.00 }
    ],
    "status": "cancelled",
    "timestamp": "2025-10-28T10:00:00"
  },
  {
    "id": 15,
    "room": "509",
    "items": [
      { "name": "Glass of Champagne", "price": 18.00 },
      { "name": "Strawberries (Side)", "price": 7.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:40:00"
  }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order => 
        order.room.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'room':
            comparison = a.room.localeCompare(b.room);
            break;
          case 'total':
            const totalA = a.items.reduce((sum, item) => sum + item.price, 0);
            const totalB = b.items.reduce((sum, item) => sum + item.price, 0);
            comparison = totalA - totalB;
            break;
          case 'time':
            comparison = new Date(a.timestamp) - new Date(b.timestamp);
            break;
          default:
            comparison = 0;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [orders, searchTerm, sortField, sortDirection]);

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'In Progress' },
      preparing: { color: 'info', label: 'Preparing' },
      delivered: { color: 'success', label: 'Delivering' },
      cancelled: { color: 'error', label: 'Cancelled' }
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = (event) => {
    if (event.target.checked) {
      setSelectedOrders(filteredAndSortedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  return (
    <Main open={drawerOpen} sx={{ p: '0 !important' }}>
      <Box sx={{ 
        width: '70vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'background.default',
        boxShadow: 3,
      }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Food Order
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search room number or food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={selectedOrders.length === 0}
            onClick={() => setSelectedOrders([])}
          >
            Clear Selection ({selectedOrders.length})
          </Button>

        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'background.paper', m: 2, borderRadius: 1 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredAndSortedOrders.length}
                      checked={selectedOrders.length > 0 && selectedOrders.length === filteredAndSortedOrders.length}
                      onChange={handleSelectAllOrders}
                    />
                  </TableCell>
                  <TableCell>
                    Room No
                    <IconButton size="small" onClick={() => handleSort('room')}>
                      <SortIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Order Details</TableCell>
                  <TableCell>
                    Total
                    <IconButton size="small" onClick={() => handleSort('total')}>
                      <SortIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow 
                      key={order.id} 
                      hover
                      selected={selectedOrders.includes(order.id)}
                      onClick={() => handleSelectOrder(order.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedOrders.includes(order.id)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {order.room}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {order.items.map((item, index) => (
                            <Typography key={index} variant="body2">
                              {item.name} - ${item.price.toFixed(2)}
                            </Typography>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" sx={{ fontWeight: 500 }}>
                          ${order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Received
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<SendIcon />}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Deliver
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Box sx={{ 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}>
          <TablePagination
            component="div"
            count={filteredAndSortedOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Rows Per Page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Box>
      </Box>
    </Main>
  );
};

export default FoodOrdering;
