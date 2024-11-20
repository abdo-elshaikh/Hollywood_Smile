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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Visibility, Delete, Done, Cancel } from "@mui/icons-material";
import bookingService from "../../services/bookingService";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import ConfirmationDialog from "../common/ConfirmationDialog";
import SendSMS from "../SendSMS";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  const bookingMessage = (booking) => {
    return `Hello ${booking.name}, your booking with code ${booking.code} has been ${booking.status.toLowerCase()}.`;
  };

  const filteredBookings =
    activeTab === "All" ? bookings : bookings.filter((booking) => booking.status === activeTab);

  const columns = [
    { field: "code", headerName: "ID", flex: 1, hide: true },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "date",
      headerName: "Preferred Date",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "time",
      headerName: "Preferred Time",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
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
      headerName: "Actions",
      flex: 2,
      renderCell: (params) => {
        const currentStatus = params.row.status;
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
            <Tooltip title="View">
              <IconButton color="primary">
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setBookingIdToDelete(params.row._id);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title={`${getNewStatus(currentStatus)} Booking` || currentStatus + " Booking"}>
              <IconButton
                variant="contained"
                color="success"
                size="small"
                disabled={currentStatus === "Cancelled" || currentStatus === "Completed"}
                onClick={() => handleChangeStatus(params.row.id, currentStatus)}
                sx={{ marginLeft: 1 }}
              >
                {/* {getNewStatus(currentStatus) || currentStatus} */}
                <Done />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Booking">
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                disabled={currentStatus === "Cancelled" || currentStatus === "Completed"}
                onClick={() => handleCancelStatus(params.row.id)}
                sx={{ marginLeft: 1 }}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
            <SendSMS smsContent={bookingMessage(params.row)} phoneNumber={params.row.phone} />
          </Box>
        );
      },
    },
  ];

  const rows = bookings.map((booking) => ({
    id: booking._id,
    name: booking.name,
    phone: booking.phone,
    date: booking.date,
    time: booking.time,
    status: booking.status,
    code: booking.code,
  }));

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: 3, fontWeight: "bold", textAlign: "center" }}
      >
        Manage Online Bookings
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} centered>
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
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            disableSelectionOnClick
            loading={loading}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "text.primary",
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
            }}
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
