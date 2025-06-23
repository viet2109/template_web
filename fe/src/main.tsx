import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import "./index.css";
import { persistor, store } from "./store/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="229350300054-i5c77r35u2fisi6dcninpgcpj2peafou.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
