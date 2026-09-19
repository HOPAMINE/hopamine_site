"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ZimaLogo } from "./ZimaLogo";
import { ZIMA_FIXED_LOGO_POSITION } from "./zimaLogoPlacement";

type ZimaAuthAlertContextValue = {
  setAlert: (alert: ReactNode | null) => void;
};

const ZimaAuthAlertContext = createContext<ZimaAuthAlertContextValue | null>(
  null,
);

export function useZimaAuthAlert() {
  const context = useContext(ZimaAuthAlertContext);
  if (!context) {
    throw new Error("useZimaAuthAlert must be used within ZimaAuthShell");
  }
  return context;
}

type ZimaAuthShellProps = {
  children?: ReactNode;
  title?: string;
  artImageSrc?: string;
};

export function ZimaAuthShell({
  children,
  title,
  artImageSrc,
}: ZimaAuthShellProps) {
  const [alert, setAlert] = useState<ReactNode | null>(null);
  const alertContext = useMemo(() => ({ setAlert }), []);

  return (
    <ZimaAuthAlertContext.Provider value={alertContext}>
      <div
        className={
          artImageSrc
            ? "relative flex min-h-dvh items-center justify-center overflow-y-auto bg-white px-6 py-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]"
            : "relative min-h-dvh bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(80px,env(safe-area-inset-top))]"
        }
      >
        <ZimaLogo
          priority
          className={`${ZIMA_FIXED_LOGO_POSITION} z-10`}
        />
        {artImageSrc ? (
          <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
            {alert}
            <div className="relative w-full overflow-hidden rounded-2xl">
              <Image
                src={artImageSrc}
                alt=""
                fill
                priority
                sizes="(max-width: 512px) 100vw, 32rem"
                className="object-cover object-center"
              />
              <div
                className="relative z-10 flex min-h-[34rem] w-full flex-col sm:min-h-[36rem]"
              >
                <div className="flex justify-center px-5 pt-6 pb-2">
                  <ZimaLogo priority linked={false} size="large" />
                </div>
                <div className="mt-auto flex flex-col px-5 pb-5 pt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-md flex-col gap-8">
            {alert}
            {title ? (
              <h1 className="text-center text-[28px] font-normal leading-tight tracking-[-0.02em] text-[#00a6f3]">
                {title}
              </h1>
            ) : null}
            {children}
          </div>
        )}
      </div>
    </ZimaAuthAlertContext.Provider>
  );
}
