import React, { useState } from 'react';
import { AddFuckupRequest } from '../types/Fuckup';
import './AddFuckupForm.css';

interface AddFuckupFormProps {
  onSubmit: (fuckup: AddFuckupRequest) => void;
  isLoading: boolean;
}

const AddFuckupForm: React.FC<AddFuckupFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<AddFuckupRequest>({
    user: '',
    desc: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.user.trim() && formData.desc.trim()) {
      onSubmit(formData);
      setFormData({ user: '', desc: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="add-fuckup-form">
      <h2>Share Your Fuckup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user">Your Name</label>
          <input
            type="text"
            id="user"
            name="user"
            value={formData.user}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="desc">Fuckup Story</label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Tell us about your IT fuckup..."
            rows={4}
            required
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !formData.user.trim() || !formData.desc.trim()}
        >
          {isLoading ? 'Adding...' : 'Share Fuckup'}
        </button>
      </form>
    </div>
  );
};

export default AddFuckupForm; 