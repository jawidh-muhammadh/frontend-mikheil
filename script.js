

const dummyArray = Array.from({ length: 8 }, (_, i) => i + 1);



const createHtmlStructures = () => `
        <div class=" relative  w-full  h-[280px]     ">

                    <img class="w-full h-full  absolute object-cover" src="/images/img.png">

                    <div class=" absolute z-10  flex px-2  top-3 w-full "> 

                        <div class=" flex justify-between items-center w-full">
                            <p class=" bg-[#92A5EF] text-white  px-3 py-[3px] rounded-sm text-sm"> New</p>
                           

                            <div class="  bg-white px-5 py-1  rounded-lg flex flex-col items-center ">

                        <p class=" text-black "> 29 </p>
                        <p class=" text-gray-400  font-thin">  Mar </p>


                            </div>
                           

                        </div>

                    </div>

                    
                    <div class=" absolute z-10 p-2 flex  bottom-3    w-full"> 

                        <div class=" flex bg-white rounded-md flex-col gap-4  p-2 w-full">

                            <p class=" text-black font-poppins text-sm"> Educational Fiestsa 2024</p>

                          <div class=" w-full flex  flex-col gap-2 items-center">
                           
                            <div class=" flex gap-2 w-full items-center text-xs font-poppins"> 

                          
                            <p> Downtown </p>
                            <div class=" w-2 h-2 rounded-full bg-gray-200"> </div>
                            <p> 10:00 PM</p>

                        </div>


                        <div class="w-full">
                            <button class=" bg-[#0043E2] text-white break-all font-poppins py-2 text-xs  rounded-md lg:w-fit w-full  "> Download </button>

                        </div>



                          </div>
                       

                        </div>

                    </div>


                </div>
`;



  function openChat() {
    document.getElementById('popup').style.display = 'flex';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }



  document.getElementById('createEventBtn').addEventListener('click', async () => {
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventImage = document.getElementById('eventImage').files[0];
    const errorMessage = document.getElementById('errorMessage');
  
    // Clear previous messages
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    errorMessage.classList.remove('text-red-500', 'text-green-500'); // Ensure previous classes are removed
  
    if (!eventName || !eventDate || !eventTime || !eventLocation || !eventImage) {
      errorMessage.textContent = 'All fields are required.';
      errorMessage.classList.remove('hidden');
      errorMessage.classList.add('text-red-500');
      return;
    }

    const token = localStorage.getItem('email');
  
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('date', eventDate);
    formData.append('time', eventTime);
    formData.append('location', eventLocation);
    formData.append('eventImage', eventImage);
    formData.append('admin' , token)
  
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        // Show success message
        errorMessage.textContent = 'Event created successfully!';
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('text-green-500');
  
        // Reset form fields
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventImage').value = '';
  
        // Hide success message after 10 seconds
        setTimeout(() => {
          errorMessage.classList.add('hidden');
        }, 10000);
      } else {
        const errorData = await response.json();
        errorMessage.textContent = errorData.error || 'Failed to create event.';
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('text-red-500');
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred. Please try again.';
      errorMessage.classList.remove('hidden');
      errorMessage.classList.add('text-red-500');
    }
  });
  
  
  // create an event functionality ENDS








 // get all the events of the admin 
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('email');
  const adminEmail = token; 
  let editingEventId = null;
  let deletingEventId = null;

  const fetchEventsByAdmin = async (adminEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${adminEmail}`);
      const events = await response.json();
      console.log(events);
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const displayEvents = (events) => {
    const eventsBody = document.getElementById('eventsBody');
    eventsBody.innerHTML = ''; // Clear any existing rows

    events.forEach(event => {
      const row = document.createElement('tr');
      row.className = event.index % 2 === 0 ? '' : 'bg-gray-100'; // Alternate row colors

      row.innerHTML = `
        <td class="w-1/4 text-left py-3 px-4">
          ${editingEventId === event._id ? 
            `<input type="text" id="editEventName" value="${event.eventName}" class="border p-2" />` : 
            event.eventName}
        </td>
        <td class="w-1/4 text-left py-3 px-4">${event.time}</td>
        <td class="w-1/4 text-left py-3 px-4">${formatDate(event.date)}</td>
        <td class="w-1/4 text-left py-3 px-4">${event.registeredUsers || '0'}</td>
        <td class="w-1/4 text-center py-3 px-4">
          ${editingEventId === event._id ? 
            `<button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="saveEvent('${event._id}')">Save</button> 
             <button class="px-4 py-2 rounded" onclick="cancelEdit()">Cancel</button>` :
            deletingEventId !== event._id ? 
            `<button class="underline text-blue-500 cursor-pointer" onclick="editEvent('${event._id}', '${event.eventName}')">Edit</button>` : ''}
          ${deletingEventId === event._id ? 
            `<button class="bg-red-500 text-black px-4 py-2 rounded" onclick="confirmDeleteEvent('${event._id}')">Confirm</button> 
             <button class="px-4 py-2 rounded" onclick="cancelDelete()">Cancel</button>` :
            editingEventId !== event._id && event.registeredUsers === 0 ? 
            `<button class="underline text-red-500 cursor-pointer" onclick="deleteEvent('${event._id}')">Delete</button>` : ''}
        </td>
      `;

      eventsBody.appendChild(row);
    });
  };

  window.editEvent = (eventId, eventName) => {
    editingEventId = eventId;
    deletingEventId = null; // Hide delete buttons when editing
    displayEvents(events); // Re-render table to show edit form
  };

  window.saveEvent = async (eventId) => {
    const newEventName = document.getElementById('editEventName').value;
    if (!newEventName.trim()) {
      alert('Event name cannot be empty');
      return;
    }
    
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName: newEventName })
      });
      const events = await fetchEventsByAdmin(adminEmail);
      editingEventId = null;
      displayEvents(events);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  window.cancelEdit = () => {
    editingEventId = null;
    displayEvents(events); // Re-render table to cancel edit
  };

  // delete event 
  window.deleteEvent = (eventId) => {
    deletingEventId = eventId;
    editingEventId = null; // Hide edit buttons when deleting
    displayEvents(events); // Re-render table to show delete confirmation
  };

  window.confirmDeleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
      });
      const events = await fetchEventsByAdmin(adminEmail);
      deletingEventId = null;
      displayEvents(events);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  window.cancelDelete = () => {
    deletingEventId = null;
    displayEvents(events); // Re-render table to cancel delete
  };
  
  const events = await fetchEventsByAdmin(adminEmail);
  displayEvents(events);
});


 // get all the events of the admin 






  // GET ALL REGISTRATION FROM API 
  const fetchRegistrations = async () => {
    const token = localStorage.getItem('email');
    try {
      const response = await fetch(`http://localhost:5000/api/registrations/${token}`);
      const data = await response.json();
      console.log(data);
      return data.registrations;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return [];
    }
  };
  
  const BASE_URL = 'http://localhost:5000';
  
  // Function to format the date and month
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  };
  
  const createHtmlStructure = (registration) => {
    const { day, month } = formatDate(registration.date); // Assuming `date` field exists in registration
  
    return `
      <div class="relative w-full h-[280px]">
        <img class="w-full h-full absolute object-cover" src="${BASE_URL}${registration.image}" alt="${registration.eventName}">
        <div class="absolute z-10 flex px-2 top-3 w-full"> 
          <div class="flex justify-between items-center w-full">
            <p class="bg-[#92A5EF] text-white px-3 py-[3px] rounded-sm text-sm">New</p>
            <div class="bg-white px-5 py-1 rounded-lg flex flex-col items-center">
              <p class="text-black">${day}</p>
              <p class="text-gray-400 font-thin">${month}</p>
            </div>
          </div>
        </div>
        <div class="absolute z-10 p-2 flex bottom-3 w-full"> 
          <div class="flex bg-white rounded-md flex-col gap-2 p-2 w-full">
            <p class="text-black font-poppins text-sm">${registration.eventName}</p>
            <div class="w-full flex flex-col gap-2 items-center">
              <div class="flex gap-2 w-full items-center text-xs font-poppins"> 
                <p>${registration.location}</p>
                <div class="w-2 h-2 rounded-full bg-gray-200"></div>
                <p>${registration.time}</p>
              </div>
       
              <div class="w-full  flex lg:flex-row  gap-2 flex-col">
                   <button class="admin-chat-button bg-[#0043E2] text-white font-poppins py-2 px-4 text-xs rounded-md lg:w-fit w-full" data-email="${registration.admin}">
      Admin Chat
    </button>
                <button class=" download-button bg-[#0043E2] text-white break-all font-poppins py-2 px-4 text-xs rounded-md lg:w-fit w-full" >Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  // const populateContainer = async () => {
  //   const container = document.getElementById('container');
  //   const registrations = await fetchRegistrations();
  //   container.innerHTML = registrations.map(createHtmlStructure).join('');
  // };
  
  const populateContainer = async () => {
    const container = document.getElementById('container');
    const registrations = await fetchRegistrations();
    container.innerHTML = ''; // Clear any previous content
    container.innerHTML = registrations.map(createHtmlStructure).join('');
  };
  
  window.addEventListener('DOMContentLoaded', populateContainer);
  

  // window.addEventListener('DOMContentLoaded', populateContainer);
  
  // GET ALL REGISTRATION FROM API ENDS



  // REGISTER FOR A NEW EVENT 

  // Register for an event
const registerForEvent = async (eventData) => {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Registration successful:', data);
      // Optionally, refresh the registrations after successful registration
      await populateContainer();
      alert('Registration successful!');
    } else {
      console.error('Error registering for event:', data);
        alert(data.message);
      
    }
  } catch (error) {
    console.error('Error registering for event:', error);
  }
};



// SEARCH AN EVENT 
document.getElementById('searchButton').addEventListener('click', async () => {
  const searchInputLg = document.getElementById('searchInputLg').value.trim();
  const searchInputSm = document.getElementById('searchInputSm').value.trim();

  const searchInput = window.innerWidth >= 1024 ? searchInputLg : searchInputSm;

  if (!searchInput) {
    console.error('Search input is empty');
    return;
  }

  const encodedQuery = encodeURIComponent(searchInput);

  try {
    const response = await fetch(`http://localhost:5000/api/events/search/${encodedQuery}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Search Results:', data);

    // Access the events array correctly
    const events = Array.isArray(data.events) ? data.events : [];
    const resultsContainer = document.getElementById('searchResults');

    if (events.length > 0) {
      // Show the container and update the HTML
      resultsContainer.classList.remove('hidden');
      resultsContainer.innerHTML = events.map(event => `
        <div class="border p-4 rounded-lg shadow-lg">
          <div class="w-full h-24"> 
            <img class="w-full h-24 flex object-cover mb-4 rounded-lg" src="${BASE_URL}${event.image}" alt="${event.eventName}" />
          </div>
          <h3 class="text-xl font-semibold mb-2">${event.eventName}</h3>
          <p class="text-gray-600 mb-1">${new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p class="text-gray-600 mb-1">${event.time}</p>
          <p class="text-gray-600">${event.location}</p>
          <div class="w-full mt-3">
            <button data-event-name="${event.eventName}" data-event-id="${event._id}" class="register-button bg-[#0043E2] text-white break-all font-poppins py-2 px-4 text-xs rounded-md lg:w-fit w-full">Register</button>
          </div>
        </div>
      `).join('');
    } else {
      // Hide the container if no results
      resultsContainer.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
});






