import React from "react";

export type IconName =
  | "home"
  | "tech"
  | "food"
  | "transport"
  | "hobby"
  | "plant"
  | "box"
  | "bag"
  | "star"
  | "right"
  | "left"
  | "share"
  | "shield"
  | "chat"
  | "bell"
  | "gear"
  | "globe"
  | "phone"
  | "mail"
  | "exit"
  | "tag"
  | "help"
  | "heart"
  | "cart"
  | "user"
  | "search"
  | "check";

interface IconProps {
  name: IconName | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  style,
}) => {
  const isStar = name === "star";

  const renderContent = () => {
    switch (name) {
      case "home":
        return <path d="M3 10.5 12 3l9 7.5V21h-6v-6h-6v6H3z" />;
      case "tech":
        return <path d="M13 2 4.5 13.5H11L9.5 22 19 10.5h-6.5L13 2z" />;
      case "food":
        return (
          <>
            <path d="M5 3v7a3 3 0 0 0 6 0V3M8 10v11M19 3c-2.2 2.4-3 5.6-3 9h3v9" />
          </>
        );
      case "transport":
        return (
          <>
            <circle cx="6" cy="17" r="3.2" />
            <circle cx="18" cy="17" r="3.2" />
            <path d="M6 17l3-8h6l3 8M9 9 8 6h3" />
          </>
        );
      case "hobby":
        return (
          <>
            <circle cx="6.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="15.5" r="2.5" />
            <path d="M9 17.5V5.5l11-2v12" />
          </>
        );
      case "plant":
        return (
          <path d="M12 21v-8M12 13c0-4-3-6-6-6 0 4 3 6 6 6zM12 13c0-4 3-6 6-6 0 4-3 6 6 6z" />
        );
      case "box":
        return (
          <>
            <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" />
          </>
        );
      case "bag":
        return (
          <>
            <path d="M6 7h12l1.2 14H4.8L6 7zM9 7a3 3 0 0 1 6 0" />
          </>
        );
      case "star":
        return (
          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
        );
      case "right":
        return <path d="M9 5l7 7-7 7" />;
      case "left":
        return <path d="M15 5l-7 7 7 7" />;
      case "share":
        return (
          <>
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="17" cy="6" r="2.5" />
            <circle cx="17" cy="18" r="2.5" />
            <path d="M8.2 10.8l6.6-3.6M8.2 13.2l6.6 3.6" />
          </>
        );
      case "shield":
        return (
          <>
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </>
        );
      case "chat":
        return (
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5z" />
        );
      case "bell":
        return (
          <>
            <path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
            <path d="M10.5 20a2 2 0 0 0 3 0" />
          </>
        );
      case "gear":
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6A7 7 0 0 0 19 12z" />
          </>
        );
      case "globe":
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
          </>
        );
      case "phone":
        return (
          <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        );
      case "mail":
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </>
        );
      case "exit":
        return (
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        );
      case "tag":
        return (
          <>
            <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
            <circle cx="7.5" cy="7.5" r="1.5" />
          </>
        );
      case "help":
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
            <path d="M12 17h.01" />
          </>
        );
      case "heart":
        return (
          <path d="M12 21s-7.5-4.7-9.4-9.3C1.2 8 3.2 4.5 6.6 4.5c2 0 3.8 1.2 5.4 3 1.6-1.8 3.4-3 5.4-3 3.4 0 5.4 3.5 4 7.2C19.5 16.3 12 21 12 21z" />
        );
      case "cart":
        return (
          <>
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="17" cy="20" r="1.5" />
            <path d="M3 3h3l2.5 12.5h10L21 7H7" />
          </>
        );
      case "user":
        return (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
          </>
        );
      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </>
        );
      case "check":
        return <path d="M20 6 9 17l-5-5" />;
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isStar ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={isStar ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {renderContent()}
    </svg>
  );
};
