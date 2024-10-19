export async function TryLogin(username, password) {
    const response = await fetch('https://localhost:7019/User/Login', {
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
        const errorMessage = errorResponse?.message || "Oops, something went wrong!";
        throw new Error(errorMessage);
    }
    
    return response.json();
  }