export interface SearchResult {
    name: string;
    type: string;
    subtext: string;
    avatar?: string;
    badge?: string;
    link?: string;
    status?:string;
  }
  
  export enum TabKey {
    All = 'all',
    Files = 'files',
    People = 'people',
    Chats = 'chats',
    Lists = 'lists'
  }
  
  export interface Tab {
    key: string;
    label: string;
    icon?: React.ReactNode;
  }
  
  export interface VisibleTabs {
    [TabKey.Files]: boolean;
    [TabKey.People]: boolean;
    [TabKey.Chats]: boolean;
    [TabKey.Lists]: boolean;
  }