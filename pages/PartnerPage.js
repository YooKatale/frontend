import VendorForm from './components/vendor-form';
import ThreeInOneDeliveryForm from './components/three-in-one-delivery-form';

// This is the PartnerPage component that displays the vendor form and the three-in-one delivery form.
const PartnerPage = () => {
  return (
    <div>
      <VendorForm />
      <ThreeInOneDeliveryForm />
    </div>
  );
};

export default PartnerPage;

