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
            ? "relative flex min-h-dvh items-center justify-center bg-white px-6 py-[max(24px,env(safe-area-inset-bottom))]"
            : "relative min-h-dvh bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(80px,env(safe-area-inset-top))]"
        }
      >
        <ZimaLogo
          priority
          className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10"
        />
        {artImageSrc ? (
          <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
            {alert}
            <div className="relative">
              <Image
                src={artImageSrc}
                alt=""
                width={512}
                height={512}
                priority
                className="aspect-square w-full h-auto"
              />
              <div className="absolute inset-x-0 top-6 flex justify-center">
                <ZimaLogo priority linked={false} size="large" />
              </div>
              <div className="absolute inset-x-5 bottom-5">{children}</div>
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
