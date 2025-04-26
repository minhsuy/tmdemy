interface IActiveLink {
  url: string;
  children: React.ReactNode;
}
interface IMenuItem {
  icon?: React.ReactNode;
  url: string;
  title: string;
}
interface IMenuItems {
  id: number;
  url: string;
  title: string;
  icon?: React.ReactNode;
}
interface ICourseInfo {
  title: string | number;
  icon: (classname: string) => React.ReactNode;
}
