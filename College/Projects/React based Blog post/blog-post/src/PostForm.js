import React, { useState } from 'react';

const PostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      // Create file object with preview
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileObj = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result
        };
        setAttachments(prev => [...prev, fileObj]);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const removeAttachment = (fileId) => {
    setAttachments(prev => prev.filter(file => file.id !== fileId));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    // Add http:// if no protocol is provided
    let formattedUrl = linkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (!isValidUrl(formattedUrl)) {
      alert('Please enter a valid URL');
      return;
    }

    const linkObj = {
      id: Date.now() + Math.random(),
      name: linkTitle.trim() || formattedUrl,
      type: 'link',
      url: formattedUrl,
      size: 0 // Links don't have file size
    };

    setAttachments(prev => [...prev, linkObj]);
    setLinkUrl('');
    setLinkTitle('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newPost = {
      id: Date.now(), // Simple ID generation
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString(),
      attachments: attachments
    };

    onAddPost(newPost);
    setTitle('');
    setContent('');
    setAttachments([]);
    setLinkUrl('');
    setLinkTitle('');
  };

  return (
    <form className="post-form horizontal-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title..."
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Post Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              rows="3"
              className="form-textarea"
            />
          </div>
        </div>
        
        <div className="form-column attachments-column">
          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf,.doc,.docx,.txt"
              className="form-file-input compact"
            />
            <div className="file-info">
              <small>Max 5MB per file</small>
            </div>
            
            <div className="link-attachment-section">
              <label className="link-label">Add Link</label>
              <div className="link-input-group">
                <input
                  type="text"
                  placeholder="Enter URL (e.g., example.com)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="link-url-input"
                />
                <input
                  type="text"
                  placeholder="Link title (optional)"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="link-title-input"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="add-link-btn"
                  disabled={!linkUrl.trim()}
                >
                  Add Link
                </button>
              </div>
            </div>
            
            {attachments.length > 0 && (
              <div className="attachments-preview compact">
                <div className="attachment-list horizontal">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="attachment-item compact">
                      {attachment.type === 'link' ? (
                        <div className="link-preview">
                          <span className="link-icon">🔗</span>
                        </div>
                      ) : attachment.type.startsWith('image/') ? (
                        <div className="image-preview">
                          <img src={attachment.data} alt={attachment.name} />
                        </div>
                      ) : (
                        <div className="file-preview">
                          <span className="file-icon">📄</span>
                        </div>
                      )}
                      <div className="file-details">
                        <span className="file-name">{attachment.name}</span>
                        {attachment.type === 'link' ? (
                          <span className="file-url">{attachment.url}</span>
                        ) : (
                          <span className="file-size">{(attachment.size / 1024).toFixed(1)} KB</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="remove-attachment-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn horizontal">
          Add Post
        </button>
      </div>
    </form>
  );
};

export default PostForm;