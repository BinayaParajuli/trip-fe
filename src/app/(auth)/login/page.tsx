import Login from "@/components/custom/Login";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
