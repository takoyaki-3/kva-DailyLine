const API_ENDPOINT = 'https://kva-store.api.takoyaki3.com';

const add = async () => {
  const key = 'privateKey-' + loggedInUser.email + '@' + document.getElementById('key').value;
  const data = await encrypt(document.getElementById('add-data').value);
  document.getElementById('add-data').value = '';

  try {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authIdToken}` // Update with actual token retrieval method
        },
        body: JSON.stringify({ key, data, readable: 'public' }) // Assume public readability for simplicity
    })
    const respData = await response.json();
    console.log('Success:', respData);

    // add to display
    const dataDisplay = document.getElementById('data-display');
    const itmeElement = document.createElement('div');
    itmeElement.textContent = await decrypt(data);
    // add itemElement to top of dataDisplay
    dataDisplay.insertBefore(itmeElement, dataDisplay.firstChild);
} catch(error) {
    console.error('Error:', error);
  };
};

document.getElementById('add-button').addEventListener('click',async function() {
  await add();
});

document.getElementById('get-button').addEventListener('click', async function() {
  try {
    const key = 'privateKey-' + loggedInUser.email + '@' + document.getElementById('key').value;
    const response = await fetch(`${API_ENDPOINT}/?key=${key}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authIdToken}` // Update with actual token retrieval method
        },
    })
    const data = await response.json();
    console.log('Success:', data);

    const dataDisplay = document.getElementById('data-display');
    dataDisplay.innerHTML = '';
    data.map(async (item) => {
      const itmeElement = document.createElement('div');
      itmeElement.textContent = (await decrypt(item.data)) || 'No data found';
      dataDisplay.appendChild(itmeElement);
    });
  } catch(error){
    console.error('Error:', error);
  };
});

// document.getElementById('delete-button').addEventListener('click',async function() {
//   try {
//     const key = 'privateKey-' + loggedInUser.email + '@' + document.getElementById('key').value;
//     const response = await fetch(API_ENDPOINT, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authIdToken}` // Update with actual token retrieval method
//         },
//         body: JSON.stringify({ key })
//     })
//     const data = await response.json();
//     console.log('Success:', data);
//     alert('Line deleted successfully');
//   } catch(error) {
//     console.error('Error:', error);
//   };
// });

document.addEventListener('keydown', function(event) {
  // Enter key
  if (event.keyCode === 13) {
    add();
  }
});
