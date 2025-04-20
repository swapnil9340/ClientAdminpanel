import { useEffect, useState } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../footer/footer';
import NavbarHeader from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <NavbarHeader onToggleSidebar={toggleSidebar} isMobile={isMobile} />

      <Row className="flex-grow-1 m-0">
        {/* Sidebar */}
        <Col
          xs={isMobile ? 12 : isSidebarOpen ? 2 : 1}
          className={`sidebar-container ${isSidebarOpen ? 'open' : 'collapsed'}`}
        >
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </Col>

        {/* Content */}
        <Col
          xs={10}
          md={isSidebarOpen && !isMobile ? 10 : 11}
          className="p-4 transition-content"
        >
          {children}
        </Col>
      </Row>

      <Footer />
    </div>
  );
};

export default Layout;
