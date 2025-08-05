import { Button, Nav } from 'react-bootstrap';
import {
  ChevronLeft,
  ChevronRight,
  HouseDoor,
  Person,
  Gear,
  BoxArrowRight,
} from 'react-bootstrap-icons';

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className="d-flex flex-column h-100 px-2 py-3 position-relative">
      {/* Toggle Button */}
      <div className="text-end mb-3">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onToggle}
          className="rounded-circle"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <Nav className="flex-column gap-2">
        <Nav.Link href="/" className="d-flex align-items-center gap-2">
          <HouseDoor />
          {isOpen && 'Product'}
        </Nav.Link>

        <Nav.Link href="/category" className="d-flex align-items-center gap-2">
          <Person />
          {isOpen && 'Category'}
        </Nav.Link>

        {/* <Nav.Link href="/subcategory" className="d-flex align-items-center gap-2">
          <Gear />
          {isOpen && 'SubCategory'}
        </Nav.Link> */}

        <Nav.Link href="#" className="d-flex align-items-center gap-2">
          <BoxArrowRight />
          {isOpen && 'Logout'}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
