import VendorForm from './app/vendor-form';
import ThreeInOneDeliveryForm from './app/ThreeInOneDeliveryForm'; // Corrected import name

// This is the PartnerPage component that displays the vendor form and the ThreeInOneDeliveryForm.
const PartnerPage = () => {
  return (
    <div>
      <VendorForm />
      <ThreeInOneDeliveryForm />
    </div>
  );
};

export default PartnerPage;

