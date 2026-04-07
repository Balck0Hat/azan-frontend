function NavDropdown({ children, activeCard, onChildClick }) {
    return (
        <div className="nav-dropdown">
            {children.map((child) => (
                <button
                    key={child.key}
                    className={`nav-dropdown-item ${activeCard === child.key ? "active" : ""}`}
                    onClick={() => onChildClick(child.key)}
                >
                    <span className="dropdown-icon">{child.icon}</span>
                    <div className="dropdown-text">
                        <span className="dropdown-label">{child.label}</span>
                        <span className="dropdown-desc">{child.desc}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default NavDropdown;
