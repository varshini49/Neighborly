
import { useEffect, useState } from 'react'

function ApiTest() {

  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => setMessage('Backend connection failed'))
  }, [])

  return (
    <div className="container mt-5">
      <h2>Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  )
}

export default ApiTest
