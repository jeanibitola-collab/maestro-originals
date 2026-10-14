import type { IconType } from "react-icons";

export default function ProfileAvatar({
  photoURL,
  name,
  Badge,
}: {
  photoURL?: string | null;
  name: string;
  Badge: IconType;
}) {
  return (
    <div className="relative mx-auto h-28 w-28">
      {photoURL ? (
        <img
          src={photoURL}
          alt=""
          referrerPolicy="no-referrer"
          className="h-28 w-28 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-600 text-5xl font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white ring-2 ring-[var(--background)]">
        <Badge />
      </span>
    </div>
  );
}