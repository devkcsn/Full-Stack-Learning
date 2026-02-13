import React from 'react';

const Modal = ({ isOpen, onClose, children, title, isAnimating, buttonPosition }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      
      // Store original scroll position
      const scrollY = window.scrollY;
      
      // Get the scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Add modal-open class and set styles
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      
      // Prevent layout shift by adding padding equal to scrollbar width
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        // Cleanup function
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Remove classes and styles
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.top = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    } else {
      // If modal is not open, ensure cleanup
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.body.style.paddingRight = '';
      document.body.style.top = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`modal-container ${isAnimating ? 'modal-animate-from-button' : ''}`}
        style={{
          '--button-x': `${buttonPosition.x}px`,
          '--button-y': `${buttonPosition.y}px`
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;