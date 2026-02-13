import React from 'react';

const PostList = ({ posts, onDeletePost }) => {
  if (posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No blog posts yet. Create your first post above!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2 className="post-list-title">Blog Posts ({posts.length})</h2>
      <div className="posts-grid">
        {posts.map((post) => {
          // Check if post has image attachments
          const hasImages = post.attachments && post.attachments.some(att => att.type.startsWith('image/'));
          const imageAttachments = hasImages ? post.attachments.filter(att => att.type.startsWith('image/')) : [];
          const fileAttachments = post.attachments ? post.attachments.filter(att => !att.type.startsWith('image/') && att.type !== 'link') : [];
          const linkAttachments = post.attachments ? post.attachments.filter(att => att.type === 'link') : [];

          return (
            <div key={post.id} className={`post-card ${hasImages ? 'post-card-with-images' : ''}`}>
              {hasImages && (
                <div className="post-image-section">
                  <div className="post-main-image">
                    <img 
                      src={imageAttachments[0].data} 
                      alt={imageAttachments[0].name}
                    />
                  </div>
                  {imageAttachments.length > 1 && (
                    <div className="additional-images">
                      {imageAttachments.slice(1).map(attachment => (
                        <div key={attachment.id} className="thumbnail-image">
                          <img 
                            src={attachment.data} 
                            alt={attachment.name}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="post-content-section">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <span className="post-date">{post.date}</span>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                  
                  {!hasImages && post.attachments && post.attachments.length > 0 && (
                    <div className="post-attachments">
                      <h4 className="attachments-title">Attachments:</h4>
                      <div className="attachments-grid">
                        {post.attachments.map(attachment => (
                          <div key={attachment.id} className="attachment-preview">
                            <div className="attachment-file">
                              <span className="file-icon">📄</span>
                              <span className="file-name">{attachment.name}</span>
                              <span className="file-size">{(attachment.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {fileAttachments.length > 0 && (
                    <div className="post-file-attachments">
                      <h4 className="attachments-title">Files:</h4>
                      <div className="attachments-grid">
                        {fileAttachments.map(attachment => (
                          <div key={attachment.id} className="attachment-preview">
                            <div className="attachment-file">
                              <span className="file-icon">📄</span>
                              <span className="file-name">{attachment.name}</span>
                              <span className="file-size">{(attachment.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {linkAttachments.length > 0 && (
                    <div className="post-link-attachments">
                      <h4 className="attachments-title">Links:</h4>
                      <div className="link-attachments-grid">
                        {linkAttachments.map(link => (
                          <div key={link.id} className="link-attachment-preview">
                            <div className="link-attachment">
                              <span className="link-icon">🔗</span>
                              <div className="link-details">
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="link-title"
                                >
                                  {link.name}
                                </a>
                                <span className="link-url">{link.url}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="post-actions">
                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="delete-btn"
                    aria-label={`Delete post: ${post.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostList;