import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
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

const GET_ORDERS = gql`
  query GetOrders($search: String, $sortBy: String, $sortDirection: String) {
    orders(search: $search, sortBy: $sortBy, sortDirection: $sortDirection) {
      id
      room
      items {
        name
        price
      }
      status
      timestamp
    }
  }
`;


const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;


const BULK_UPDATE_STATUS = gql`
  mutation BulkUpdateStatus($ids: [ID!]!, $status: String!) {
    bulkUpdateStatus(ids: $ids, status: $status)
  }
`;

const FoodOrdering = ({ drawerOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('room');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_ORDERS, {
    variables: { 
      search: searchTerm, 
      sortBy: sortField, 
      sortDirection: sortDirection 
    },
    fetchPolicy: 'cache-and-network', 
  });

  const orders = data?.orders || [];

  
  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
    // 突变成功后，重新获取订单列表以更新 UI
    refetchQueries: [{ query: GET_ORDERS, variables: { 
      search: searchTerm, 
      sortBy: sortField, 
      sortDirection: sortDirection 
    } }],
  });
  
  
  const [bulkUpdate] = useMutation(BULK_UPDATE_STATUS, {
    refetchQueries: [{ query: GET_ORDERS, variables: { 
      search: searchTerm, 
      sortBy: sortField, 
      sortDirection: sortDirection 
    } }],
  });
  

  

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    if (loading || error || !data || !data.orders) {
      return [];
    }
    return data.orders; 
   
  }, [loading, error, data]);

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

  const handleUpdateStatus = (id, newStatus) => {
    updateStatus({
        variables: { id: String(id), status: newStatus },
    });
};

  if (loading) {
    return (
      <Main open={drawerOpen} sx={{ p: '0 !important' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Loading Orders...</Typography>
        </Box>
      </Main>
    );
  }

  if (error) {
    return (
       <Main open={drawerOpen} sx={{ p: '0 !important' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Error loading orders: {error.message}</Typography>
         </Box>
      </Main>
     );
  }

  

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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, 'In Progress'); 
                            }
                            }
                          >
                            Received
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<SendIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, 'Delivering');
                            }}
                          >
                            Deliver
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order.id, 'Canceled');
                            }}
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
