const fetchItems = () => {
  fetch('/api/v1/garageItems')
  .then(response => response.json())
  .then(garageItems => {
    appendItems(garageItems);
    countItems(garageItems)
  })
  .catch(() => console.log('error in fetch items'))
};

const appendItems = (garageItems) => {
  return garageItems.forEach(garageItem => {
    $('.items').append(`
      <aside class="item">
        <h4 id="item-name">${garageItem.name}</h4>
        <p id="item-reason">${garageItem.reason}</p>
        <p id="item-cleanliness">${garageItem.cleanliness}</p>
      </aside>
    `);
  });
};

const countByCleanliness = (garageItems, level) => {
  const filtered = garageItems.filter(item => item.cleanliness === level);
  return filtered.length;
}

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

    fetch('/api/v1/garageItems', postHeader({
      name, reason, cleanliness
    }))
    .then(response => {
      if (response.status === 201) { return response.json(); }
    })
    .then(() => {
      fetchItems();
    })
    .catch((error) => {
      throw error;
    })

    $('#new-name').val('');
    $('#new-reason').val('');
};


$('div').on('click', 'button', addItem);

$('.remote').on('click', fetchItems);

//
// const fetchItems = () => {
//   fetch('/api/v1/garageItems')
//   .then(response => response.json())
//   .then(garageItems => {
//     const frag = document.createDocumentFragment();
//
//     for (let i = 0; i < garageItems.length; i++) {
//       let item = document.createElement('h4');
//       item.innerHTML = i.name;
//       frag.appendChild(item);
//       console.log(frag.childNodes);
//     }
//     $('.items').appendChild(frag);
    // garageItems.forEach(garageItem => {
    //   let item = document.createElement('h4');
    //   item.innerHTML = garageItem.name;
    //   frag.appendChild(item);
    //   console.log(frag.childNodes);
    //   $('.items').appendChild(frag);
    // })
  //})
//}
