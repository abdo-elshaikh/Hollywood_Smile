import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Paper,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Done, Cancel, Edit, Send, MoreVert, ExpandMore } from "@mui/icons-material";
import bookingService from "../../services/bookingService";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import SendSMS from "../SendSMS";
import WhatsAppMessage from "../common/WhatsAppMessage";
import { useTheme } from "@mui/material/styles";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ConfirmDialog, setConfirmDialog] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = useSnackbar();
  const statuses = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

  const bookStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "secondary";
      case "Cancelled":
        return "error";
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data.data);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Error fetching bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Cancelled" ? null : getNewStatus(currentStatus);
    if (!newStatus) {
      showSnackbar("Cannot update status.", "error");
      return;
    };

    try {
      await bookingService.updateBooking(id, { status: newStatus });
      fetchBookings();
      showSnackbar("Status updated successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to update status.", "error");
    }
  };

  const handleCancelStatus = async (id) => {
    try {
      await bookingService.updateBooking(id, { status: "Cancelled" });
      fetchBookings();
      showSnackbar("Booking cancelled successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to cancel booking.", "error");
    }
  };

  const handleDeleteBooking = async () => {
    setLoadingDelete(true);
    try {
      await bookingService.deleteBooking(selectedBooking.id);
      setBookings((prev) => prev.filter((booking) => booking._id !== selectedBooking.id));
      fetchBookings();
      showSnackbar("Booking deleted successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to delete booking.", "error");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedBooking(null);
      setLoadingDelete(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;
    if (!selectedBooking.date || !selectedBooking.time) {
      showSnackbar("Please select a date and time.", "error");
      return;
    }
    if (new Date(selectedBooking.date) < new Date()) {
      showSnackbar("Cannot confirm booking for a past date.", "error");
      return;
    }

    selectedBooking.status = "Confirmed";
    setLoadingConfirm(true);
    try {
      await bookingService.updateBooking(selectedBooking.id, selectedBooking);
      fetchBookings();
      showSnackbar("Booking confirmed successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to confirm booking.", "error");
    } finally {
      setConfirmDialog(false);
      setSelectedBooking(null);
      setLoadingConfirm(false);
    }
  };

  const getNewStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "Confirmed";
      case "Confirmed":
        return "In Progress";
      case "In Progress":
        return "Completed";
      default:
        return null;
    }
  };

  const handleContextMenu = (event, booking) => {
    event.preventDefault();
    setSelectedBooking(booking);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const filteredBookings = activeTab === "All" ? bookings : bookings.filter((booking) => booking.status === activeTab);

  const columns = [
    {
      field: "actions", headerName: "#", flex: 0.2, renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={(event) => handleContextMenu(event, params.row)}>
            <MoreVert color="primary.main" />
          </IconButton>
        </Box>
      )
    },
    { field: "code", headerName: "ID", hide: true, flex: true, },
    {
      field: "status",
      headerName: "Status",
      flex: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={bookStatusColor(params.value)}
          size="small"
          sx={{ fontWeight: "bold", width: "100%" }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: true, },
    { field: "phone", headerName: "Phone", flex: true, },
    ,
    {
      field: "date",
      flex: true,
      headerName: "Preferred Date",
      renderCell: (params) => (
        <Typography variant="body2">{new Date(params.value).toLocaleDateString()}</Typography>
      ),
    },
    {
      field: "time",
      flex: true,
      headerName: "Preferred Time",
      renderCell: (params) => <Typography variant="body2">{params.value}</Typography>,
    },

  ];

  const rows = filteredBookings.map((booking) => ({
    id: booking._id,
    name: booking.name,
    phone: booking.phone,
    date: booking.date,
    time: booking.time,
    status: booking.status,
    code: booking.code,
  }));

  const TableViewCell = ({ row }) => (
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={
          <Accordion
            sx={{ width: "100%" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{row?.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>Phone:</strong> {row?.phone}
              </Typography>
              <Typography>
                <strong>Date:</strong> {row?.date.slice(0, 10)}
              </Typography>
              <Typography>
                <strong>Time:</strong> {row?.time}
              </Typography>
              <Typography>
                <strong>Code:</strong> {row?.code}
              </Typography>
            </AccordionDetails>
          </Accordion>
        }
        secondary={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Chip
              label={row?.status}
              color={bookStatusColor(row?.status)}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
            <IconButton onClick={(event) => handleContextMenu(event, row)}>
              <MoreVert />
            </IconButton>
          </Box>
        }
      />
    </ListItem>
  );

  return (
    <Box >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
        >
          {statuses.map((status) => (
            <Tab key={status} label={status} value={status} />
          ))}
        </Tabs>
      </Box>
      <Paper sx={{ height: 'calc(100vh - 250px)', width: '100%', overflow: 'auto' }}>
        {!isMobile ?
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 20]}
            autoPageSize
            pagination
            autoHeight
            disableSelectionOnClick
            initialState={{
              density: "compact",
              sortBy: [{ field: "date", order: "desc" }],
            }}
            slots={{
              toolbar: GridToolbar,
              noRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {loading ? <CircularProgress /> : <Typography>No bookings found.</Typography>}
                </Stack>
              ),
              noResultsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  <Typography>No results found.</Typography>
                </Stack>
              ),
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}

          />
          :
          <Box sx={{ height: 'calc(100vh - 250px)', p: 2 }}>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflow: "auto",
                maxHeight: "calc(100vh - 250px)",
              }}
            >
              {rows.map((row) => (
                <TableViewCell key={row.id} row={row} />
              ))}
            </List>

          </Box>
        }
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteBooking} color="error" disabled={loadingDelete}>
            {loadingDelete ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={ConfirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography>Confirm Booking</Typography>
          <IconButton onClick={() => setConfirmDialog(false)}>
            <Cancel />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to confirm this booking?</Typography>
          <Divider sx={{ my: 1 }} />
          <TextField
            margin="dense"
            id="name"
            label="Patient Name"
            type="text"
            variant="outlined"
            value={selectedBooking?.name}
            disabled
            fullWidth
            size="small"
          />

          <TextField
            margin="normal"
            id="prferredDate"
            label="Preferred Date"
            type="text"
            variant="outlined"
            value={selectedBooking?.date.slice(0, 10)}
            disabled
            size="small"
          />

          <TextField
            margin="normal"
            id="prferredTime"
            label="Preferred Time"
            type="text"
            variant="outlined"
            value={selectedBooking?.time}
            disabled
            sx={{ ml: 2 }}
            size="small"
          />

          {/* date */}
          <Typography variant="body2">Change Date & Time</Typography>
          <Divider sx={{ my: 1 }} />
          <TextField
            margin="dense"
            id="date"
            label="Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={
              selectedBooking?.date
                ? new Date(selectedBooking.date).toISOString().slice(0, 16)
                : ''
            }
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate)) {
                setSelectedBooking({
                  ...selectedBooking,
                  date: newDate.toISOString(),
                  time: newDate.toLocaleTimeString(),
                });
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            color="primary"
            disabled={loadingConfirm}
            startIcon={loadingConfirm && <CircularProgress size={24} />}
          >
            {loadingConfirm ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        open={Boolean(contextMenu)}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleChangeStatus(selectedBooking.id, selectedBooking?.status);
            handleCloseContextMenu();
          }}
          disabled={selectedBooking?.status === "Completed"}
        >
          <ListItemIcon>
            <Done />
          </ListItemIcon>
          <ListItemText>
            {getNewStatus(selectedBooking?.status) || "Update Status"} Booking
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setConfirmDialog(true);
            handleCloseContextMenu();
          }}
          disabled={selectedBooking?.status !== "Pending"}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>
            Change Date & Time Booking
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCancelStatus(selectedBooking.id);
            handleCloseContextMenu();
          }}
          disabled={selectedBooking?.status !== "Pending"}
        >
          <ListItemIcon>
            <Cancel />
          </ListItemIcon>
          <ListItemText>Cancel Booking</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleCloseContextMenu();
          }}
          disabled={selectedBooking?.status !== "Completed"}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete Booking</ListItemText>
        </MenuItem>
        <Divider />
        <SendSMS
          phoneNumber={selectedBooking?.phone}
          smsContent={`
            مرحبًا ${selectedBooking?.name} ، تم تأكيد حجزك. التاريخ: ${selectedBooking?.date.split("T")[0]}, الوقت: ${selectedBooking?.time}. يرجى ملاحظة رمز الحجز الخاص بك: ${selectedBooking?.code}. يرجى التأكد من الحضور في الوقت المحدد.
            `}
          status={selectedBooking?.status}
        />

        <WhatsAppMessage
          phone={selectedBooking?.phone}
          text={`Hello ${selectedBooking?.name}, your booking has been confirmed. Date: ${selectedBooking?.date.split("T")[0]}, Time: ${selectedBooking?.time}. Please note your booking code: ${selectedBooking?.code}. Please be on time.`}
          status={selectedBooking?.status}
        />

      </Menu>
    </Box>
  );
};

export default ManageBookingsPage;
