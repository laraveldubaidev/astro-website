document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('newsletter-form');
  const formStatus = document.getElementById('form-status');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const submitButton = document.getElementById('submit-button');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset messages
    formStatus.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";

    // Log the form fields
    // console.log("Form name field:", form.name);
    // console.log("Form email field:", form.email);

    const name = form.name ? form.name.value : null;
    const email = form.email ? form.email.value : null;
    
    // console.log("Form values extracted:", { name, email });

    try {
      // Create payload with the correct property names
      const payload = {
        FIRSTNAME: name,
        email: email
      };
      
      // Log what we're about to send
      // console.log("Submitting payload:", payload);
      // console.log("Payload as JSON string:", JSON.stringify(payload));

      // Let's try using a vanilla XMLHttpRequest to rule out any fetch API issues
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/subscribe', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          // console.log("XHR Response status:", xhr.status);
          // console.log("XHR Response text:", xhr.responseText);
          
          try {
            const result = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
              successMessage.classList.remove('hidden');
              form.reset();
            } else {
              errorMessage.classList.remove('hidden');
              // console.error('Error from server:', result);
            }
          } catch (parseError) {
            // console.error('Error parsing response:', parseError);
            errorMessage.classList.remove('hidden');
          } finally {
            submitButton.disabled = false;
            submitButton.innerText = "Subscribe";
          }
        }
      };
      
      // console.log("About to send payload...");
      xhr.send(JSON.stringify(payload));
      // console.log("Request sent");
      
      // Don't proceed with fetch
      return;


      // const result = await response.json();

      // if (response.ok) {
      //   successMessage.classList.remove('hidden');
      //   form.reset();
      // } else {
      //   errorMessage.classList.remove('hidden');
      //   console.error('Error from server:', result);
      // }
    } catch (error) {
      errorMessage.classList.remove('hidden');
      console.error('Network or JS error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerText = "Subscribe";
    }
  });
});
