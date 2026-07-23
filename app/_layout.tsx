import { Stack } from "expo-router";
import AppRoutes from "../src/Routes/AppRoutes";
import { ProductsProvider } from "../src/context/ProductsContext";

export default function RootLayout() {
  return (
    <ProductsProvider>
      <AppRoutes />
    </ProductsProvider>
  );
}
