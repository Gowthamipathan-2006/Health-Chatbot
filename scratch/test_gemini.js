const apiKey = "AQ.Ab8RN6JO5_4gVaA8nKAyv16YhbQ9aIUriMkCI0Ys4vBM5BiOQA";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const requestBody = {
  contents: [{
    parts: [{
      text: "Hello, reply with a short greeting."
    }]
  }]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody)
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Data:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('Error:', err);
});
