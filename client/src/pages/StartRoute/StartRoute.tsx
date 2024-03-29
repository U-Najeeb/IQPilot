import {
  Call,
  Close,
  Done,
  Hail,
  Route
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Modal,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { LatLngExpression } from "leaflet";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAxios from "../../api/useAxios";
import MapComponent from "../../components/Map";
import SelectedEmpsContext from "../../context/SelectedEmpsContext";
import SnackbarContext from "../../context/SnackbarContext";
import UserDataContext from "../../context/UserDataContext";
import RouteTypes from "../../types/RouteTypes";
import { SnackBarContextTypes } from "../../types/SnackbarTypes";
import UserContextTypes from "../../types/UserContextTypes";
import { UserTypes } from "../../types/UserTypes";
import AttendanceTypes from "../../types/attendanceTypes";
import baseURL from "../../utils/baseURL";
import { ColFlex, RowFlex } from "./../../style_extensions/Flex";
import ConvertTo12HourFormat from "./../../utils/12HourFormat";

type modalPropTypes = {
  openModal: boolean;
  currentPassenger?: UserTypes;
};

const socket = io(baseURL);

function StartRoute() {
  const location = useLocation();
  const route: RouteTypes = location.state;

  const { userData }: UserContextTypes =
    useContext(UserDataContext);

  const [myLocation, setMyLocation] = useState<Array<number>>([]);

  useEffect(() => {
    if (myLocation.length == 2) {
      const driverData = {
        name: userData?.fName[0] + ". " + userData?.lName,
        location: myLocation,
      };

      console.log(myLocation);

      socket.emit("live-drivers", driverData);
    }
  }, [socket, myLocation]);

  useEffect(() => {
    if (userData?.role === "driver") {
      navigator.geolocation.getCurrentPosition(() => {
        // setDriversPosition([pos.coords.latitude, pos.coords.longitude]);
        console.log("Permission granted");
      });

      // MAKE AN ERROR ALERT IF THE PERMISSION WAS REJECTED!

      // ASK FOR THE LOCATION PERMISSION FIRST !

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          // console.log("new pos : ",pos.coords);
          setMyLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          // timeout: 5000,
          maximumAge: 0,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const rangreth = [33.996807, 74.79202];
  const zaira = [34.1639168, 74.8158976];

  const { setSelectedEmps } = useContext(SelectedEmpsContext);

  // const [selectedPassengers, setSelectedPassengers] = useState<
  //   Array<UserTypes>
  // >([]);

  //   console.log(route);

  useEffect(() => {
    const passengersLatLons: any = route?.passengers?.map(
      (passenger: UserTypes) => passenger.pickup
    );

    setSelectedEmps([
      ...passengersLatLons,
      route?.office === "Rangreth" ? rangreth : zaira,
    ]);

    // const employeesLatLons: any = route?.passengers?.map(
    //   (passenger: UserTypes) => passenger?.pickup
    // );
    // setSelectedPassengers(employeesLatLons);
    // console.log(employeesLatLons);
  }, []);

  //   const { userData, setUserData }: UserContextTypes =
  //     useContext(UserDataContext);

  const { setOpenSnack }: SnackBarContextTypes = useContext(SnackbarContext);

  const [markedPassengersArray, setMarkedPassengersArray] = useState<
    Array<object>
  >([]);
  const navigate = useNavigate();

  const [modalProps, setModalProps] = useState<modalPropTypes>({
    openModal: false,
  });

  const handleModalOpen = (passenger: UserTypes) => {
    setModalProps({
      openModal: true,
      currentPassenger: passenger,
    });
    console.log("Modal Updated!");
  };

  const markAttendanceMF = (attendanceData: AttendanceTypes) => {
    return useAxios.post("attendance", attendanceData);
  };

  const MarkEmployeePresent = () => {
    return HandleCreateAttendance(true);
  };

  const MarkEmployeeAbsent = () => {
    return HandleCreateAttendance(false);
  };

  const updateRouteStatus = () => {
    return useAxios.patch(`route/${route?._id}`, {
      routeStatus: "completed",
      fuelConsumed: ((route?.totalDistance as number) / 15).toFixed(2),
    });
  };

  const { mutate: UpdateRoute, status: UpdateRouteStatus } = useMutation({
    mutationFn: updateRouteStatus,
    onSuccess: (data) => {
      console.log(data.data);
      setOpenSnack({
        open: true,
        message: `Route successfully completed!`,
        severity: "success",
      });
      navigate("/driver/routeCompleted", { state: data.data?.route });
    },
  });

  function HandleCompleteRoute() {
    UpdateRoute();
  }

  const { mutate: markAttendance } = useMutation({
    mutationFn: markAttendanceMF,
    onSuccess(data) {
      console.log(data.data);
      console.log(data.data.attendance);
      setModalProps({
        openModal: false,
      });
      setOpenSnack({
        open: true,
        message: `Attendance Marked for ${modalProps?.currentPassenger?.fName}`,
        severity: "success",
      });
      setMarkedPassengersArray((prevPassengers) => [
        ...prevPassengers,
        {
          passenger: data.data?.attendance?.ofEmployee,
          isPresent: data.data?.attendance?.isPresent,
        },
      ]);
    },
  });

  useEffect(() => {
    console.log(markedPassengersArray);
  }, [markedPassengersArray]);

  const isAttendanceMarked = (pid: string) => {
    let isMarked: any =
      markedPassengersArray.length &&
      markedPassengersArray.filter(
        (passenger: any) => passenger.passenger === pid
      );
    if (isMarked[0]?.isPresent === true) {
      isMarked = true;
    } else if (isMarked[0]?.isPresent === false) {
      isMarked = false;
    } else {
      isMarked = null;
    }
    //   console.log(isMarked)
    return isMarked;
  };

  function HandleCreateAttendance(isPresent: boolean) {
    const attendanceData: AttendanceTypes = {
      ofEmployee: modalProps?.currentPassenger?._id as any,
      isPresent: isPresent,
      ofRoute: route?._id as string,
      Driver: route?.driver as any,
    };
    console.log(attendanceData);
    markAttendance(attendanceData);
  }

  //   console.log(route);
  return (
    <Box
      sx={{
        ...ColFlex,
        width: "100%",
        minHeight: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {/* SCHEDULE A ROUTE MODAL */}
      <Modal
        sx={{ ...ColFlex, width: "100%", height: "100%" }}
        open={modalProps?.openModal}
        onClose={() => setModalProps({ openModal: false })}
      >
        <Box
          sx={{
            ...ColFlex,
            p: { xs: 1, lg: 2.5 },
            minHeight: "50vh",
            width: { xs: "100%", lg: "75%" },
            borderRadius: "5px",
            gap: 5,
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: "background.default",
          }}
        >
          {/* CALL OPTION */}
          <Box
            sx={{
              ...ColFlex,
              width: "100%",
              textAlign: "center",
              //   gap: "1px",
              marginTop: "15px",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Call {modalProps?.currentPassenger?.fName} ?
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "70%",
                fontWeight: 600,
                mb: "20px",
              }}
              variant="body1"
            >
              Do you want to make a call on{" "}
              {modalProps?.currentPassenger?.phone} ?
            </Typography>
            <ButtonBase
              component={"a"}
              href={`tel:${modalProps?.currentPassenger?.phone}`}
              // onClick={() => handleRemovePassengersFromCab(employee)}
              sx={{
                ...RowFlex,
                width: "25%",
                backgroundColor: "success.main",
                borderRadius: "100px",
              }}
            >
              <Call
                sx={{
                  borderRadius: "100px",
                  p: 1.75,
                  width: "60px",
                  height: "60px",
                  color: "white",
                }}
              />
            </ButtonBase>
          </Box>
          {/* OR Text */}
          <Typography
            sx={{ color: "text.secondary", width: "70%", fontWeight: 600 }}
            variant="body1"
          >
            OR
          </Typography>
          {/* ATTENDANCE OPTION */}
          <Box
            sx={{
              ...ColFlex,
              width: "100%",
              textAlign: "center",
              //   gap: "10px",
              marginTop: "15px",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              Mark Attendance
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                width: "70%",
                fontWeight: 600,
                mb: "30px",
              }}
              variant="body1"
            >
              Did employee board the cab from their current location?
            </Typography>
            <Box
              sx={{
                ...RowFlex,
                width: "50%",
                justifyContent: "space-between",
                mb: "15px",
              }}
            >
              <Close
                onClick={() => MarkEmployeeAbsent()}
                sx={{
                  borderRadius: "100px",
                  backgroundColor: "error.main",
                  p: 1.75,
                  width: "65px",
                  height: "65px",
                  color: "white",
                }}
              />
              <Done
                onClick={() => MarkEmployeePresent()}
                sx={{
                  borderRadius: "100px",
                  backgroundColor: "info.main",
                  p: 1.75,
                  width: "65px",
                  height: "65px",
                  color: "white",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* ROUTE STATS */}
      <Box
        sx={{
          ...RowFlex,
          width: "100%",
          justifyContent: "space-between",
          p: "15px",
          backgroundColor: "text.primary",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          {ConvertTo12HourFormat(route?.shiftTime as string).slice(0, -3)}
          <span style={{ fontSize: "1rem" }}>
            {ConvertTo12HourFormat(route?.shiftTime as string).slice(-2)}
          </span>
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {route?.totalDistance}
          <span style={{ fontSize: "1rem" }}>kms</span>
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {route?.estimatedTime}
          <span style={{ fontSize: "1rem" }}>mins</span>
        </Typography>
      </Box>
      {/* MAP */}
      <MapComponent height="50%" employees={route?.passengers as [UserTypes]} driverOnFocus={myLocation as LatLngExpression}/>
      {/* PASSENGER BOX */}
      <Box
        sx={{
          ...ColFlex,
          width: "95%",
          margin: "auto",
          my: "15px",
          padding: "15px",
          gap: "30px",
          color: "white",
          backgroundColor: "text.primary",
          borderRadius: "15px",
        }}
      >
        <Button
          disabled={UpdateRouteStatus === "pending"}
          onClick={HandleCompleteRoute}
          sx={{ width: "75%", borderRadius: "100px" }}
          variant="contained"
        >
          Mark as Completed
        </Button>
        {/* PASSENGERS */}
        <Box sx={{ ...ColFlex, width: "100%", gap: "15px" }}>
          {route?.passengers?.length &&
            route?.passengers.map((passenger: UserTypes) => {
              return (
                // Passenger
                <Box
                  key={passenger?._id}
                  sx={{
                    ...RowFlex,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      ...RowFlex,
                      width: "80%",
                      justifyContent: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <Avatar src={baseURL + userData?.profilePicture} sx={{ width: "30px", height: "30px" }} />
                    <Box>
                      <Typography variant="body1">
                        {passenger.fName + " " + passenger.lName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Route
                          sx={{
                            width: "12.5px",
                            height: "12.5px",
                            mr: "5px",
                            color: "secondary.main",
                          }}
                        />
                        {passenger.address}
                      </Typography>
                    </Box>
                  </Box>
                  {isAttendanceMarked(passenger._id as string) === true ? (
                    <Done />
                  ) : isAttendanceMarked(passenger._id as string) === false ? (
                    <Close />
                  ) : (
                    <ButtonBase
                      // component={"a"}
                      // href={`tel:${passenger?.phone}`}
                      onClick={() => handleModalOpen(passenger)}
                      sx={{
                        ...RowFlex,
                        width: "20%",
                        borderRadius: "100px",
                      }}
                    >
                      <Hail
                        sx={{
                          backgroundColor: "background.default",
                          borderRadius: "100px",
                          p: 1,
                          width: "35px",
                          height: "35px",
                          color: "text.primary",
                        }}
                      />
                    </ButtonBase>
                  )}
                </Box>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}

export default StartRoute;
