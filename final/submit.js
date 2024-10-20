


 document.addEventListener('DOMContentLoaded', function() {
    

document.getElementById('submitButton').addEventListener('click',async  function() {
    
    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;
    const PhoneNumber = document.getElementById('phone').value;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8888/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username,age,PhoneNumber,email, password })
        });
       
        const data = await response.text();
        console.log(data); // Log the response from the server
    } catch (error) {
        console.error(error);
    }

})

    });