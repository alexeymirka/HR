import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  ModalHeader,
} from "reactstrap";

function AdminNavbar(props) {
  const history = useHistory();

  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [modalSearch, setmodalSearch] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };
  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };
  const handleLogout = (e) => {
    // (e) => e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("is_superuser");
    localStorage.removeItem("username");
    localStorage.setItem("logged_in", false);
    history.push("/hr/login");
  };
  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              {localStorage.getItem("username") ? (
                <li className="m-3">
                  Добро пожаловать, {localStorage.getItem("username")}!{" "}
                </li>
              ) : (
                <li className="m-3">
                  Войдите в аккаунт или зарегистрируйтесь!
                </li>
              )}
              {localStorage.getItem("is_superuser") == "true" ? (
                <li className="m-3">Администратор</li>
              ) : (
                <li className="m-3">HR</li>
              )}
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="photo">
                    <img
                      alt="..."
                      src={require("assets/img/default-avatar.png")}
                    />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  {localStorage.getItem("username") ? (
                    <NavLink tag="li" onClick={(e) => handleLogout()}>
                      <DropdownItem className="nav-item">Выйти</DropdownItem>
                    </NavLink>
                  ) : (
                    <>
                      <NavLink tag="li">
                        <DropdownItem
                          className="nav-item"
                          href="/hr/registration"
                        >
                          Зарегистрироваться
                        </DropdownItem>
                      </NavLink>
                      <NavLink tag="li">
                        <DropdownItem className="nav-item" href="/hr/login">
                          Войти
                        </DropdownItem>
                      </NavLink>
                    </>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        modalClassName="modal-search"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <ModalHeader>
          <Input placeholder="SEARCH" type="text" />
          <button
            aria-label="Close"
            className="close"
            onClick={toggleModalSearch}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </ModalHeader>
      </Modal>
    </>
  );
}

export default AdminNavbar;
