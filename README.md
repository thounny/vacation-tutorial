# **Building a Room Cost Estimator with JavaScript for Beginners**

### **What Will This Estimator Do?**

1. Allow users to select a room type (Queen, King, or Suite).
2. Let users choose the number of nights they want to stay.
3. Apply any discounts (e.g., AAA/Senior or Military).
4. Calculate the room cost, apply tax, and display the total.

---

### **STEP_1: Handling Form Submission**

First, we need to capture what the user submits in the form. We'll use JavaScript to prevent the page from refreshing when the form is submitted, allowing us to handle the calculation without losing the input.

```javascript
document.getElementById("costForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the page from reloading

    // 1. Get the values from the form
    const name = document.getElementById("name").value;
    const checkInDate = document.getElementById("checkInDate").value;
    const nights = parseInt(document.getElementById("nights").value);
    const roomType = document.querySelector('input[name="roomType"]:checked').value;
    const discount = document.querySelector('input[name="discount"]:checked').value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);

    // 2. Check room occupancy
    const maxOccupancy = getMaxOccupancy(roomType);
    if (adults + children > maxOccupancy) {
        document.getElementById("messageDiv").innerText = `The room you selected cannot hold your group. Max occupancy is ${maxOccupancy}.`;
        return;
    }

    // 3. Clear previous messages and calculate the cost
    document.getElementById("messageDiv").innerText = "";
    calculateCost(roomType, checkInDate, nights, discount);
});
```

#### **WHAT IT DOES**

- **Form submission**: The form listens for the "submit" event, and `event.preventDefault()` prevents the page from refreshing so we can handle the input with JavaScript.
- **Getting form values**: We retrieve the values from the form, like the user’s name, the number of nights, the room type, etc.
- **Room occupancy check**: We use a function to check if the number of guests exceeds the room’s maximum occupancy. If it does, we show an error message.

---

### **STEP_2: Checking Maximum Occupancy**

Now, let's create the function that checks how many people can stay in each room type. This function is important because the hotel rooms have limits on how many guests they can accommodate.

```javascript
function getMaxOccupancy(roomType) {
    if (roomType === "queen") {
        return 5; // Queen rooms can hold up to 5 people
    } else if (roomType === "king") {
        return 2; // King rooms can hold up to 2 people
    } else if (roomType === "suite") {
        return 6; // 2-Bedroom Suites can hold up to 6 people
    }
}
```

#### **WHAT IT DOES**

- **Room types**: Each room type (Queen, King, Suite) has a different maximum occupancy.
  - **Queen room**: Max occupancy is 5 people.
  - **King room**: Max occupancy is 2 people.
  - **Suite**: Max occupancy is 6 people.
- If the number of adults + children exceeds the limit, we show an error and stop the calculation.

---

### **STEP_3: Calculating the Room Rate Based on Date**

Next, we calculate the nightly room rate based on the **check-in date** and **room type**. The rates are higher during the high season (June to August) and lower during the rest of the year.

```javascript
function getRoomRate(checkInDate, roomType) {
    const date = new Date(checkInDate); // Convert the check-in date to a Date object
    const month = date.getMonth() + 1; // Get the month (months are 0-indexed)

    let rate; // Variable to store the room rate

    // High season (June to August) rates are more expensive
    if (month >= 6 && month <= 8) {
        if (roomType === "queen" || roomType === "king") {
            rate = 250; // Queen or King room costs $250 per night in high season
        } else if (roomType === "suite") {
            rate = 350; // Suites cost $350 per night in high season
        }
    } else {
        // Off-season rates for the rest of the year
        if (roomType === "queen" || roomType === "king") {
            rate = 150; // Queen or King room costs $150 per night in off-season
        } else if (roomType === "suite") {
            rate = 210; // Suites cost $210 per night in off-season
        }
    }

    return rate; // Return the room rate
}
```

#### **WHAT IT DOES**

- **Date calculation**: We use the JavaScript `Date` object to extract the month from the check-in date.
- **High season (June - August)**: Rates are higher during these months.
  - Queen and King rooms: $250 per night.
  - Suites: $350 per night.
- **Off-season (rest of the year)**: Rates are lower.
  - Queen and King rooms: $150 per night.
  - Suites: $210 per night.

---

### **STEP_4: Calculating the Total Cost**

Finally, we calculate the total cost of the stay. We apply any discounts and then add tax to get the final total.

```javascript
function calculateCost(roomType, checkInDate, nights, discount) {
    // 1. Get the room rate per night
    const roomRate = getRoomRate(checkInDate, roomType);

    // 2. Calculate the total room cost before discounts
    let totalRoomCost = roomRate * nights;

    // 3. Apply the discount (if any)
    let discountRate = 0; // Start with no discount
    if (discount === "aaa") {
        discountRate = totalRoomCost * 0.1; // 10% discount for AAA/Senior
    } else if (discount === "military") {
        discountRate = totalRoomCost * 0.2; // 20% discount for Military
    }

    // Subtract the discount from the total room cost
    const discountedCost = totalRoomCost - discountRate;

    // 4. Calculate the tax (12% of the discounted total cost)
    const tax = discountedCost * 0.12;

    // 5. Calculate the final total cost, including tax
    const totalCost = discountedCost + tax;

    // 6. Display the results on the page
    document.getElementById("result").innerHTML = `
        <p>Room Rate per Night: $${roomRate.toFixed(2)}</p> <!-- Show the nightly room rate -->
        <p>Number of Nights: ${nights}</p> <!-- Show the number of nights -->
        <p>Discount Amount: $${discountRate.toFixed(2)}</p> <!-- Show the discount applied -->
        <p>Tax: $${tax.toFixed(2)}</p> <!-- Show the tax amount -->
        <p><strong>Total Cost (with tax): $${totalCost.toFixed(2)}</strong></p> <!-- Show the final total cost -->
    `;
}
```

#### **WHAT IT DOES**

- **Room rate**: We calculate the room rate per night using the `getRoomRate()` function.
- **Total room cost**: We multiply the room rate by the number of nights to get the total cost before discounts.
- **Applying discounts**: If the user selects **AAA/Senior** or **Military**, we apply a discount (10% or 20%, respectively).
- **Tax**: We add 12% tax to the discounted room cost.
- **Displaying results**: The total cost (with a breakdown) is displayed on the page for the user to see.

---

### **Conclusion**

- **1. Get Form Values**: When the user submits the form, the code first grabs all the input values from the form (name, check-in date, number of nights, etc.).
- **2. Validate Occupancy**: The script checks if the number of guests exceeds the room’s maximum occupancy and shows an error if it does.
- **3. Calculate Room Cost**: Based on the selected room type and the check-in date, the script calculates the nightly rate, multiplies it by the number of nights, and applies any discounts.
- **4. Add Tax**: The script adds a 12% tax to the discounted room cost.
- **5. Display the Result**: The final cost (with a breakdown) is shown to the user in the result section.

And that’s it! We’ve built a simple yet functional **Room Cost Estimator** using **JavaScript**.

---

## Author

![Logo](./assets/index_dwn.gif)

**Thounny Keo**  
Creative Developer & Designer  
Frontend Development Student | Year Up United

---

![miku](./assets/miku.gif)