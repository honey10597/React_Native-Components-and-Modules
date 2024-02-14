const _setInitialSetup = () => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    var _formattedPickupDate = currentDate.toISOString().slice(0, 10);

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);
    var _formattedReturnDate = currentDate.toISOString().slice(0, 10);

    console.log(_formattedPickupDate, "newSelectedDatesnewSelectedDatesnewSelectedDates");

    setSelectedDates([String(_formattedPickupDate), String(_formattedReturnDate)])

    var _time = moment().format('LT')
    var timeSuffix;

    if (_time.includes("AM")) {
      _time = _time.replace("AM", "")
      timeSuffix = "AM"
    } else if (_time.includes("PM")) {
      _time = _time.replace("PM", "")
      timeSuffix = "PM"
    }

    setPickTimeDate((prevData) => ({
      ...prevData,
      date: _formattedPickupDate,
      dateAndTime: String(_formattedPickupDate + " " + pickTimeDate?.time + "" + pickTimeDate?.period)
    }))

    setReturnPickTimeDate((prevData) => ({
      ...prevData,
      date: _formattedReturnDate,
      dateAndTime: String(_formattedReturnDate + " " + returnTimeDate?.time + "" + returnTimeDate?.period)
    }))

    var address = ""

    if (Array.isArray(locationCoords?.address) && locationCoords?.address.length > 0) {
      address = locationCoords?.address[0]?.locality || locationCoords?.address[0]?.subAdminArea
    } else if (typeof locationCoords?.address === "object") {
      address = locationCoords?.address?.locality || locationCoords?.address?.subAdminArea
    } else {
      address = locationCoords?.address
    }

    const _coords = {
      latitude: locationCoords?.latitude,
      longitude: locationCoords?.longitude,
      address: address
    }

    console.log(_coords, "_coords_coords_coords");

    setDropLocationData([
      {
        type: 'pickup',
        address: _coords?.address,
        location: { latitude: _coords?.latitude, longitude: _coords?.longitude },
      },
      {
        type: 'dropOff',
        address: _coords?.address,
        location: { latitude: _coords?.latitude, longitude: _coords?.longitude },
      },
    ]);


    var pickupData = {
      latitude: _coords?.latitude || 30.733315,
      longitude: _coords?.longitude || 76.779419,
      address: _coords?.address || "Chandigarh",
      time: String(_formattedPickupDate + " " + pickTimeDate?.time + "" + pickTimeDate?.period) || moment().format('YYYY-MM-DD hh:mm a'),
    }

    let _payload = {
      data: {
        pickup: pickupData,
        dropOff: {
          ...pickupData,
          time: String(_formattedReturnDate + " " + returnTimeDate?.time + "" + returnTimeDate?.period) || moment().format('YYYY-MM-DD hh:mm a'),
        },
        service: 'rental',
      },
    }

    _getAllAvailableCars(_payload)
  }
