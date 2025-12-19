// src/hooks/useHomePageData.js
import { useEffect, useState } from 'react';
import { userTourService } from '../services/userTourService';
import { userActivityService } from '../services/userActivityService';
import { userRentalService } from '../services/userRentalService';

export function useHomePageData() {
  const [data, setData] = useState({
    tours: [],
    activities: [],
    rentals: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      // Cek cache dulu
      const cachedData = localStorage.getItem('homepageData');
      const cacheTime = localStorage.getItem('homepageDataTime');
      const now = new Date().getTime();
      
      // Jika cache masih valid (misal 5 menit)
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 300000) {
        setData(JSON.parse(cachedData));
        return;
      }

      setData(prev => ({ ...prev, loading: true }));
      
      try {
        // Fetch semua data paralel
        const [toursRes, activitiesRes, rentalsRes] = await Promise.all([
          userTourService.getAvailableTours(),
          userActivityService.getAvailableActivities(),
          userRentalService.getAvailableRentals()
        ]);

        const newData = {
          tours: toursRes.data.slice(0, 6), // Ambil 6 tour pertama
          activities: activitiesRes.data.slice(0, 6), // Ambil 6 activity pertama
          rentals: rentalsRes.data.slice(0, 6), // Ambil 6 rental pertama
          loading: false,
          error: null
        };

        setData(newData);
        
        // Simpan ke cache
        localStorage.setItem('homepageData', JSON.stringify(newData));
        localStorage.setItem('homepageDataTime', now.toString());
        
      } catch (error) {
        setData({
          tours: [],
          activities: [],
          rentals: [],
          loading: false,
          error: 'Failed to load data'
        });
      }
    };

    fetchData();
  }, []);

  return data;
}