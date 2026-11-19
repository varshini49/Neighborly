
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {

const fetchAnnouncements = async () => {
  try {
    const response = await fetch(
      'http://https://neighborly-backend-dlpp.onrender.com/api/announcements',
      {
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Could not load announcements')
    }

    const data = await response.json()
    setAnnouncements(data)

  } catch (error) {
    console.error('Announcement loading error:', error)
  }
}

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

const sendAnnouncement = async (e) => {
  e.preventDefault()

  if (!announcementTitle.trim() || !announcementMessage.trim()) {
    alert('Please enter both title and message')
    return
  }

  try {
    const response = await fetch(
      'http://https://neighborly-backend-dlpp.onrender.com/api/announcements',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMessage
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send announcement')
    }

    alert('Announcement sent to everyone!')

    setAnnouncementTitle('')
    setAnnouncementMessage('')

    setAnnouncements((previous) => [data, ...previous])

  } catch (error) {
    console.error('Announcement error:', error)
    alert(error.message)
  }
}


  const [activePage, setActivePage] = useState('Home')
  // Announcements
  const [announcements, setAnnouncements] = useState([])
const [announcementTitle, setAnnouncementTitle] = useState('')
const [announcementMessage, setAnnouncementMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Help Requests
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [requestTitle, setRequestTitle] = useState('')
  const [requestDescription, setRequestDescription] = useState('')
  const [requestLocation, setRequestLocation] = useState('')

  // Donations
  const [donations, setDonations] = useState([])
  const [donationItem, setDonationItem] = useState('')
  const [donationDescription, setDonationDescription] = useState('')

  // Profile
  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('profile') || '{}')

    return {
      name: saved.name || user.name || '',
      email: saved.email || user.email || '',
      phone: saved.phone || ''
    }
  })

  // Location
  const [location, setLocation] = useState(() =>
    JSON.parse(
      localStorage.getItem('location') ||
      '{"city":"","area":"","address":""}'
    )
  )
  // Logout
  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/')
  }

  // Fetch help requests from MySQL

