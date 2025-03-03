//////////////////////////////////////////////////////////
//                                                      //
//                  JSON QUOTE FETCH                    //
//                                                      //
//////////////////////////////////////////////////////////

async function fetchQuote() {
    try {
        // Get the current real-world date
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const year = today.getFullYear();
        const todayKey = `${month}-${day}`;

        // Fetch the local JSON file
        const response = await fetch("quotes.json");
        const data = await response.json();

        let quote = null;

        // Check if today's date matches any holiday in the dataset
        for (const holidayName in data.holidays) {
            if (data.holidays.hasOwnProperty(holidayName)) {
                const holiday = data.holidays[holidayName];
                if (holiday.dates.includes(todayKey)) {
                    console.log(`Holiday match found: ${holidayName} for date ${todayKey}`);

                    // Use the year to consistently select a different quote each year
                    const quoteIndex = year % holiday.quotes.length;
                    quote = holiday.quotes[quoteIndex];

                    break;
                }
            }
        }

        // If no holiday match, select a general quote based on day-of-year
        if (!quote) {
            const startOfYear = new Date(today.getFullYear(), 0, 0);
            const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
            const quoteIndex = dayOfYear % data.general.length;
            quote = data.general[quoteIndex];
        }

        // Display the quote
        document.getElementById("quote").textContent = `"${quote.quote}" - ${quote.author || 'Unknown'}`;
    } catch (error) {
        document.getElementById("quote").textContent = "Failed to load quote.";
        console.error("Error fetching quote:", error);
    }
}

//////////////////////////////////////////////////////////
//                                                      //
//                       UPDATE DATE                    //
//                                                      //
//////////////////////////////////////////////////////////

function updateDate() {
    // Get the real-world current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date").textContent = today.toLocaleDateString("en-GB", options);
}

//////////////////////////////////////////////////////////
//                                                      //
//              AUTO REFRESH AT MIDNIGHT                //
//                                                      //
//////////////////////////////////////////////////////////

function scheduleMidnightRefresh() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;
    console.log(`Next refresh in: ${timeUntilMidnight / 1000} seconds`);
    setTimeout(() => {
        location.reload();
    }, timeUntilMidnight);
}

// Ensure the script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    updateDate();
    fetchQuote();
    scheduleMidnightRefresh();
});