const confirmationModal = document.getElementById('confirmationModal');
let eventDataToRegister = null;

// event-=delegation for "Register" btn
document.getElementById('searchResults').addEventListener('click', async (event) => {
  if (event.target && event.target.classList.contains('register-button')) {
    const button = event.target;
    const eventName = button.getAttribute('data-event-name');
    const eventId = button.getAttribute('data-event-id');
    const token = localStorage.getItem('email');

    //  data to register
    eventDataToRegister = {
      userEmail: token,
      eventName: eventName,
    };

    // showing confirmation modal
    confirmationModal.classList.remove('hidden');
    confirmationModal.classList.add('flex');
  }
});

// cnfirm the Registration
document.getElementById('confirmButton').addEventListener('click', async () => {
  if (eventDataToRegister) {
    await registerForEvent(eventDataToRegister);
    confirmationModal.classList.add('hidden');
    eventDataToRegister = null;
  }
});

// cancel Registration
document.getElementById('cancelButton').addEventListener('click', () => {
  confirmationModal.classList.add('hidden');
  eventDataToRegister = null;
});









// EVENTS FOR DATES SELECTED ON CALENDER 
document.addEventListener('DOMContentLoaded', function () {
  const BASE_URL = 'http://localhost:5000/api'; 
  const IMG_URL = 'http://localhost:5000'; 
  const dateDisplay = document.getElementById('dateDisplay');
  const eventList = document.getElementById('eventList');
  let selectedDateRange = [];
  let selectedDate = null;

  const today = new Date();

  //  date range
  const dateRangePicker = flatpickr('#dateRange', {
    mode: 'range',
    altInput: true,
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d',
    defaultDate: [today, today], // Set default range to today
    onChange: function(selectedDates) {
      selectedDateRange = selectedDates;
      selectedDate = null;
      fetchEvents();
    }
  });

  //  single date
  const inlinePicker = flatpickr('#inline-picker', {
    inline: true,
    defaultDate: today, // Set default date to today
    onChange: function(selectedDates) {
      selectedDate = selectedDates[0];
      selectedDateRange = [];
      fetchEvents();
    }
  });

  // "Today" button event listener
  document.getElementById('todayButton').addEventListener('click', function() {
    const today = new Date();
    selectedDate = today;
    selectedDateRange = [today, today]; 
    dateRangePicker.setDate([today, today]); 
    inlinePicker.setDate(today); 
    fetchEvents();
  });

  document.getElementById('prevButton').addEventListener('click', function() {
    navigateDate(-1);
  });

  document.getElementById('nextButton').addEventListener('click', function() {
    navigateDate(1);
  });

  function navigateDate(offset) {
    if (selectedDate) {
      selectedDate.setDate(selectedDate.getDate() + offset);
      fetchEvents();
    } else if (selectedDateRange.length === 2) {
      selectedDateRange[0].setDate(selectedDateRange[0].getDate() + offset);
      selectedDateRange[1].setDate(selectedDateRange[1].getDate() + offset);
      fetchEvents();
    }
  }

  function fetchEvents() {
    let requestBody = {};
    if (selectedDateRange.length === 2) {
      requestBody = {
        start: selectedDateRange[0].toISOString().split('T')[0],
        end: selectedDateRange[1].toISOString().split('T')[0]
      };
      dateDisplay.textContent = `${formatDate(selectedDateRange[0])} - ${formatDate(selectedDateRange[1])}`;
    } else if (selectedDate) {
      requestBody = {
        date: selectedDate.toISOString().split('T')[0]
      };
      dateDisplay.textContent = formatDate(selectedDate);
    } else {
      return;
    }
  
    console.log('Sending request body:', requestBody);
  
    fetch(`${BASE_URL}/events/fordate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(events => {
      const eventList = document.getElementById('eventList');
  
      if (events.length > 0) {
        // Make the container visible if there are events
        eventList.classList.remove('hidden');
        eventList.innerHTML = events.map(event => `
          <div class="flex items-center bg-white p-4 rounded-md shadow">
            <img src="${IMG_URL}${event.image}" class="w-32 h-32 object-cover rounded-md mr-4">
            <div>
              <h2 class="text-xl font-semibold">${event.eventName}</h2>
              <p class="text-gray-600">${new Date(event.date).toLocaleDateString()}</p>
            
            </div>
          </div>
        `).join('');
      } else {
        // Hide the container if no events
        // eventList.classList.add('hidden');
        eventList.innerHTML = '<p class="text-center text-gray-600">No events for this date</p>';
      }
    })
    .catch(error => console.error('Error fetching events:', error));
  }
  // <button class="bg-black text-white mt-2 p-2 rounded-md">Register</button>

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Set default date display to today
  dateDisplay.textContent = formatDate(today);

  // Fetch events for today when the page loads
  fetchEvents();
});






// EVENTS FOR DATES SELECTED ON CALENDER 








// LOGIN AND SIGNUP 
document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const openLogin = document.getElementById('openLogin');
  const openSignup = document.getElementById('openSignup');
  const closeLogin = document.getElementById('closeLogin');
  const closeSignup = document.getElementById('closeSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  const loginSignupButtons = document.getElementById('loginSignupButtons');
  const logoutButton = document.getElementById('logoutButton');

  const authstate = localStorage.getItem('email');


  if (authstate) {
    loginSignupButtons.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    loginSignupButtons.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }


  openLogin.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });

  openSignup.addEventListener('click', () => {
    signupModal.classList.remove('hidden');
  });

  closeLogin.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';

        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
  });

  closeSignup.addEventListener('click', () => {
    signupModal.classList.add('hidden');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Clear previous errors
    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';

    if (!email || !password) {
      if (!email) document.getElementById('loginEmailError').textContent = 'Email is required';
      if (!password) document.getElementById('loginPasswordError').textContent = 'Password is required';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert('Login successful');

        sessionStorage.setItem("email" , data.email)
        localStorage.setItem("email" , data.email)

        document.getElementById('loginSignupButtons').classList.add('hidden');
        document.getElementById('logoutButton').classList.remove('hidden');
  
        // Reset input fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        loginModal.classList.add('hidden');
        location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    // Clear previous errors
    document.getElementById('signupNameError').textContent = '';
    document.getElementById('signupEmailError').textContent = '';
    document.getElementById('signupPasswordError').textContent = '';

    if (!name || !email || !password) {
      if (!name) document.getElementById('signupNameError').textContent = 'Name is required';
      if (!email) document.getElementById('signupEmailError').textContent = 'Email is required';
      if (!password) document.getElementById('signupPasswordError').textContent = 'Password is required';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful');
        
        localStorage.setItem('email', data.email);
        sessionStorage.setItem('email', data.email);

        document.getElementById('loginSignupButtons').classList.add('hidden');
        document.getElementById('logoutButton').classList.remove('hidden');
  
        // Reset input fields
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';

        signupModal.classList.add('hidden');

        location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // signupForm.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const name = document.getElementById('signupName').value.trim();
  //   const email = document.getElementById('signupEmail').value.trim();
  //   const password = document.getElementById('signupPassword').value.trim();
  
  //   // Clear previous errors
  //   document.getElementById('signupNameError').textContent = '';
  //   document.getElementById('signupEmailError').textContent = '';
  //   document.getElementById('signupPasswordError').textContent = '';
  
  //   if (!name || !email || !password) {
  //     if (!name) document.getElementById('signupNameError').textContent = 'Name is required';
  //     if (!email) document.getElementById('signupEmailError').textContent = 'Email is required';
  //     if (!password) document.getElementById('signupPasswordError').textContent = 'Password is required';
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch('http://localhost:5000/api/auth/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name, email, password }),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       // Show verification modal
  //       localStorage.setItem('email', email);
  //       document.getElementById('verificationModal').classList.remove('hidden');
        
  //       // Hide signup modal and reset fields
  //       signupModal.classList.add('hidden');
  //       document.getElementById('signupName').value = '';
  //       document.getElementById('signupEmail').value = '';
  //       document.getElementById('signupPassword').value = '';
  
  //       // Update UI state
  //       document.getElementById('loginSignupButtons').classList.add('hidden');
  //       document.getElementById('logoutButton').classList.remove('hidden');
  //     } else {
  //       alert(`Error: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // });
  
});


document.getElementById('closeVerification').addEventListener('click', () => {
  document.getElementById('verificationModal').classList.add('hidden');
});


// LOGIN AND SIGNUP 


// logout functionality 
document.getElementById('logout').addEventListener('click', () => {
  // Clear local and session storage
  localStorage.removeItem('email');
  sessionStorage.removeItem('email');

  // Show login/signup buttons and hide logout button
  document.getElementById('loginSignupButtons').classList.remove('hidden');
  document.getElementById('logoutButton').classList.add('hidden');
  location.reload();
});
// logout functionality ends



// authenticated content and unauthenticated content show/hide 
document.addEventListener('DOMContentLoaded', function() {
  // Check for authentication token in localStorage
  const token = localStorage.getItem('email');

  // Get references to the divs using class selectors
  const authenticatedContents = document.querySelectorAll('.authenticated-content');
  const unauthenticatedContents = document.querySelectorAll('.unauthenticated-content');

  // Show or hide content based on authentication state
  if (token) {
    // User is authenticated
    authenticatedContents.forEach(el => el.classList.remove('hidden'));
    unauthenticatedContents.forEach(el => el.classList.add('hidden'));
  } else {
    // User is not authenticated
    authenticatedContents.forEach(el => el.classList.add('hidden'));
    unauthenticatedContents.forEach(el => el.classList.remove('hidden'));
  }
});

// authenticated content and unauthenticated content show/hide 









// personal information section logics 
// document.addEventListener("DOMContentLoaded", () => {
//   const editButton = document.getElementById("edit-button");
//   const saveButton = document.getElementById("save-button");
//   const profileImage = document.getElementById("profile-image");
//   const imageUpload = document.getElementById("image-upload");

//   const nameDisplay = document.getElementById("name-display");
//   const lastNameDisplay = document.getElementById("last-name-display");
//   const dobDisplay = document.getElementById("dob-display");
//   const phoneDisplay = document.getElementById("phone-display");

//   const nameInput = document.getElementById("name-input");
//   const lastNameInput = document.getElementById("last-name-input");
//   const dobInput = document.getElementById("dob-input");
//   const phoneInput = document.getElementById("phone-input");

//   const verificationMessage = document.getElementById("verification-message");

//   const email = localStorage.getItem("email");

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/auth/user/${email}`);
//       const data = await response.json();
//       nameDisplay.textContent = data.name || "Not Set";
//       lastNameDisplay.textContent = data.last_name || "Not Set";
//       dobDisplay.textContent = data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : "Not Set";
//       phoneDisplay.textContent = data.phone_number || "Not Set";

//       const profileImageElement = document.getElementById("profile-image");
// if (data.profile_image) {
//   profileImageElement.src = `http://localhost:5000${data.profile_image}`
// } else {
//   profileImageElement.src = "https://via.placeholder.com/200";
// }

//       nameInput.value = data.name || "";
//       lastNameInput.value = data.last_name || "";
//       dobInput.value = data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : "";
//       phoneInput.value = data.phone_number || "";
//     } catch (error) {
//       alert("Failed to fetch user data");
//     }
//   };

//   const toggleEditMode = () => {
//     const isEditMode = nameInput.classList.contains("hidden");

//     if (isEditMode) {
//       nameInput.classList.remove("hidden");
//       lastNameInput.classList.remove("hidden");
//       dobInput.classList.remove("hidden");
//       phoneInput.classList.remove("hidden");

//       nameDisplay.classList.add("hidden");
//       lastNameDisplay.classList.add("hidden");
//       dobDisplay.classList.add("hidden");
//       phoneDisplay.classList.add("hidden");

//       editButton.classList.add("hidden");
//       saveButton.classList.remove("hidden");
//       imageUpload.classList.remove("hidden");
//     } else {
//       nameInput.classList.add("hidden");
//       lastNameInput.classList.add("hidden");
//       dobInput.classList.add("hidden");
//       phoneInput.classList.add("hidden");

//       nameDisplay.classList.remove("hidden");
//       lastNameDisplay.classList.remove("hidden");
//       dobDisplay.classList.remove("hidden");
//       phoneDisplay.classList.remove("hidden");

//       editButton.classList.remove("hidden");
//       saveButton.classList.add("hidden");
//       imageUpload.classList.add("hidden");
//     }
//   };

//   const saveUserData = async () => {
//     const formData = new FormData();
//     formData.append("name", nameInput.value);
//     formData.append("last_name", lastNameInput.value);
//     formData.append("date_of_birth", dobInput.value);
//     formData.append("phone_number", phoneInput.value);
//     if (imageUpload.files.length > 0) {
//       formData.append("profile_image", imageUpload.files[0]);
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/auth/user/${email}`, {
//         method: "PUT",
//         body: formData,
//       });
//       if (response.ok) {
//         alert("Profile updated successfully");
//         fetchUserData();
//         toggleEditMode();
//       } else {
//         alert("Failed to update profile");
//       }
//     } catch (error) {
//       alert("Failed to update profile");
//     }
//   };

//   editButton.addEventListener("click", toggleEditMode);
//   saveButton.addEventListener("click", saveUserData);

//   fetchUserData();
// });


document.addEventListener("DOMContentLoaded", async () => {
  const editButton = document.getElementById("edit-button");
  const saveButton = document.getElementById("save-button");
  const profileImage = document.getElementById("profile-image");
  const imageUpload = document.getElementById("image-upload");

  const nameDisplay = document.getElementById("name-display");
  const lastNameDisplay = document.getElementById("last-name-display");
  const dobDisplay = document.getElementById("dob-display");
  const phoneDisplay = document.getElementById("phone-display");

  const nameInput = document.getElementById("name-input");
  const lastNameInput = document.getElementById("last-name-input");
  const dobInput = document.getElementById("dob-input");
  const phoneInput = document.getElementById("phone-input");

  const verificationMessage = document.getElementById("verification-message");

  const email = localStorage.getItem("email");

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/user/${email}`);
      const data = await response.json();
      nameDisplay.textContent = data.name || "Not Set";
      lastNameDisplay.textContent = data.last_name || "Not Set";
      dobDisplay.textContent = data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : "Not Set";
      phoneDisplay.textContent = data.phone_number || "Not Set";

      if (data.profile_image) {
        profileImage.src = `http://localhost:5000${data.profile_image}`;
      } else {
        profileImage.src = "https://via.placeholder.com/200";
      }

      nameInput.value = data.name || "";
      lastNameInput.value = data.last_name || "";
      dobInput.value = data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : "";
      phoneInput.value = data.phone_number || "";

      // Display email verification status
      if (data.isVerified) {
        verificationMessage.textContent = "Your email has been verified.";
        verificationMessage.classList.remove("text-red-500");
        verificationMessage.classList.add("text-green-500");
      } else {
        verificationMessage.textContent = "Your email has not been verified.";
        verificationMessage.classList.remove("text-green-500");
        verificationMessage.classList.add("text-red-500");
      }

    } catch (error) {
      alert("Failed to fetch user data");
    }
  };

  const toggleEditMode = () => {
    const isEditMode = nameInput.classList.contains("hidden");

    if (isEditMode) {
      nameInput.classList.remove("hidden");
      lastNameInput.classList.remove("hidden");
      dobInput.classList.remove("hidden");
      phoneInput.classList.remove("hidden");

      nameDisplay.classList.add("hidden");
      lastNameDisplay.classList.add("hidden");
      dobDisplay.classList.add("hidden");
      phoneDisplay.classList.add("hidden");

      editButton.classList.add("hidden");
      saveButton.classList.remove("hidden");
      imageUpload.classList.remove("hidden");
    } else {
      nameInput.classList.add("hidden");
      lastNameInput.classList.add("hidden");
      dobInput.classList.add("hidden");
      phoneInput.classList.add("hidden");

      nameDisplay.classList.remove("hidden");
      lastNameDisplay.classList.remove("hidden");
      dobDisplay.classList.remove("hidden");
      phoneDisplay.classList.remove("hidden");

      editButton.classList.remove("hidden");
      saveButton.classList.add("hidden");
      imageUpload.classList.add("hidden");
    }
  };

  const saveUserData = async () => {
    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("last_name", lastNameInput.value);
    formData.append("date_of_birth", dobInput.value);
    formData.append("phone_number", phoneInput.value);
    if (imageUpload.files.length > 0) {
      formData.append("profile_image", imageUpload.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/user/${email}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        alert("Profile updated successfully");
        fetchUserData();
        toggleEditMode();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  editButton.addEventListener("click", toggleEditMode);
  saveButton.addEventListener("click", saveUserData);

  fetchUserData();
});





// download the pdf 
document.addEventListener('DOMContentLoaded', () => {
  // Ensure jsPDF is available
  const { jsPDF } = window.jspdf;

  console.log('Script loaded');
  console.log('jsPDF:', jsPDF); 

  // Function to generate and download PDF
  function generatePDF(eventName, location, time, adminEmail) {
    const userEmail = localStorage.getItem('email'); // Assuming the email is stored under 'email'
    
    console.log('Generating PDF with:', { eventName, location, time, adminEmail, userEmail });

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Event Registration Details', 10, 10);
    
    doc.setFontSize(12);
    doc.text(`Event Name: ${eventName}`, 10, 20);
    doc.text(`Location: ${location}`, 10, 30);
    doc.text(`Time: ${time}`, 10, 40);
    doc.text(`Admin Email: ${adminEmail}`, 10, 50);
    doc.text(`User Email: ${userEmail}`, 10, 60);
    
    doc.save('registration-details.pdf');
  }

  // Attach event listener to all download buttons
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('.download-button')) {
      console.log('Download button clicked');
      
      const button = event.target;
      const registrationElement = button.closest('.relative');
      
      if (registrationElement) {
        const eventName = registrationElement.querySelector('.text-black.font-poppins.text-sm')?.textContent || '';
        const location = registrationElement.querySelector('.flex.gap-2.w-full.items-center.text-xs.font-poppins p:first-child')?.textContent || '';
        const time = registrationElement.querySelector('.flex.gap-2.w-full.items-center.text-xs.font-poppins p:last-child')?.textContent || '';
        const adminChatButton = registrationElement.querySelector('.admin-chat-button');
        const adminEmail = adminChatButton ? adminChatButton.getAttribute('data-email') : '';
      
      
     

        generatePDF(eventName, location, time, adminEmail);
      } else {
        console.error('Registration element not found');
      }
    }
  });
});


