import { Suspense } from "react";
import { ZimaAuthShell } from "../ZimaAuthShell";
import { ZimaSignInForm } from "../ZimaSignInForm";

export default function ZimaSignInPage() {
  return (
    <Suspense fallback={null}>
      <ZimaAuthShell artImageSrc="/zima/login-art.png">
        <ZimaSignInForm />
      </ZimaAuthShell>
    </Suspense>
  );
}
