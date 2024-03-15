import {
  DeleteForever,
  EditLocation,
  MoreHoriz,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import { UserTypes } from "../../types/UserTypes";
import baseURL from "../../utils/baseURL";
import useCachedData from "./../../hooks/useCachedData";
import { ColFlex, RowFlex } from "./../../style_extensions/Flex";

type driverTypes = {
  drivers: [UserTypes];
};

function AllCabDrivers() {
  const cachedDrivers: driverTypes = useCachedData("All Cabs");

  const drivers = cachedDrivers?.drivers;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleMenuOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(!openMenu);
  };

  //   console.log(cachedDrivers?.drivers);

  return (
    <PageContainer
      headerText={`All Cab Drivers (${drivers?.length || 0})`}
      subHeadingText="All cab drivers that part of your company."
    >
      <Box sx={{ ...ColFlex, width: "100%" }}>
        <TableContainer sx={{}}>
          <TextField
            variant="outlined"
            size="small"
            // value={searchField}
            // onChange={SearchEmployees}
            placeholder="Search Drivers"
            InputProps={{
              startAdornment: (
                <IconButton aria-label="search">
                  <Search />
                </IconButton>
              ),
            }}
          />
          <Table sx={{ minWidth: 650 }} aria-label="driver's table">
            <TableHead>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell align="center">Cab Number</TableCell>
                <TableCell align="center">Number Plate</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers?.length &&
                drivers?.map((driver) => (
                  <TableRow
                    key={driver._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <Avatar
                          src={baseURL + driver?.profilePicture}
                          sx={{ width: "30px", height: "30px" }}
                        />
                        {driver.fName + " " + driver.lName}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {driver.cabDetails?.cabNumber}
                    </TableCell>
                    <TableCell align="center">
                      {driver.cabDetails?.numberPlate}
                    </TableCell>
                    <TableCell align="center">
                      {!driver.cancelCab ? "Active" : "Suspended"}
                    </TableCell>
                    <TableCell align="center">
                      <MoreHoriz
                        sx={{ cursor: "pointer" }}
                        onClick={handleMenuOpen}
                      />
                      <Menu
                        elevation={1}
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => setOpenMenu(!openMenu)}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          sx={{
                            ...RowFlex,
                            color: "info.main",
                            fontWeight: 600,
                            justifyContent: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <Visibility sx={{}} />
                          View Details
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          sx={{
                            ...RowFlex,
                            color: "warning.main",
                            fontWeight: 600,
                            justifyContent: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <EditLocation sx={{}} />
                          Edit Details
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          sx={{
                            ...RowFlex,
                            color: "error.main",
                            fontWeight: 600,
                            justifyContent: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <DeleteForever sx={{}} />
                          Remove Driver
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageContainer>
  );
}

export default AllCabDrivers;
