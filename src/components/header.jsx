import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo192.png";

function NavBar() {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossorigin="anonymous"
        />
        <style>{`
          body {
            font-weight: 600;
          }
        `}</style>
      </head>
      <body >
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <div className="d-flex align-items-center"> {/* Added a div to hold the logo and text */}
              <img
                src={logo}
                alt="Logo"
                height="40"
                className="d-inline-block align-top"
                style={{ marginLeft: "10px" }}
              />
              <Link className="navbar-brand ml-2" to="/" style={{ marginTop: "-5px" }}> {/* Added ml-2 class for left margin */}
                Zoozo Sellers
              </Link>
            </div>
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin-home" exact>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/sales" exact>
                  Sales
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/top-sellers">
                  Top Sellers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/settings" exact>
                  Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout" exact>
                  Log Out
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </body>
    </html>
  );
}

export default NavBar;
