import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { uploadUserPhoto } from '../../services/firestoreService';
import { Camera, Image as ImageIcon, Plus, ShieldAlert } from 'lucide-react';

export const PhotoGallery = () => {
  const { destinationGuide } = useTrip();
  const user = null; // No auth required - guest mode
  
  const [photos, setPhotos] = useState([
    { url: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=400&q=80', caption: 'Chian Shrine Lanterns' },
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80', caption: 'Autumn Pagoda viewpoint' }
  ]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const destination = destinationGuide?.queryDestination || '';

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !destination) return;

    setUploading(true);
    setError(null);
    try {
      let downloadUrl = '';
      if (user) {
        // Upload to Firebase Storage
        downloadUrl = await uploadUserPhoto(user.uid, file);
      } else {
        // Guest fallback: mock upload using temporary URL/ObjectReader
        downloadUrl = URL.createObjectURL(file);
      }

      setPhotos(prev => [
        { url: downloadUrl, caption: file.name.split('.')[0] },
        ...prev
      ]);
    } catch (err) {
      setError('Failed to upload photo. Ensure you have network connectivity.');
    } finally {
      setUploading(false);
    }
  };

  if (!destinationGuide) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-1 flex items-center space-x-2">
              <Camera className="text-indigo-650 dark:text-indigo-400" />
              <span>Cultural Image Chronicles</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse photo memories uploaded by community travelers in {destination}.
            </p>
          </div>

          {/* Upload Button */}
          <label className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-colors shrink-0">
            <Plus size={14} />
            <span>{uploading ? 'Uploading...' : 'Add Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs border rounded mb-4">
            {error}
          </div>
        )}

        {/* Photo guidelines notice */}
        <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border flex items-start space-x-2 mb-6 text-[10px] text-slate-500 dark:text-slate-450">
          <ShieldAlert size={14} className="shrink-0 text-orange-500 mt-0.5" />
          <span>Note: Please respect privacy limits, sacred spaces, and photography bans. Do not upload photos containing visible children, closed ritual chambers, or sensitive landmarks.</span>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((p, index) => (
            <div
              key={index}
              className="group relative h-40 border rounded-lg overflow-hidden bg-slate-100 shadow-sm transition-theme cursor-pointer"
            >
              <img
                src={p.url}
                alt={p.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[10px] text-white font-semibold truncate w-full">{p.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
