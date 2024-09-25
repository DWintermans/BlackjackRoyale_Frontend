export async function TryLogin(username, password) {
    const response = await fetch('https://localhost:7019/Account/Login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,  
        password   
      }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
    }
    
    return response.json();
  }