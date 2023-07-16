const icons = {
  home: "home",
  products: "view_list",
  create: "add_box",
  account: "person",
};

export function Navbar({ layout, page, navigateTo }) {

  return (
    <section className={`flex gap-1.5 ${layout === "mobile" ? "flex-col h-28" : "h-20"}`}>
      <div className="flex items-center h-full w-full bg-secondary rounded-lg">
        <span className={layout === "mobile" ? "pl-6 text-xl" : "pl-8 text-2xl"}>
          NoMise Dashboard
        </span>
      </div>
      <div className="flex gap-1.5 h-full">
        {["home", "products", "create", "account"].map((pageName, index) => (
          <button key={index}
            className={`h-full rounded-lg group parent-component hover:bg-primary ${
              page === pageName ? "bg-primary" : "bg-secondary"
            } ${layout === "mobile" ? "w-full" : "w-20"}`}
            onClick={() => navigateTo(pageName)}
          >
            <span
              className={`material-icons select-none child-component group-hover:text-white ${
                page === pageName ? "text-white" : "text-black"
              } ${layout === "mobile" ? "text-2xl" : "text-3xl"}`}
            >
              {icons[pageName]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
