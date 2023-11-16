// const btn = document.querySelector('#btn')


// btn.addEventListener('click', async (e) => {
//     e.preventDefault();
    
//   const formData = new FormData();
//   formData.append("email", document.querySelector("#email").value);
//   formData.append("amount", document.querySelector("#amount").value);
//      try {
//                  const response = await fetch('api/v1/user/payments', {
//                     method: 'POST',
//                      body: formData
                     
//                  });

//                  if (!response.ok) {
//               throw new Error('Failed to initialize transaction');
//                  }

//                  const responseData = await response.json();

//                  // Redirect to the checkout page
//              } catch (error) {
//          console.error('Error:', error.message);
//          console.log(error)
//             }
//         })

//     // window.location.href = `https://www.credodemo.com/checkout/${response.data.data.reference}`

