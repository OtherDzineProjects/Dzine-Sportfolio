import SideBar from "./SideBar";

export default function OrgWrapper({ children }) {
  return (
    <div className="flex flex-row h-[calc(100svh-6.25rem)]">
      <SideBar />
      {children}
    </div>
  );
}
