import ProductGrid from '@/components/productgrid/productgrid';
import { Card } from 'react-bootstrap';

export default function Home() {
  return (
    <>
    <Card className="shadow-lg p-4 text-center">
      <h1 className="mb-3">👋 Welcome to the Dashboard!</h1>
      <p className="text-muted">Manage your profile, settings, and more.</p>
      <ProductGrid/>
    </Card>
   
    </>
  );
}
