const timeout = 10000; // Timeout after 10 seconds
const url = "http://192.168.1.30:8080/SendSMS";
const username = "abdo";
const password = "123";
const phone = "01555259191";
const message = "Welcome to our website!\nWe hope you enjoy your stay!\n\nBest regards,\nAbdo";

const handleSendSMS = async () => {
  try {
    const response = await fetch(
      `${url}?username=${username}&password=${password}&phone=${phone}&message=${message}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: timeout,
      });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error(error);

  }
};

handleSendSMS();
