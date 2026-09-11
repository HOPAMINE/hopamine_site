import { Suspense } from "react";
import { ZimaAuthShell } from "../ZimaAuthShell";
import { ZimaSignUpForm } from "../ZimaSignUpForm";

export default function ZimaSignUpPage() {
  return (
    <Suspense fallback={null}>
      <ZimaAuthShell artImageSrc="/zima/login-art.png">
        <ZimaSignUpForm />
      </ZimaAuthShell>
    </Suspense>
  );
}
