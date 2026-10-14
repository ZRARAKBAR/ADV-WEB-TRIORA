
function InitialNavbar() {
  return (
    <>
      <div className="announcement-bar">
        Complimentary delivery on orders over Rs. 3,000
      </div>

      <header className="initial-navbar">
        <a className="brand-logo" href="#home">
          TRIORA<span>.</span>
        </a>

        <nav className="initial-nav-links">
          <a href="#home">Home</a>
          <a href="#collections">Collections</a>
          <a href="#products">Shop</a>
          <a href="#about">Our Story</a>
        </nav>

        <a className="nav-cta" href="#products">
          Explore <span aria-hidden="true">↗</span>
        </a>
      </header>
    </>
  );
}

export default InitialNavbar;
