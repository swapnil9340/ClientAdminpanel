import ProductGrid from '@/components/productgrid/productgrid';
import { Card, Container } from 'react-bootstrap';
import MainLayout from '@/components/layout/Main';

function Home() {
  return (
    <Container className="my-5">
      <Card className="shadow-lg p-4 text-center">
        <h1 className="mb-3">👋 Welcome to the Dashboard!</h1>
        <p className="text-muted">Manage your profile, settings, and more.</p>
        <ProductGrid />
      </Card>
    </Container>
  );
}

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Home;