useEffect(() => {
  fetchAnnouncements()
  async function fetchRequests() {
    try {
      const response = await fetch(
        'http://https://neighborly-backend-dlpp.onrender.com/api/requests'
      )

      if (!response.ok) {
        throw new Error('Failed to load help requests')
      }

      const data = await response.json()
      setRequests(data)

    } catch (error) {
      console.error('Request loading error:', error)
      alert('Could not load help requests. Check your backend.')
    } finally {
      setLoadingRequests(false)
    }
  }

  async function fetchLocation() {
    if (!user.id) return

    try {
      const response = await fetch(
        `http://https://neighborly-backend-dlpp.onrender.com/api/users/${user.id}/location`
      )

      if (!response.ok) {
        throw new Error('Failed to load saved location')
      }

      const data = await response.json()

      setLocation({
        city: data.city || '',
        area: data.area || '',
        address: data.address || ''
      })

    } catch (error) {
      console.error('Location loading error:', error)
    }
  }

const fetchMembers = async () => {
  try {
    const response = await fetch(
      'http://https://neighborly-backend-dlpp.onrender.com/api/community/members',
      {
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to load community members')
    }

    const data = await response.json()
    setMembers(data)

  } catch (error) {
    console.error('Community members error:', error)
  }
}


  fetchRequests()
  fetchLocation()
  fetchMembers()
  fetchAnnouncements()

}, [])


  // Fetch donations from MySQL
  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch(
          'http://https://neighborly-backend-dlpp.onrender.com/api/donations'
        )

        if (!response.ok) {
          throw new Error('Failed to load donations')
        }

        const data = await response.json()
        setDonations(data)
      } catch (error) {
        console.error('Donation loading error:', error)
        alert('Could not load donations. Check your backend.')
      }
    }

    fetchDonations()
  }, [])

  // Save profile locally
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile))
  }, [profile])

  // Save location locally
  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location))
  }, [location])

  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Community', icon: '👥' },
    { name: 'Requests', icon: '🤝' },
    { name: 'Donations', icon: '🎁' },
    { name: 'Emergency', icon: '🚨' },
    { name: 'Location', icon: '📍' },
    { name: 'Profile', icon: '👤' },
    { name: 'Notifications', icon: '🔔' }
  ]

  const [members, setMembers] = useState([
    { name: 'Rahul Kumar', role: 'Volunteer', area: 'Madhapur' },
    { name: 'Priya Sharma', role: 'Community Member', area: 'Gachibowli' },
    { name: 'Arjun Reddy', role: 'Volunteer', area: 'Kondapur' },
    { name: 'Sneha Patel', role: 'Community Member', area: 'Hitech City' },
    { name: 'Vikram Singh', role: 'Volunteer', area: 'Banjara Hills' },

  ])

  // Add help request to MySQL
  async function addRequest(e) {
    e.preventDefault()

    if (
      !requestTitle.trim() ||
      !requestDescription.trim() ||
      !requestLocation.trim()
    ) {
      alert('Please fill all fields')
      return
    }

    if (!user.id) {
      alert('Please login again')
      return
    }

    try {
      const response = await fetch(
        'http://https://neighborly-backend-dlpp.onrender.com/api/requests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: requestTitle,
            description: requestDescription,
            location: requestLocation,
            status: 'Open',
            volunteers: 0,
            userId: user.id
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save request')
      }

      const savedRequest = await response.json()

      setRequests(previous => [...previous, savedRequest])

      setRequestTitle('')
      setRequestDescription('')
      setRequestLocation('')

      alert('Help request saved successfully!')
    } catch (error) {
      console.error('Request error:', error)
      alert(error.message)
    }
  }

  // Delete help request from MySQL
  async function deleteRequest(id) {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return
    }

    try {
      const response = await fetch(
        `http://https://neighborly-backend-dlpp.onrender.com/api/requests/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete request')
      }

      setRequests(previous =>
        previous.filter(request => request.id !== id)
      )

      alert('Request deleted successfully!')
    } catch (error) {
      console.error('Delete request error:', error)
      alert(error.message)
    }
  }

  // Update help request status in MySQL
  async function toggleRequestStatus(id) {
    const request = requests.find(item => item.id === id)

    if (!request) return

    const updatedStatus =
      request.status === 'Open' ? 'Completed' : 'Open'

    try {
      const response = await fetch(
        `http://https://neighborly-backend-dlpp.onrender.com/api/requests/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...request,
            status: updatedStatus
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update request')
      }

      const updatedRequest = await response.json()

      setRequests(previous =>
        previous.map(item =>
          item.id === id ? updatedRequest : item
        )
      )

      alert('Request status updated successfully!')
    } catch (error) {
      console.error('Update request error:', error)
      alert('Unable to update request. Please try again.')
    }
  }

  // Volunteer for a help request and save count in MySQL
 
