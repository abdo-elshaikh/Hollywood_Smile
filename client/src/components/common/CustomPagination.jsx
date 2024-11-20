import React from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBackIosNew, ArrowForwardIos, LastPage, FirstPage } from "@mui/icons-material";

const CustomPagination = ({ total, page, setPage, rowsPerPage, itemName }) => {
  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mt: 1,
        mb: 3,
        // bgcolor: "",
        borderRadius: 1,
        // boxShadow: 2,
        width: "100%",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {Math.min((page - 1) * rowsPerPage + 1, total)} to{" "}
        {Math.min(page * rowsPerPage, total)} of {total} {itemName}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* First page button */}
        <FirstPage
          sx={{
            color: page > 1 ? "primary.main" : "text.disabled",
            cursor: page > 1 ? "pointer" : "default",
            "&:hover": {
              color: page > 1 ? "primary.dark" : "text.disabled",
            },
          }}
          onClick={() => page > 1 && setPage(1)}
        />

        <Pagination
          count={totalPages || 5}
          page={page || 1}
          onChange={handleChange}
          color="primary"
          sx={{ mx: 1 }}
          shape="circular"
          size="large"
        />

        {/* Last page button */}
        <LastPage
          sx={{
            color: page < totalPages ? "primary.main" : "text.disabled",
            cursor: page < totalPages ? "pointer" : "default",
            "&:hover": {
              color: page < totalPages ? "primary.dark" : "text.disabled",
            },
          }}
          onClick={() => page < totalPages && setPage(totalPages)}
        />
      </Box>
    </Box>
  );
};

export default CustomPagination;
