exports.handler = async () => {
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/contacts/lists?limit=50&offset=0",
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