async function volunteerForRequest(id) {
  if (!user.id) {
    alert('Please login first')
    return
  }

  try {
    const response = await fetch(
      'http://https://neighborly-backend-dlpp.onrender.com/api/volunteers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: id,
          userId: user.id
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || data)
      return
    }

    setRequests(previous =>
      previous.map(request =>
        request.id === id
          ? {
              ...request,
              volunteers: data.volunteerCount
            }
          : request
      )
    )

    alert('You successfully volunteered!')

  } catch (error) {
    console.error('Volunteer error:', error)
    alert('Unable to volunteer. Check your backend.')
  }
}

  // Add donation to MySQL
  async function addDonation(e) {
    e.preventDefault()

    if (!donationItem.trim() || !donationDescription.trim()) {
      alert('Please fill all fields')
      return
    }

    if (!user.id) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch(
        'http://https://neighborly-backend-dlpp.onrender.com/api/donations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item: donationItem,
            description: donationDescription,
            status: 'Available',
            userId: user.id
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save donation')
      }

      const savedDonation = await response.json()

      setDonations(previous => [...previous, savedDonation])

      setDonationItem('')
      setDonationDescription('')

      alert('Donation saved successfully!')
    } catch (error) {
      console.error('Donation error:', error)
      alert('Unable to save donation')
    }
  }

  // Delete donation from MySQL
  async function deleteDonation(id) {
    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return
    }

    try {
      const response = await fetch(
        `http://https://neighborly-backend-dlpp.onrender.com/api/donations/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete donation')
      }

      setDonations(previous =>
        previous.filter(donation => donation.id !== id)
      )

      alert('Donation deleted successfully!')
    } catch (error) {
      console.error('Delete donation error:', error)
      alert('Unable to delete donation')
    }
  }

  // Update donation status in MySQL
  async function toggleDonationStatus(id) {
    const donation = donations.find(item => item.id === id)

    if (!donation) return

    const updatedDonation = {
      ...donation,
      status: donation.status === 'Available' ? 'Claimed' : 'Available'
    }

    try {
      const response = await fetch(
        `http://https://neighborly-backend-dlpp.onrender.com/api/donations/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDonation)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update donation')
      }

      const savedDonation = await response.json()

      setDonations(previous =>
        previous.map(item =>
          item.id === id ? savedDonation : item
        )
      )

      alert('Donation status updated successfully!')
    } catch (error) {
      console.error('Update donation error:', error)
      alert('Unable to update donation status')
    }
  }


