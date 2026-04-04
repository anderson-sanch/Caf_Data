import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({
  title,
  children,
  showSearch = false,
  searchPlaceholder = "",
  searchValue = "",
  onSearchChange,
  showMenu = false,
}) {
  return (
    <main className="dashboard-page">
      <section className="dashboard-layout">
        <Sidebar />

        <section className="content-area">
          <Topbar
            title={title}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            showMenu={showMenu}
          />

          {children}
        </section>
      </section>
    </main>
  );
}

export default Layout;