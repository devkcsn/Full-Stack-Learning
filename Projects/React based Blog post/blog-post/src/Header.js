import React, { useState, useEffect } from 'react';

const Header = () => {
  const [userName, setUserName] = useState('Your Name');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Load user name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('blogUserName');
    if (savedName) {
      setUserName(savedName);
    }
    // Trigger animation after component mounts
    setAnimationKey(prev => prev + 1);
  }, []);

  // Typewriter effect for the welcome text
  useEffect(() => {
    const welcomeText = "Welcome to ";
    const blogText = "'s Blog";
    const fullText = welcomeText + userName + blogText;
    let currentIndex = 0;
    let typeWriterTimer;
    let cursorTimer;
    
    // Reset states
    setDisplayedText('');
    setIsTyping(true);
    setShowCursor(true);

    const typeWriter = () => {
      if (currentIndex < fullText.length) {
        const currentText = fullText.substring(0, currentIndex + 1);
        
        // Create styled text with highlighted user name
        let styledText = currentText;
        const nameStartIndex = welcomeText.length;
        const nameEndIndex = nameStartIndex + userName.length;
        
        if (currentIndex >= nameStartIndex) {
          const beforeName = currentText.substring(0, nameStartIndex);
          const namePartLength = Math.min(currentIndex + 1 - nameStartIndex, userName.length);
          const namePart = userName.substring(0, namePartLength);
          const afterName = currentText.substring(nameEndIndex);
          
          styledText = (
            <span>
              {beforeName}
              <span className="highlighted-name">{namePart}</span>
              {afterName}
            </span>
          );
        }
        
        setDisplayedText(styledText);
        currentIndex++;
        typeWriterTimer = setTimeout(typeWriter, 80); // Type each character every 80ms for faster typing
      } else {
        setIsTyping(false);
        // Keep cursor blinking for 2 seconds after typing completes
        cursorTimer = setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    };

    // Start typing after 0.2 second delay as requested
    const startTimer = setTimeout(typeWriter, 200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(typeWriterTimer);
      clearTimeout(cursorTimer);
    };
  }, [userName, animationKey]); // Re-run when userName changes or animation is triggered

  // Save user name to localStorage whenever it changes
  const saveUserName = (name) => {
    localStorage.setItem('blogUserName', name);
    setUserName(name);
  };

  // Handle clicking on the name to edit
  const handleNameClick = () => {
    setTempName(userName);
    setIsEditing(true);
  };

  // Handle saving the edited name
  const handleNameSave = () => {
    if (tempName.trim()) {
      saveUserName(tempName.trim());
      // Restart animation with new name
      setAnimationKey(prev => prev + 1);
    }
    setIsEditing(false);
  };

  // Handle canceling the edit
  const handleNameCancel = () => {
    setTempName('');
    setIsEditing(false);
  };

  // Handle Enter key press to save
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const floatingIcons = [
    { icon: '📷', id: 1 },
    { icon: '📹', id: 2 },
    { icon: '📓', id: 3 },
    { icon: '✏️', id: 4 },
    { icon: '📝', id: 5 },
    { icon: '📖', id: 6 },
    { icon: '🖊️', id: 7 },
    { icon: '📄', id: 8 },
    { icon: '💻', id: 9 },
    { icon: '🔗', id: 10 },
    { icon: '📱', id: 11 },
    { icon: '🎨', id: 12 }
  ];

  return (
    <header className="header">
      <div className="floating-icons-container">
        {floatingIcons.map((item, index) => (
          <div 
            key={item.id} 
            className={`floating-icon floating-icon-${index + 1}`}
          >
            {item.icon}
          </div>
        ))}
      </div>
      <div className="header-container">
        <h1 className="header-title">
          {isEditing ? (
            <>
              Welcome to{' '}
              <span className="name-editor">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyPress}
                  className="name-input"
                  autoFocus
                  placeholder="Enter your name"
                />
              </span>
              's Blog
            </>
          ) : (
            <div className="typewriter-container">
              <span className="typewriter-text">{displayedText}</span>
              {showCursor && <span className="typewriter-cursor">|</span>}
              {!isTyping && (
                (typeof displayedText === 'string' && displayedText.includes(userName)) ||
                (typeof displayedText === 'object' && displayedText !== null)
              ) && (
                <div 
                  className="edit-overlay"
                  onClick={handleNameClick}
                  title="Click to edit your name"
                />
              )}
            </div>
          )}
        </h1>
        <p className="header-subtitle">Share your thoughts with the world</p>
      </div>
    </header>
  );
};

export default Header;