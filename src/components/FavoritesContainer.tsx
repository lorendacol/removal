import { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAvatar,
  IonCol,
  IonRow,
  IonText,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { heart, chevronDownCircleOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
}

interface FavoritePost extends Post {
  favorite_id: string;
}

interface SupabaseFavorite {
  favorite_id: string;
  post_id: string;
  posts: Post | null;
}

const FavoritesContainer: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setUser(authData.user);
        await fetchFavorites(authData.user.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setToastMessage('Error loading user data');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data: rawData, error } = await supabase
        .from('favorites')
        .select(`
          favorite_id,
          post_id,
          posts (
            post_id,
            user_id,
            username,
            avatar_url,
            post_content,
            post_created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!rawData) {
        setFavorites([]);
        return;
      }

      const data = rawData as unknown as SupabaseFavorite[];
      
      const validFavorites = data
        .filter((fav): fav is SupabaseFavorite & { posts: Post } => fav.posts !== null)
        .map(fav => ({
          favorite_id: fav.favorite_id,
          ...fav.posts
        }));

      setFavorites(validFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setToastMessage('Error loading favorites');
      setShowToast(true);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('favorite_id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        setToastMessage('Error removing from favorites');
        setShowToast(true);
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.favorite_id !== favoriteId));
      setToastMessage('Post removed from favorites');
      setShowToast(true);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setToastMessage('Error removing from favorites');
      setShowToast(true);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    try {
      if (user) {
        await fetchFavorites(user.id);
      }
    } finally {
      event.detail.complete();
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <IonSpinner />
      </div>
    );
  }

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent
          pullingIcon={chevronDownCircleOutline}
          pullingText="Pull to refresh"
          refreshingSpinner="circles"
          refreshingText="Refreshing...">
        </IonRefresherContent>
      </IonRefresher>

      <div className="ion-padding">
        {favorites.length > 0 ? (
          favorites.map(post => (
            <IonCard key={post.favorite_id} style={{ marginTop: '1rem' }}>
              <IonCardHeader>
                <IonRow>
                  <IonCol size="1.85">
                    <IonAvatar>
                      <img 
                        src={post.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                        alt={post.username}
                      />
                    </IonAvatar>
                  </IonCol>
                  <IonCol>
                    <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                    <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                  </IonCol>
                  <IonCol size="auto">
                    <IonButton 
                      fill="clear" 
                      onClick={() => removeFavorite(post.favorite_id)}
                    >
                      <IonIcon slot="icon-only" icon={heart} color="danger" />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardHeader>
              <IonCardContent>
                <IonText style={{ color: 'black' }}>
                  <h1>{post.post_content}</h1>
                </IonText>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <IonText color="medium">
              <h2>No favorite posts yet</h2>
              <p>Your favorite posts will appear here</p>
            </IonText>
          </div>
        )}
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="primary"
      />
    </>
  );
};

export default FavoritesContainer; 