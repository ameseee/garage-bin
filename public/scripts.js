const fetchAscendingItems = () => {
  fetch('/api/v1/garageItems')
  .then(response => response.json())
  .then(garageItems => alphabetizeItems(garageItems))
  .catch(() => console.log('error in fetch items'))
};

const fetchDescendingItems = () => {
  fetch('/api/v1/garageItems')
  .then(response => response.json())
  .then(garageItems => unalphabetizeItems(garageItems))
  .catch(() => console.log('error in fetch items'))
};

const alphabetizeItems = (garageItems) => {
  const sorted = garageItems.sort((a, b) => {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  })
  appendItems(sorted);
  countItems(sorted);
};

const unalphabetizeItems = (garageItems) => {
  const sorted = garageItems.sort((a, b) => {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA > nameB) { return -1; }
    if (nameA < nameB) { return 1; }
    return 0;
  })
  appendItems(sorted);
  countItems(sorted);
};

const appendItems = (garageItems) => {
  $('.items').html('');
  return garageItems.forEach(garageItem => {
    $('.items').append(`
      <aside class="item">
        <h4 id="item-name">${garageItem.name}</h4>
        <div class="hidden">
          <p id="item-reason">${garageItem.reason}</p>
          <p id="item-cleanliness">${garageItem.cleanliness}</p>
          <select id="update-cleanliness" name="cleanliness">
            <option value="sparkling">sparkling</option>
            <option value="dusty">dusty</option>
            <option value="rancid">rancid</option>
          </select>
          <button type="button" name="button" id="update-submit" >submit</button>
        </div>
      </aside>
    `);
  });
};

const countByCleanliness = (garageItems, level) => {
  const filtered = garageItems.filter(item => item.cleanliness === level);
  return filtered.length;
};

const countItems = (items) => {
  $('#total-garage').text(`Items Hoarded: ${items.length}`);
  $('#total-sparkling').text(`Sparkling Items: ${countByCleanliness(items, 'sparkling')}`);
  $('#total-dusty').text(`Dusty Items: ${countByCleanliness(items, 'dusty')}`);
  $('#total-rancid').text(`Rancid Items: ${countByCleanliness(items, 'rancid')}`);
};

const postHeader = (body) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

const addItem = (event) => {
    event.preventDefault();
    let name = $('#new-name').val();
    let reason = $('#new-reason').val();
    let cleanliness = $('#new-cleanliness option:selected').text();

    fetch('/api/v1/garageItems', postHeader({ name, reason, cleanliness }))
    .then(response => {
      if (response.status === 201) { return response.json(); }
    })
    .then(() => fetchItems())
    .catch((error) => {
      throw error;
    })

    $('#new-name').val('');
    $('#new-reason').val('');
};

const toggleDoor = () => {
  $('.garage').slideToggle();

  $('#all-info').hasClass('hide-info')
  ? $('#all-info').removeClass('hide-info')
  : $('#all-info').addClass('hide-info');
};

const toggleListOrder = () => {
  if ($('#switch-list-order').hasClass('alphabetize')) {
    $('#switch-list-order').removeClass('alphabetize');
    $('#switch-list-order').text('Show Descending');
    fetchAscendingItems();
  } else {
    $('#switch-list-order').addClass('alphabetize');
    $('#switch-list-order').text('Show Ascending');
    fetchDescendingItems();
  }
};

const toggleItemInfo = (event) => {
  console.log($(event.target).next('div'));
  $(event.target).next('div').toggleClass('hidden')
};

const updateItem = (event) => {
  console.log(event.target.previousElementSibling);
};

$('div').on('click', 'button', addItem);
$('.remote').on('click', toggleDoor);
$('#switch-list-order').on('click', toggleListOrder);
$('.items').on('click', 'h4', () => toggleItemInfo(event));
$('.items').on('click', '#update-submit', () => updateItem(event));

fetchAscendingItems();
