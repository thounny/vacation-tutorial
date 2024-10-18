document
  .getElementById("costForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing

    //   Get form values
    const name = document.getElementById("name").value;
    const checkInDate = document.getElementById("checkInDate").value;
    const nights = parseInt(document.getElementById("nights").value);
    const roomType = document.querySelector(
      'input[name="roomType"]:checked'
    ).value;
    const discount = document.querySelector(
      'input[name="discount"]:checked'
    ).value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);

    // Validate occupancy for room type
    const maxOccupancy = getMaxOccupancy(roomType);
    if (adults + children > maxOccupancy) {
      document.getElementById(
        "messageDiv"
      ).innerText = `The room you selected will not hold your party. Maximum occupancy for this room is ${maxOccupancy}`;
      return;
    }

    //   Clears  the message
    document.getElementById("messageDiv").innerText = "";

    //   Calculate the total cost
    calculateCost(roomType, checkInDate, nights, discount);
  });

function getMaxOccupancy(roomType) {
  if (roomType === "queen") {
    return 5; // 5 people max in queen room
  } else if (roomType === "king") {
    return 2; // 2 people max in king room
  } else if (roomType === "suite") {
    return 6; // 6 people max in 2-bedroom Suite
  }
}

function getRoomRate(checkInDate, roomType) {
  const date = new Date(checkInDate);
  const month = date.getMonth() + 1; // Get Month (0 = jan.)

  let rate;
  if (month >= 6 && month <= 8) {
    // June to August shit is expensive
    if (roomType === "queen" || roomType === "king") {
      rate = 250;
    } else if (roomType === "suite") {
      rate = 350;
    }
  } else {
    //   Rest of Year Rates per night
    if (roomType === "queen" || roomType === "king") {
      rate = 150;
    } else if (roomType === "suite") {
      rate = 210;
    }
  }
  return rate;
}

function calculateCost(roomType, checkInDate, nights, discount) {
  // Get room rate
  const roomRate = getRoomRate(checkInDate, roomType);
  // Total before discount
  let totalRoomCost = roomRate * nights;

  let discountRate = 0;
  if (discount === "aaa") {
    discountRate = totalRoomCost * 0.1; // 10% discount old people
  } else if (discount === "military") {
    discountRate = totalRoomCost * 0.2; // 20% discount military
  }
  const discountedCost = totalRoomCost - discountRate;

  // Add 12% tax to the discounted cost
  const tax = discountedCost * 0.12;
  const totalCost = discountedCost + tax;

  // DISPLAY RESULTS
  document.getElementById("result").innerHTML = `
        <p>Room Rate per Night: $${roomRate.toFixed(2)}</p>
        <p>Number of Nights: ${nights}</p>
        <p>Discount Rate: $${discountRate.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <p><strong>Total Cost (tax included): $${totalCost.toFixed(
          2
        )}</strong></p>
    `;
}
