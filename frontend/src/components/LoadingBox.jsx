import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  return (
    <Spinner variant="danger" animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
