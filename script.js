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

    // get date (should be based on data from server, but using client date for simplicity)
    const today = new Date().toISOString().split('T')[0];

    // add to existing card or create new card
    const diarySection = document.getElementById('diary-section');
    let card = document.querySelector(`.card[data-date="${today}"]`);
    if (!card) {
      // create new card
      card = await createCardForDate(today, [{data, created: today}]);
      diarySection.insertBefore(card, diarySection.firstChild);
    } else {
      // add to existing card
      const itemElement = document.createElement('p');
      itemElement.textContent = await decrypt(data);;
      card.insertBefore(itemElement, card.firstChild.nextSibling);
    }
  } catch(error) {
    console.error('Error:', error);
  }
};

document.getElementById('add-button').addEventListener('click', add);

const get = async () => {
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

    const groupedByDate = groupDataByDate(data);

    const diarySection = document.getElementById('diary-section');
    diarySection.innerHTML = '';
    await Object.keys(groupedByDate).forEach(async (date) => {
      const card = await createCardForDate(date, groupedByDate[date]);
      diarySection.appendChild(card);
    });
  } catch(error){
    console.error('Error:', error);
  };
}

document.getElementById('get-button').addEventListener('click', get);

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

function groupDataByDate(data) {
  const grouped = {};
  data.forEach(item => {
    const date = item.created.split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  return grouped;
}

async function createCardForDate(date, dataItems) {
  // create a card container
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-date', date);

  // add date title
  const title = document.createElement('h2');
  title.textContent = date;
  card.appendChild(title);

  // add line for each data card
  dataItems.forEach(async (item) => {
    const itemElement = document.createElement('p');
    itemElement.textContent = (await decrypt(item.data)) || 'No data found';
    card.appendChild(itemElement);
  });

  return card;
}

// get data from server on page load
get();
