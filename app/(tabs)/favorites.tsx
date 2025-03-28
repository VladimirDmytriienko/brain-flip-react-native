import React, { useEffect, useState } from 'react'
import { getStoredData } from '@/services/getData'
import CardList from '@/components/СardList/СardList';

import { Button, SafeAreaView } from 'react-native';
import { toastRef } from '@/components/Toast/Toast';


const Favorites = () => {
  const [favorites, setFavorites] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getStoredData('favorites')
      const asd = await getStoredData('STORAGE_KEY')
      console.log(asd)
      setFavorites(data)
    };

    fetchFavorites();
  }, []);

  return (
    <SafeAreaView>
      <Button title="Показати Toast" onPress={() => toastRef.current("🔔🔔🔔🔔 Сповіщення!")} />
      <CardList questions={favorites} />
    </SafeAreaView>
  )
}

export default Favorites