async function saveProfile() {
  if (!user.id) {
    alert('Please login again')
    return
  }

  try {
    const response = await fetch(
      `http://https://neighborly-backend-dlpp.onrender.com/api/users/${user.id}/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Profile update failed')
      return
    }

    const updatedUser = {
      ...user,
      ...data
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))

    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Profile update error:', error)
    alert('Unable to update profile. Check your backend.')
  }
}
const updateLocation = async (event) => {
  event.preventDefault()

  if (!user.id) {
    alert('Please login again')
    return
  }

  try {
    const response = await fetch(
      `http://https://neighborly-backend-dlpp.onrender.com/api/users/${user.id}/location`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: location.city,
          area: location.area,
          address: location.address
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Location update failed')
      return
    }

    setLocation({
      city: data.city,
      area: data.area,
      address: data.address
    })

    alert('Location saved successfully!')

  } catch (error) {
    console.error('Location update error:', error)
    alert('Unable to save location. Check your backend.')
  }
}



  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="bg-white shadow p-3"
          style={{ width: '250px', flexShrink: 0 }}
        >
          <h3 className="text-primary mb-4">Neighborly.</h3>
          <h6 className="text-secondary mb-3">MENU</h6>

          {menuItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`btn w-100 text-start mb-2 ${
                activePage === item.name
                  ? 'btn-primary'
                  : 'btn-light'
              }`}
            >
              {item.icon} &nbsp; {item.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex-grow-1">

        {/* Navbar */}
        <div className="bg-white shadow-sm p-3 d-flex align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <h4 className="ms-3 mb-0 text-primary">Neighborly</h4>

          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="text-secondary">
              Welcome, {user.name || 'Community Member'}
            </span>

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4">

          {/* HOME */}
          {activePage === 'Home' && (
            <>
              <h2>Welcome to Neighborly! 👋</h2>
              <p className="text-secondary">
                Your community, your support.
              </p>

              <div className="row mt-4">
                {[
                  ['Community Members', members.length],
                  [
                    'Active Requests',
                    requests.filter(r => r.status === 'Open').length
                  ],
                  ['Donations', donations.length]
                ].map(([title, count]) => (
                  <div className="col-md-4 mb-3" key={title}>
                    <div className="card border-0 shadow-sm p-4">
                      <h6>{title}</h6>
                      <h2 className="text-primary">{count}</h2>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card border-0 shadow-sm p-4 mt-3">
                <h4>Quick Actions</h4>
                <p className="text-secondary">
                  What would you like to do today?
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => setActivePage('Requests')}
                  >
                    🤝 Ask for Help
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setActivePage('Donations')}
                  >
                    🎁 Share a Donation
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setActivePage('Community')}
                  >
                    👥 Explore Community
                  </button>
                </div>
              </div>
            </>
          )}

          {/* COMMUNITY */}
          {activePage === 'Community' && (
            <>
              <h2>Our Community 👥</h2>
              <p className="text-secondary">
                Meet people in your neighborhood.
              </p>

              <div className="row mt-4">
                {members.map(member => (
                  <div className="col-md-4 mb-3" key={member.name}>
                    <div className="card border-0 shadow-sm p-4">
                      <h5>{member.name}</h5>
                      <p className="text-primary mb-1">{member.role}</p>
                      <p className="text-secondary mb-0">
                        📍 {member.area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* REQUESTS */}
          {activePage === 'Requests' && (
            <>
              <h2>Community Help Requests 🤝</h2>
              <p className="text-secondary">
                Ask for help or volunteer to support your neighbors.
              </p>

              <div className="card border-0 shadow-sm p-4 mt-4">
                <h4>Create a Help Request</h4>

                <form onSubmit={addRequest}>
                  <input
                    className="form-control mb-3"
                    placeholder="Request title"
                    value={requestTitle}
                    onChange={e => setRequestTitle(e.target.value)}
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Describe what help you need"
                    rows="3"
                    value={requestDescription}
                    onChange={e => setRequestDescription(e.target.value)}
                    required
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Your area or locality"
                    value={requestLocation}
                    onChange={e => setRequestLocation(e.target.value)}
                    required
                  />

                  <button className="btn btn-primary">
                    Submit Request
                  </button>
                </form>
              </div>

              <h4 className="mt-4">Available Requests</h4>

              {loadingRequests && (
                <p className="text-secondary">Loading requests...</p>
              )}

              {!loadingRequests && requests.length === 0 && (
                <p className="text-secondary">
                  No requests added yet.
                </p>
              )}

              {requests.map(request => (
                <div
                  className="card border-0 shadow-sm p-3 mt-3"
                  key={request.id}
                >
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <h5>{request.title}</h5>

                    <span
                      className={`badge ${
                        request.status === 'Completed'
                          ? 'bg-success'
                          : 'bg-primary'
                      }`}
                    >
                      {request.status || 'Open'}
                    </span>
                  </div>

                  <p>{request.description}</p>

                  <p className="text-secondary mb-2">
                    📍 {request.location}
                  </p>

                  <p className="text-secondary">
                    Volunteers: {request.volunteers || 0}
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    {request.status !== 'Completed' && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => volunteerForRequest(request.id)}
                      >
                        I Can Help
                      </button>
                    )}

                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => toggleRequestStatus(request.id)}
                    >
                      {request.status === 'Completed'
                        ? 'Reopen Request'
                        : 'Mark Completed'}
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteRequest(request.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* DONATIONS */}
          {activePage === 'Donations' && (
            <>
              <h2>Donations 🎁</h2>
              <p className="text-secondary">
                Share what you can with your neighbors.
              </p>

              <div className="card border-0 shadow-sm p-4 mt-4">
                <h4>Add a Donation</h4>

                <form onSubmit={addDonation}>
                  <input
                    className="form-control mb-3"
                    placeholder="Donation item (Food, Clothes, Books...)"
                    value={donationItem}
                    onChange={e => setDonationItem(e.target.value)}
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Donation details"
                    rows="3"
                    value={donationDescription}
                    onChange={e => setDonationDescription(e.target.value)}
                    required
                  />

                  <button className="btn btn-primary">
                    Add Donation
                  </button>
                </form>
              </div>

              <h4 className="mt-4">Available Donations</h4>

              {donations.length === 0 && (
                <p className="text-secondary">
                  No donations added yet.
                </p>
              )}

              {donations.map(donation => (
                <div
                  className="card border-0 shadow-sm p-3 mt-3"
                  key={donation.id}
                >
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <h5>{donation.item}</h5>

                    <span
                      className={`badge ${
                        donation.status === 'Claimed'
                          ? 'bg-secondary'
                          : 'bg-success'
                      }`}
                    >
                      {donation.status || 'Available'}
                    </span>
                  </div>

                  <p>{donation.description}</p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => toggleDonationStatus(donation.id)}
                    >
                      {donation.status === 'Claimed'
                        ? 'Mark Available'
                        : 'Mark Claimed'}
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteDonation(donation.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* EMERGENCY */}
          {activePage === 'Emergency' && (
            <>
              <h2>Emergency Contacts 🚨</h2>
              <p className="text-secondary">
                Emergency helpline numbers in India.
              </p>

              {[
                ['National Emergency', '112'],
                ['Ambulance', '108'],
                ['Fire Department', '101'],
                ['Police', '100'],
                ['Women Helpline', '181']
              ].map(([service, number]) => (
                <div
                  className="card border-0 shadow-sm p-3 mt-3"
                  key={service}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{service}</h5>

                    <a
                      className="btn btn-outline-primary"
                      href={`tel:${number}`}
                    >
                      Call {number}
                    </a>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* LOCATION */}
          {activePage === 'Location' && (
            <>
              <h2>My Location 📍</h2>
              <p className="text-secondary">
                Add your neighborhood details.
              </p>

              <div className="card border-0 shadow-sm p-4 mt-4">
                <form onSubmit={updateLocation}>
                  <label className="form-label">City</label>

                  <input
                    className="form-control mb-3"
                    placeholder="Enter your city"
                    value={location.city}
                    onChange={e =>
                      setLocation({ ...location, city: e.target.value })
                    }
                  />

                  <label className="form-label">Area</label>

                  <input
                    className="form-control mb-3"
                    placeholder="Enter your area"
                    value={location.area}
                    onChange={e =>
                      setLocation({ ...location, area: e.target.value })
                    }
                  />

                  <label className="form-label">Address</label>

                  <textarea
                    className="form-control mb-3"
                    placeholder="Enter your address"
                    value={location.address}
                    onChange={e =>
                      setLocation({ ...location, address: e.target.value })
                    }
                  />

                  <button className="btn btn-primary">
                    Save Location
                  </button>
                </form>
              </div>
            </>
          )}

          {/* PROFILE */}
    



{activePage === 'Profile' && (
  <>
    <h2>My Profile 👤</h2>

    <p className="text-secondary">
      Manage your personal information.
    </p>

    <div className="card border-0 shadow-sm p-4 mt-4">
      <form onSubmit={saveProfile}>

        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
          required
        />

        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
          required
        />

        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Enter your phone number"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Update Profile
        </button>

      </form>
    </div>
  </>
)}

  {/* NOTIFICATIONS */}

{activePage === 'Notifications' && (
  <>
    <h2>Notifications 🔔</h2>

    <p className="text-secondary">
      Community announcements and updates.
    </p>

    {user.role === 'ADMIN' && (
      <div className="card border-0 shadow-sm p-4 mt-3">
        <h5>Send Announcement 📢</h5>

        <form onSubmit={sendAnnouncement}>
          <div className="mb-3">
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              className="form-control"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="4"
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Write your announcement..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Send to Everyone
          </button>
        </form>
      </div>
    )}

    <div className="mt-4">
      <h5>Community Announcements</h5>

      {announcements.length === 0 ? (
        <div className="card border-0 shadow-sm p-3 mt-3">
          <p className="mb-0">No announcements yet.</p>
        </div>
      ) : (
        announcements.map((item) => (
          <div
            className="card border-0 shadow-sm p-3 mt-3"
            key={item.id}
          >
            <h5>{item.title}</h5>
            <p>{item.message}</p>
            <small className="text-secondary">
              Sent by {item.sender}
            </small>
            <small className="text-secondary">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : ''}
            </small>
          </div>
        ))
      )}
    </div>
  </>
)}


        </div>
      </div>
    </div>
  )
}

export default Dashboard
