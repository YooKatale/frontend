import React, { useEffect } from 'react';

function RemoveWhatsAppQuickOrder() {
  useEffect(() => {
    // Function to remove the WhatsApp quick order button.
    const removeButton = () => {
      const whatsappButton = document.getElementById('whatsapp-button');
      if (whatsappButton) {
        whatsappButton.remove();
      }
    };

    // Run the removeButton function when the component mounts.
    removeButton();

    // Optional: If the WhatsApp button is added dynamically after page load,
    // you can use a MutationObserver to watch for changes and remove it.
    const observer = new MutationObserver(() => {
      removeButton();
    });

    observer.observe(document.body, {
      childList: true, // Watch for changes in the DOM tree.
      subtree: true,   // Watch all descendants of the body element.
    });

    // Cleanup: Disconnect the observer when the component unmounts.
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything.
}

export default RemoveWhatsAppQuickOrder;

