"use client";

import { useMutation } from "convex/react";
import { useEffect, useState, type FormEvent } from "react";
import { ProfileAvatarUpload } from "../../../components/profile/ProfileAvatarUpload";
import { api } from "../../../convex/_generated/api";
import { jetbrainsMono } from "../../../fonts";
import {
  ZimaAuthError,
  ZimaAuthField,
  ZimaAuthTextarea,
} from "./ZimaAuthUI";

const HOPAMINE_BLUE = "#00a6f3";

export type ZimaProfileData = {
  name: string;
  username?: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
};

type ZimaProfileEditModalProps = {
  user: ZimaProfileData;
  onClose: () => void;
};

export function ZimaProfileEditModal({
  user,
  onClose,
}: ZimaProfileEditModalProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user.name);
    setUsername(user.username ?? "");
    setBio(user.bio ?? "");
    setLocation(user.location ?? "");
  }, [user]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
      });
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-md max-h-[min(90dvh,720px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-none"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2
            className={`${jetbrainsMono.className} text-[13px] font-semibold uppercase tracking-wide text-neutral-900`}
          >
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`${jetbrainsMono.className} text-[13px] font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-neutral-900`}
          >
            Close
          </button>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {error ? <ZimaAuthError message={error} /> : null}

            <div className="flex justify-start">
              <ProfileAvatarUpload
                avatarUrl={user.avatarUrl}
                name={name}
                size={96}
                variant="light"
                controls="link"
                pickerLabel="Change profile"
                shape="circle"
                dithered={false}
              />
            </div>

            <ZimaAuthField
              id="zima-profile-name"
              label="Name"
              variant="rounded"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
            />

            <ZimaAuthField
              id="zima-profile-username"
              label="Username"
              variant="rounded"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="hopamine-handle"
              autoComplete="username"
            />

            <ZimaAuthField
              id="zima-profile-location"
              label="Location"
              variant="rounded"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, country"
              autoComplete="address-level2"
            />

            <ZimaAuthTextarea
              id="zima-profile-bio"
              label="Bio"
              variant="rounded"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="A short intro about you…"
              rows={4}
            />

          </div>

          <div className="border-t border-neutral-200 px-5 py-4">
            <button
              type="submit"
              disabled={saving}
              className={`${jetbrainsMono.className} flex h-12 w-full items-center justify-center rounded-xl px-6 text-[15px] font-semibold uppercase tracking-wide text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40`}
              style={{ backgroundColor: HOPAMINE_BLUE }}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
