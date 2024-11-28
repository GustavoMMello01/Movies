import React, { useState } from "react";
import { loginWithGoogle, logout, auth, fetchLiveCollection } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("Usuário autenticado:", currentUser.displayName);
        await fetchLiveCollection(); // Chama a função para buscar os dados
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React + Firebase</h1>
      {!user ? (
        <button onClick={loginWithGoogle}>Login com Google</button>
      ) : (
        <div>
          <h2>Bem-vindo, {user.displayName}!</h2>
          <img
            src={user.photoURL}
            alt="Foto do usuário"
            style={{ borderRadius: "50%", width: "100px" }}
          />
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
