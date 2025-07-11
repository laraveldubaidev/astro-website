export const prerender = false; // 👈 This is critical!

import SibApiV3Sdk from 'sib-api-v3-sdk';
const { ContactsApi, ApiClient } = SibApiV3Sdk;

export async function POST({ request }) {
  let body;
console.log("request");
  try {
    const rawText = await request.text();  // ✅ FIX: Get raw body
      console.log("🔍 RAW REQUEST BODY:", rawText);
    body = JSON.parse(rawText);            // ✅ FIX: Parse it yourself
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return new Response(
      JSON.stringify({ message: 'Invalid JSON in request body' + request.text()}),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { email, FIRSTNAME } = body;


  if (!email || !FIRSTNAME) {
    return new Response(
      JSON.stringify({ message: 'Missing email or FIRSTNAME in request body' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Setup Brevo client
  const apiClient = ApiClient.instance;
  const apiKey = apiClient.authentications['api-key'];
  apiKey.apiKey = import.meta.env.BREVO_API_KEY;

  const contactsApi = new ContactsApi();

  try {
    await contactsApi.createContact({
      email,
      attributes: { FIRSTNAME },
      listIds: [8], // Your real Brevo list ID
      updateEnabled: true,
    });

    return new Response(
      JSON.stringify({ message: 'Successfully subscribed!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorText = error?.response?.text
      ? await error.response.text()
      : error.message;

    console.error('Brevo API Error:', errorText);

    return new Response(
      JSON.stringify({
        message: 'Subscription failed, please try again later.',
        details: errorText,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
