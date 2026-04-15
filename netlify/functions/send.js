exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    const { subject, previewText, body, listId, campaignName } = JSON.parse(
      event.body
    );

    const scheduledAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 32px;color:#1a1a1a;line-height:1.8;font-size:15px">
${body
  .split("\n\n")
  .map((p) => `<p style="margin:0 0 18px">${p.replace(/\n/g, "<br/>")}</p>`)
  .join("")}
</body>
</html>`;

    const response = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        name: campaignName,
        subject,
        previewText: previewText || "",
        sender: { name: "MapYourGym", email: "info@mapyourgym.co.uk" },
        type: "classic",
        htmlContent,
        recipients: { listIds: [parseInt(listId)] },
        scheduledAt,
      }),
    });

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
