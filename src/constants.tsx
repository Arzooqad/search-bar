import { BsChat } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { GoPaperclip } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";


export enum TabKey {
  All = "all",
  Files = "files",
  People = "people",
  Lists = "lists",
  Chats = "chats",
}

export const TABS = [
  { key: TabKey.All, label: "All" },
  { key: TabKey.Files, label: "Files", icon: <GoPaperclip size={14} /> },
  { key: TabKey.People, label: "People", icon: <FiUser size={14} /> },
  { key: TabKey.Lists, label: "Lists", icon: <RxHamburgerMenu size={14} /> },
  { key: TabKey.Chats, label: "Chats", icon: <BsChat size={14} /> },
];

export const DROPDOWN_TABS = [
    {
      key: "files",
      label: "Files",
      icon: <GoPaperclip size={16} className="text-gray-400" />,
    },
    {
      key: "people",
      label: "People",
      icon: <FiUser size={16} className="text-gray-400" />,
    },
    {
      key: "chats",
      label: "Chats",
      icon: <BsChat size={16} className="text-gray-400" />,
    },
    {
      key: "lists",
      label: "Lists",
      icon: <RxHamburgerMenu size={16} className="text-gray-400" />,
    },
  ];
  