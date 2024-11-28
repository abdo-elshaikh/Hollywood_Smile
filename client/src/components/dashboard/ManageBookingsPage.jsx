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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Visibility, Delete, Done, Cancel } from "@mui/icons-material";
import bookingService from "../../services/bookingService";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import ConfirmationDialog from "../common/ConfirmationDialog";
import SendSMS from "../SendSMS";
import { useTheme } from "@mui/material/styles";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = useSnackbar();
  const statuses = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

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

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Cancelled" ? null : getNewStatus(currentStatus);
    if (!newStatus) return;

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
      await bookingService.deleteBooking(bookingIdToDelete);
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingIdToDelete));
      showSnackbar("Booking deleted successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to delete booking.", "error");
    } finally {
      setOpenDeleteDialog(false);
      setBookingIdToDelete(null);
      setLoadingDelete(false);
    }
  };

  const filteredBookings =
    activeTab === "All" ? bookings : bookings.filter((booking) => booking.status === activeTab);

  const columns = [
    { field: "code", headerName: "ID", hide: true, width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "date",
      width: 150,
      headerName: "Preferred Date",
      renderCell: (params) => (
        <Typography variant="body2">{new Date(params.value).toLocaleDateString()}</Typography>
      ),
    },
    {
      field: "time",
      width: 150,
      headerName: "Preferred Time",
      renderCell: (params) => <Typography variant="body2">{params.value}</Typography>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={bookStatusColor(params.value)}
          size="small"
          sx={{ fontWeight: "bold", width: "100%" }}
        />
      ),
    },
    {
      field: "actions",
      width: isMobile ? 300 : 400,
      headerName: "Actions",
      renderCell: (params) => {
        const currentStatus = params.row.status;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Tooltip title="View">
              <IconButton color="primary">
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send SMS">
              <IconButton color="primary">
                <SendSMS smsContent={params.row.message} phoneNumber={params.row.phone} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change Status">
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleChangeStatus(params.row.id, currentStatus)}
              >
                {currentStatus === "Cancelled" ? <Done /> : <Cancel />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setBookingIdToDelete(params.row.id);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Booking">
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                disabled={currentStatus === "Cancelled" || currentStatus === "Completed"}
                onClick={() => handleCancelStatus(params.row.id)}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
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

  return (
    <Box sx={{ padding: { xs: 1, sm: 3 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          marginBottom: { xs: 2, sm: 3 },
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Manage Online Bookings
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          marginBottom: { xs: 2, sm: 3 },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {statuses.map((status) => (
          <Tab key={status} label={status} value={status} />
        ))}
      </Tabs>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component={Paper}
          sx={{
            height: 500,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>
      )}

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteBooking}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        loading={loadingDelete}
      />
    </Box>
  );
};

export default ManageBookingsPage;
