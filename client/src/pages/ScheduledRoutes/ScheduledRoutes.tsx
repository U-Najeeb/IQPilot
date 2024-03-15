import {
  AccessTime,
  DeleteForever,
  EditLocation,
  MoreHoriz,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useState } from "react";
import PageContainer from "../../components/ui/PageContainer";
import RouteTypes from "../../types/RouteTypes";
import ConvertTo12HourFormat from "../../utils/12HourFormat";
import useCachedData from "./../../hooks/useCachedData";
import { ColFlex, RowFlex } from "./../../style_extensions/Flex";

type routeCacheTypes = {
  nonActiveroutes: [RouteTypes];
};

function ScheduledRoutes() {
  const cachedRoutes: routeCacheTypes = useCachedData("All Assigned Routes");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleMenuOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(!openMenu);
  };

  const routes = cachedRoutes?.nonActiveroutes;

  console.log(cachedRoutes?.nonActiveroutes);

  return (
    <PageContainer
      headerText={`Scheduled Routes (${routes?.length || 0})`}
      subHeadingText="All of your scheduled routes are here."
    >
      <Box sx={{ ...ColFlex, width: "100%" }}>
        <TableContainer sx={{}}>
          <Table sx={{ minWidth: 650 }} aria-label="routes table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Shift time</TableCell>
                <TableCell align="left">Driver</TableCell>
                <TableCell align="center">Pickup/Drop</TableCell>
                <TableCell align="center">Distance</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes?.length &&
                routes?.map((route) => (
                  <TableRow
                    key={route._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                          fontWeight: 600,
                        }}
                      >
                        <AccessTime />
                        {ConvertTo12HourFormat(route.shiftTime as string)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* <Avatar sx={{ width: "30px", height: "30px" }} /> */}
                        {/* {route.driver?.fName + " " + route.driver?.lName} */}
                        {route.driver?.fName[0] + ". " + route.driver?.lName}{" "}
                        {/* Cut the fName like B. Ahmed */}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      {(route.typeOfRoute?.charAt(0).toUpperCase() as string) +
                        route.typeOfRoute?.slice(1, 99)}
                    </TableCell>
                    <TableCell align="center">
                      {route.totalDistance} km
                    </TableCell>
                    <TableCell align="center">
                      {route.routeStatus === "notStarted"
                        ? "Not Started"
                        : route.routeStatus === "inProgress"
                        ? "In Progress"
                        : "Completed"}
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
                          View Route
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
                          Edit Route
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
                          Delete Route
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

export default ScheduledRoutes;