// download the pdf 


// change password 
document.addEventListener('DOMContentLoaded', () => {
  // Change Password Logic
  const changePasswordButton = document.getElementById('change-password-button');
  const oldPasswordInput = document.getElementById('old-password');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordChangeError = document.getElementById('password-change-error');
  const passwordChangeSuccess = document.getElementById('password-change-success');

  changePasswordButton.addEventListener('click', async () => {
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Clear previous messages
    passwordChangeError.classList.add('hidden');
    passwordChangeSuccess.classList.add('hidden');

    if (!oldPassword || !newPassword || !confirmPassword) {
      passwordChangeError.textContent = 'All fields are required';
      passwordChangeError.classList.remove('hidden');
      return;
    }

    if (newPassword !== confirmPassword) {
      passwordChangeError.textContent = 'New password and confirm password do not match';
      passwordChangeError.classList.remove('hidden');
      return;
    }

    try {
      const email = localStorage.getItem('email');
      console.log(email);
      const response = await fetch(`http://localhost:5000/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        passwordChangeSuccess.textContent = 'Password changed successfully';
        passwordChangeSuccess.classList.remove('hidden');
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
      } else {
        passwordChangeError.textContent = `Error: ${data.message}`;
        passwordChangeError.classList.remove('hidden');
      }
    } catch (error) {
      passwordChangeError.textContent = 'An error occurred while changing the password';
      passwordChangeError.classList.remove('hidden');
      console.error('Error:', error);
    }
  });
});

// change password 


// verified popup 
// document.addEventListener('DOMContentLoaded', () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const emailVerified = urlParams.get('emailVerified');

//   // Check if popup has already been shown
//   const popupShown = localStorage.getItem('popupShown');

//   if (emailVerified === 'true' && !popupShown) {
//     // Show the popup if emailVerified parameter is true and popup hasn't been shown
//     showPopup('Email verified successfully!');
//     // Mark popup as shown in localStorage
//     localStorage.setItem('popupShown', 'true');
//   }
// });

// function showPopup(message) {
//   const popup = document.getElementById('popupq');
//   const popupMessage = document.getElementById('popup-message');
//   const popupClose = document.getElementById('popup-close');

//   // Ensure previous event listeners are removed
//   popupClose.removeEventListener('click', closePopup);

//   popupMessage.textContent = message;
//   popup.classList.remove('hidden');

//   popupClose.addEventListener('click', closePopup);

//   // Hide popup after 2 seconds
//   setTimeout(() => {
//     popup.classList.add('hidden');
//   }, 2000);
// }

// function closePopup() {
//   const popup = document.getElementById('popupq');
//   popup.classList.add('hidden');
// }
// popupClose.removeEventListener('click', closePopup);
// popupClose.addEventListener('click', closePopup);

// verified popup 